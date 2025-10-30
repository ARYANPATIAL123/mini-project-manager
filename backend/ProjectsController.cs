using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagerAPI.Data;
using ProjectManagerAPI.Models;
using System.Security.Claims;

namespace ProjectManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProjectsController(AppDbContext db) { _db = db; }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = GetUserId();
        var projects = await _db.Projects.Include(p => p.Tasks).Where(p => p.UserId == userId).ToListAsync();
        return Ok(projects);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Project p)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        p.UserId = GetUserId();
        p.CreatedAt = DateTime.UtcNow;
        _db.Projects.Add(p);
        await _db.SaveChangesAsync();
        return Ok(p);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var p = await _db.Projects.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (p == null) return NotFound();
        _db.Projects.Remove(p);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
