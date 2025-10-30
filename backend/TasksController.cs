using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagerAPI.Data;
using ProjectManagerAPI.Models;
using System.Security.Claims;

namespace ProjectManagerAPI.Controllers;

[ApiController]
[Route("api/projects/{projectId}/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;
    public TasksController(AppDbContext db) { _db = db; }
    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll(int projectId)
    {
        var userId = GetUserId();
        var project = await _db.Projects.Include(p => p.Tasks).FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
        if (project == null) return NotFound();
        return Ok(project.Tasks);
    }

    [HttpPost]
    public async Task<IActionResult> Create(int projectId, [FromBody] TaskItem t)
    {
        var userId = GetUserId();
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
        if (project == null) return NotFound();
        t.ProjectId = projectId;
        _db.Tasks.Add(t);
        await _db.SaveChangesAsync();
        return Ok(t);
    }

    [HttpPut("{taskId}")]
    public async Task<IActionResult> Toggle(int projectId, int taskId)
    {
        var userId = GetUserId();
        var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectId == projectId && t.Project!.UserId == userId);
        if (task == null) return NotFound();
        task.IsCompleted = !task.IsCompleted;
        await _db.SaveChangesAsync();
        return Ok(task);
    }

    [HttpDelete("{taskId}")]
    public async Task<IActionResult> Delete(int projectId, int taskId)
    {
        var userId = GetUserId();
        var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectId == projectId && t.Project!.UserId == userId);
        if (task == null) return NotFound();
        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
