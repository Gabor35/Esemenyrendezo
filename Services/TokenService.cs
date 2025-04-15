// Services/TokenService.cs
using esemenyrendezo.Models;

public class TokenService
{
    private readonly IConfiguration _configuration;
    private const int ACCESS_TOKEN_EXPIRY_MINUTES = 15;
    private const int REFRESH_TOKEN_EXPIRY_DAYS = 7;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateAccessToken()
    {
        return Guid.NewGuid().ToString(); // Using your existing token generation logic
    }

    public RefreshToken GenerateRefreshToken()
    {
        return new RefreshToken
        {
            Token = Guid.NewGuid().ToString(),
            ExpiryDate = DateTime.UtcNow.AddDays(REFRESH_TOKEN_EXPIRY_DAYS)
        };
    }

    public bool ValidateRefreshToken(Felhasznalo user, string refreshToken)
    {
        if (user.RefreshToken != refreshToken ||
            user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return false;

        return true;
    }
}