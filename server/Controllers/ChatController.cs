using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
        return Ok(await _chatService.GetUsersAsync());
    }

    [HttpGet("messages")]
    public async Task<ActionResult<List<Message>>> GetMessages()
    {
        // simplistic: get all messages
        return Ok(await _chatService.GetMessagesAsync(0));
    }
    
    [HttpPost("messages")]
    public async Task<ActionResult> AddMessage([FromBody] Message message)
    {
        await _chatService.AddMessageAsync(message);
        return Ok();
    }
}
