using esemenyrendezo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace esemenyrendezo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatMessageController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    var messages = await cx.ChatMessages.OrderBy(m => m.Time).ToListAsync();
                    return Ok(messages);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException?.Message ?? ex.Message);
                }
            }
        }

        [HttpPost("{token}")]
        public async Task<IActionResult> Post(string token, ChatMessage message)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token))
                    {
                        message.Time = DateTime.UtcNow;
                        await cx.ChatMessages.AddAsync(message);
                        await cx.SaveChangesAsync();
                        return Ok("Üzenet sikeresen elküldve.");
                    }
                    else
                    {
                        return BadRequest("Nincs jogosultságod üzenet küldésére.");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException?.Message ?? ex.Message);
                }
            }
        }

        [HttpPut("{token}")]
        public async Task<IActionResult> Put(string token, ChatMessage updatedMessage)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token))
                    {
                        var existingMessage = await cx.ChatMessages.FindAsync(updatedMessage.Id);
                        if (existingMessage == null)
                        {
                            return NotFound("Üzenet nem található.");
                        }

                        existingMessage.Text = updatedMessage.Text;
                        await cx.SaveChangesAsync();
                        return Ok("Üzenet módosítva.");
                    }
                    else
                    {
                        return BadRequest("Nincs jogosultságod az üzenet módosítására.");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException?.Message ?? ex.Message);
                }
            }
        }

        [HttpDelete("{token}/{id}")]
        public async Task<IActionResult> Delete(string token, int id)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (Program.LoggedInUsers.ContainsKey(token))
                    {
                        var message = await cx.ChatMessages.FindAsync(id);
                        if (message == null)
                        {
                            return NotFound("Üzenet nem található.");
                        }

                        cx.ChatMessages.Remove(message);
                        await cx.SaveChangesAsync();
                        return Ok("Üzenet törölve.");
                    }
                    else
                    {
                        return BadRequest("Nincs jogosultságod az üzenet törlésére.");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException?.Message ?? ex.Message);
                }
            }
        }
    }
}
