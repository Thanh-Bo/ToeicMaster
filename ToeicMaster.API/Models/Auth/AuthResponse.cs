namespace ToeicMaster.API.Models.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = null!; // Access Token
        public string RefreshToken { get; set; } = null!;
        public UserDto User { get; set; } = null!;
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public decimal Balance { get; set; }
        public bool IsPremium { get; set; }
    }
}