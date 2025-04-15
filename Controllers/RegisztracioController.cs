using esemenyrendezo.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace esemenyrendezo.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class RegisztracioController : ControllerBase
    {

        [HttpPost]

        public async Task<IActionResult> Regisztracio(Felhasznalo felhasznalo)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (cx.Felhasznalos.FirstOrDefault(f => f.FelhasznaloNev == felhasznalo.FelhasznaloNev) != null)
                    {
                        return Ok("Már létezik ilyen felhasználónév!");
                    }
                    if (cx.Felhasznalos.FirstOrDefault(f => f.Email == felhasznalo.Email) != null)
                    {
                        return Ok("Ezzel az Email cimmel már regisztráltak!");
                    }
                    felhasznalo.Jogosultsag = 1;
                    felhasznalo.Aktiv = 0;
                    felhasznalo.Hash=Program.CreateSHA256(felhasznalo.Hash);
                    await cx.Felhasznalos.AddAsync(felhasznalo);
                    await cx.SaveChangesAsync();
                    Program.SendEmail(felhasznalo.Email, "Regisztració", $"http://localhost:5106/api/Regisztracio?felhasznaloNev={felhasznalo.FelhasznaloNev}&email={felhasznalo.Email}");

                    return Ok("Sikeres regisztráció. Fejezebe a regiszttrációját az e-mail címére küldött link segítségével!");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpGet("{token},{id}")]

        public async Task<IActionResult> Get(string token, int id)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token) && Program.LoggedInUsers[token].Jogosultsag == 9)
                    {
                        return Ok(await cx.Felhasznalos.FirstOrDefaultAsync(f => f.Id == id));
                    }
                    else
                    {
                        return BadRequest("Nincs jogod hozzá!");
                    }
                }
                catch (Exception ex)
                {
                    //return BadRequest(ex.Message);
                    return BadRequest(ex.InnerException?.Message);
                }
            }
        }


        [HttpGet]

        public async Task<IActionResult> Regisztraciobefejezese(string felhasznaloNev,string email)
        {
            using (var cx=new EsemenyrendezoContext()) 
            {
                Felhasznalo felhasznalo = await cx.Felhasznalos.FirstOrDefaultAsync(f => f.FelhasznaloNev == felhasznaloNev && f.Email == email);
                if (felhasznalo == null)
                {
                    return Ok("Sikertelen a regisztráció befejezése!");
                }
                else
                {
                    felhasznalo.Aktiv = 1;
                    cx.Felhasznalos.Update(felhasznalo);
                    return Ok("A regisztráció befejezése sikeresen megtörtént.");
                }
            }
            return null;
        }
    }
}
