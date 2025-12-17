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

namespace ToeicMaster.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                balance = user.Balance, 
                isPremium = user.IsPremium, 
                premiumExpiredAt = user.PremiumExpiredAt 
            });
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
                new Claim("IsPremium", (user.IsPremium ?? false).ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7), // Access Token sống 7 ngay
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