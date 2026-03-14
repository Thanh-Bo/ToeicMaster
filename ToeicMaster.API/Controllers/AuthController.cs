using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using Google.Apis.Auth;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthController(AppDbContext context, IConfiguration configuration , IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        // 1. REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Check email trùng
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng." });
            }

            // Hash password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Tạo User mới
            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                FullName = request.FullName,
                CreatedAt = DateTime.UtcNow,
                Balance = 0,
                IsPremium = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                // 1. Xác thực Token với Google (Quan trọng!)
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);

                // payload chứa thông tin user: payload.Email, payload.Name, payload.Picture...

                // 2. Kiểm tra xem Email này đã có trong DB chưa
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);

                if (user == null)
                {
                    // 3. Nếu chưa có -> Tự động Đăng ký (Register)
                    user = new User
                    {
                        Email = payload.Email,
                        FullName = payload.Name,
                        AvatarUrl = payload.Picture,
                        Role = "User", // Mặc định là User thường
                        PasswordHash = "", // Không cần pass vì login bằng GG

                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                // 4. Tạo JWT Token của riêng hệ thống bạn (Access Token)
                // Hàm này bạn tự viết hoặc dùng logic JWT hiện tại của bạn
                var accessToken = GenerateAccessToken(user);

                return Ok(new
                {
                    token = accessToken,
                    user = new { user.Email, user.FullName, user.AvatarUrl },

                });
            }
            catch (InvalidJwtException)
            {
                return BadRequest("Token Google không hợp lệ.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi server: " + ex.Message);
            }
        }

        // 2. LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Check if email exist in database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // Verify Password
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
            }

            // Tạo Tokens
            var accessToken = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken();

            // Lưu RefreshToken vào DB
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // Hết hạn sau 7 ngày
            await _context.SaveChangesAsync();

            return Ok(new AuthResponse
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Balance = user.Balance ?? 0,
                    IsPremium = user.IsPremium ?? false
                }
            });
        }

        // 3. REFRESH TOKEN
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequest request)
        {
            if (request is null) return BadRequest("Invalid client request");

            // Lấy User từ DB dựa vào Refresh Token
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return BadRequest(new { message = "Refresh token không hợp lệ hoặc đã hết hạn." });
            }

            // Tạo Token mới
            var newAccessToken = GenerateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken();

            // Cập nhật DB
            user.RefreshToken = newRefreshToken;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            // 1. Tìm user theo email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) return BadRequest("Email không tồn tại trong hệ thống.");

            // 2. Tạo mã OTP ngẫu nhiên (6 số)
            var otp = new Random().Next(100000, 999999).ToString();

            // 3. Lưu OTP vào DB
            user.OtpCode = otp;
            user.OtpExpiryTime = DateTime.Now.AddMinutes(5); // Hết hạn sau 5 phút
            await _context.SaveChangesAsync();

            // 4. Gửi Email
            string emailBody = $@"
        <h3>Xin chào {user.FullName},</h3>
        <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
        <p>Mã xác thực của bạn là: <b style='font-size: 20px; color: blue;'>{otp}</b></p>
        <p>Mã này sẽ hết hạn sau 5 phút.</p>";

            await _emailService.SendEmailAsync(user.Email, "Mã xác thực quên mật khẩu", emailBody);

            return Ok("Đã gửi mã OTP vào email của bạn.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) return BadRequest("Lỗi hệ thống.");

            // 1. Kiểm tra OTP
            if (user.OtpCode != request.Otp || user.OtpExpiryTime < DateTime.Now)
            {
                return BadRequest("Mã OTP không đúng hoặc đã hết hạn.");
            }

            // 2. Đổi mật khẩu
            // Lưu ý: Nhớ Hash mật khẩu mới trước khi lưu nhé!
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            // 3. Xóa OTP sau khi dùng xong để tránh dùng lại
            user.OtpCode = null;
            user.OtpExpiryTime = null;

            await _context.SaveChangesAsync();

            return Ok("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
        }
        // 4. GET ME (Lấy thông tin bản thân)
        [Authorize] // Yêu cầu phải có Token mới gọi được
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            // Lấy UserID từ Token (Claim)
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();

            var userId = int.Parse(userIdStr);
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound();

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role ?? "User",
                balance = user.Balance,
                isPremium = user.IsPremium,
                premiumExpiredAt = user.PremiumExpiredAt
            });
        }

        // 5. UPDATE PROFILE
        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();

            var userId = int.Parse(userIdStr);
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound();

            // Validate
            if (string.IsNullOrWhiteSpace(request.FullName))
            {
                return BadRequest(new { message = "Họ tên không được để trống." });
            }

            // Update
            user.FullName = request.FullName.Trim();
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thông tin thành công!",
                fullName = user.FullName
            });
        }

        // 6. CHANGE PASSWORD
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();

            var userId = int.Parse(userIdStr);
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound();

            // Validate current password
            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Mật khẩu hiện tại không đúng." });
            }

            // Validate new password
            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự." });
            }

            // Update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        // --- PRIVATE HELPER METHODS ---

        private string GenerateAccessToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("IsPremium", (user.IsPremium ?? false).ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };
            // Use shorter expiry in development
    var expiryMinutes = int.TryParse(_configuration["Jwt:AccessTokenExpiryMinutes"], out var minutes) 
        ? minutes 
        : 1440; // Default 1 day

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}