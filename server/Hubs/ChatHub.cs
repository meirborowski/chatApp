using Microsoft.AspNetCore.SignalR;
using Server.Models;
using Server.Services;

namespace Server.Hubs;

public class ChatHub : Hub
{
    private readonly IChatService _chatService;

    public ChatHub(IChatService chatService)
    {
        _chatService = chatService;
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var userIdStr = httpContext?.Request.Query["userId"];
        
        if (int.TryParse(userIdStr, out int userId))
        {
            Context.Items["UserId"] = userId;
            await _chatService.UpdateUserStatusAsync(userId, "online");
            await Clients.All.SendAsync("UserStatusChanged", userId, "online", "");
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (Context.Items.TryGetValue("UserId", out var userIdObj) && userIdObj is int userId)
        {
            await _chatService.UpdateUserStatusAsync(userId, "offline");
            await Clients.All.SendAsync("UserStatusChanged", userId, "offline", DateTime.UtcNow.ToString("O"));
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string user, string message)
    {
        int senderId = 0;
        if (Context.Items.TryGetValue("UserId", out var userIdObj) && userIdObj is int userId)
        {
            senderId = userId;
        }

        var newMessage = new Message
        {
            SenderId = senderId,
            Text = message,
            Time = DateTime.UtcNow.ToString("o"), // ISO 8601 UTC
            Status = "sent"
        };

        await _chatService.AddMessageAsync(newMessage);

        // Broadcast to all clients
        await Clients.All.SendAsync("ReceiveMessage", newMessage);
    }

    // Optional: Notify when typing
    public async Task SendTyping(string user)
    {
        await Clients.Others.SendAsync("UserTyping", user);
    }
}
