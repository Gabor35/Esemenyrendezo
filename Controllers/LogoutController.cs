using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace esemenyrendezo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogoutController : ControllerBase
    {
        [HttpPost("{uId}")]

        public IActionResult Logout(string uId)
        {
            if (Program.LoggedInUsers.ContainsKey(uId))
            {
                Program.LoggedInUsers.Remove(uId);
                return Ok("Sikeres kijelentkezés.");
            }
            else
            {
                return BadRequest("Sikertelen kijelentkezés.");
            }
        }


    }
}
