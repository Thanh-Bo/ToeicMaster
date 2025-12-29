namespace ToeicMaster.API.Models.Auth
{
    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }

        public class ResetPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        
        public string Otp { get; set; } = string.Empty; // Mã OTP người dùng nhập
        
        public string NewPassword { get; set; } = string.Empty; // Mật khẩu mới muốn đổi
    }
}
