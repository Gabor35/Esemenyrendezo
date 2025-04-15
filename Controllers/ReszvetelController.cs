using esemenyrendezo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace esemenyrendezo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReszvetelController : ControllerBase
    {
        [HttpGet("saved/{token}")]
        public async Task<IActionResult> GetSavedEvents(string token)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (!Program.LoggedInUsers.ContainsKey(token))
                    {
                        return Unauthorized("Invalid or expired token");
                    }

                    var userId = Program.LoggedInUsers[token].Id;

                    // Get all events saved by the user
                    var savedEvents = await cx.Reszvetels
                        .Where(r => r.FelhasznaloId == userId)
                        .Include(r => r.Esemeny)
                        .Select(r => r.Esemeny)
                        .ToListAsync();

                    return Ok(savedEvents);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException?.Message ?? ex.Message);
                }
            }
        }

        [HttpPost("{token}/{esemenyId}")]
        public async Task<IActionResult> SaveEvent(string token, int esemenyId)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (!Program.LoggedInUsers.ContainsKey(token))
                    {
                        return Unauthorized("Invalid or expired token");
                    }

                    var userId = Program.LoggedInUsers[token].Id;

                    // Check if the event exists
                    var esemeny = await cx.Esemenies.FindAsync(esemenyId);
                    if (esemeny == null)
                    {
                        return NotFound("Event not found");
                    }
                     Reszvetel reszvetel;
                    // Check if already saved
                    var existing = await cx.Reszvetels
                        .FirstOrDefaultAsync(r => r.FelhasznaloId == userId && r.EsemenyId == esemenyId);

                    if (existing != null)
                    {
                        if (existing.Visszajelzes == 1)
                        {
                            existing.Visszajelzes = 0;
                        }
                        else
                        {
                            existing.Visszajelzes = 1;
                        }
                        
                         cx.Reszvetels.Update(existing);
                    }
                    else
                    {
                        reszvetel = new Reszvetel
                        {
                            FelhasznaloId = userId,
                            EsemenyId = esemenyId,
                            Visszajelzes = 1
                        };
                        cx.Reszvetels.Add(reszvetel);
                    }
                   
                    await cx.SaveChangesAsync();

                    return Ok("Event saved successfully");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException?.Message ?? ex.Message);
                }
            }
        }

        [HttpDelete("{token}/{esemenyId}")]
        public async Task<IActionResult> UnsaveEvent(string token, int esemenyId)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (!Program.LoggedInUsers.ContainsKey(token))
                    {
                        return Unauthorized("Invalid or expired token");
                    }

                    var userId = Program.LoggedInUsers[token].Id;

                    // Find the participation record
                    var reszvetel = await cx.Reszvetels
                        .FirstOrDefaultAsync(r => r.FelhasznaloId == userId && r.EsemenyId == esemenyId);

                    if (reszvetel == null)
                    {
                        return NotFound("Event not saved");
                    }

                    // Remove the participation record
                    cx.Reszvetels.Remove(reszvetel);
                    await cx.SaveChangesAsync();

                    return Ok("Event unsaved successfully");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException?.Message ?? ex.Message);
                }
            }
        }

        [HttpGet("check/{token}/{esemenyId}")]
        public async Task<IActionResult> CheckIfSaved(string token, int esemenyId)
        {
            using (var cx = new EsemenyrendezoContext())
            {
                try
                {
                    if (!Program.LoggedInUsers.ContainsKey(token))
                    {
                        return Unauthorized("Invalid or expired token");
                    }

                    var userId = Program.LoggedInUsers[token].Id;

                    // Check if the event is saved by the user
                    var isSaved = await cx.Reszvetels
                        .AnyAsync(r => r.FelhasznaloId == userId && r.EsemenyId == esemenyId);

                    return Ok(isSaved);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException?.Message ?? ex.Message);
                }
            }
        }
    }
}