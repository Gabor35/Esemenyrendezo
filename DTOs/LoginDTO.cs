namespace esemenyrendezo.DTOs
{
    public class LoginDTO
    {
        public string LoginName { get; set; }
        public string TmpHash { get; set; }
    }

    public class TokenDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
