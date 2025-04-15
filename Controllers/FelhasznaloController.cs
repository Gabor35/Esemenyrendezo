using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using esemenyrendezo.Models;
using esemenyrendezo.DTOs;
using Microsoft.EntityFrameworkCore;
using esemenyrendezo.DTOs;
using esemenyrendezo;
using esemenyrendezo.Models;

namespace ProjektNeveBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("UserEmailName/{token}")]

        public async Task<IActionResult> GetUserEmailName(string token)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token) && Program.LoggedInUsers[token].Jogosultsag == 9)
                    {
                        return Ok(await cx.Felhasznalos.Select(f => (new UserEmailNameDTO { Email = f.Email, TeljesNev = f.TeljesNev })).ToListAsync());
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

        [HttpGet("{token}")]

        public async Task<IActionResult> Get(string token)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token) && Program.LoggedInUsers[token].Jogosultsag == 9)
                    {
                        return Ok(await cx.Felhasznalos.ToListAsync());
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

        [HttpPost("{token}")]

        public async Task<IActionResult> Post(string token, Felhasznalo felhasznalo)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token) && Program.LoggedInUsers[token].Jogosultsag == 9)
                    {
                        await cx.Felhasznalos.AddAsync(felhasznalo);
                        await cx.SaveChangesAsync();
                        return Ok("Új felhasználó felvéve.");
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

        [HttpPut("{token}")]

        public IActionResult Put(string token, Felhasznalo felhasznalo)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token) && Program.LoggedInUsers[token].Jogosultsag == 9)
                    {
                        cx.Felhasznalos.Update(felhasznalo);
                        cx.SaveChanges();
                        return Ok("A felhasználó adatai módosítva.");
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

        [HttpDelete("{token},{id}")]

        public IActionResult Delete(string token, int id)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token) && Program.LoggedInUsers[token].Jogosultsag == 9)
                    {
                        cx.Felhasznalos.Remove(new Felhasznalo { Id = id });
                        cx.SaveChanges();
                        return Ok("A felhasználó adatai törölve.");
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
    }
}



