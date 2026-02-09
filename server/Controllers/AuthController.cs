using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IChatService _chatService;

    public AuthController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<User>> Login([FromBody] LoginRequest request)
    {
        var user = await _chatService.AuthenticateAsync(request.Username, request.Password);
        if (user == null)
        {
            return Unauthorized("Invalid username or password");
        }
        return Ok(user);
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register([FromBody] RegisterRequest request)
    {
        var user = await _chatService.RegisterAsync(request.Username, request.Password, request.DisplayName);
        if (user == null)
        {
            return BadRequest("Username already exists");
        }
        return Ok(user);
    }
}
