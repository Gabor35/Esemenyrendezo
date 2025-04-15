using esemenyrendezo.DTOs;
using esemenyrendezo.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace esemenyrendezo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EsemenyController : ControllerBase
    {



        [HttpGet]

        public async Task<IActionResult> Get()
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {

                    return Ok(cx.Esemenies.ToList());

                }
                catch (Exception ex)
                {
                    //return BadRequest(ex.Message);
                    return BadRequest(ex.InnerException?.Message);
                }
            }
        }

        [HttpPost("{token}")]

        public async Task<IActionResult> Post(string token, Esemeny esemeny)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token) && Program.LoggedInUsers[token].Jogosultsag == 9)
                    {
                        await cx.Esemenies.AddAsync(esemeny);
                        await cx.SaveChangesAsync();
                        return Ok("Új esemény felvéve.");
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

        public IActionResult Put(string token, Esemeny esemeny)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token) && Program.LoggedInUsers[token].Jogosultsag == 9)
                    {
                        cx.Esemenies.Update(esemeny);
                        cx.SaveChanges();
                        return Ok("Az esemény adatai módosítva.");
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
                        cx.Esemenies.Remove(new Esemeny { Id = id });
                        cx.SaveChanges();
                        return Ok("Az Esemény adatai törölve.");
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
