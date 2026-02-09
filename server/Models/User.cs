using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.Int32)]
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; // In production, use hash!
    public string Name { get; set; } = string.Empty;
    public string Avatar { get; set; } = "/placeholder-user.jpg";
    public string Status { get; set; } = "offline"; // online, offline, away
    public string LastMessage { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string LastSeen { get; set; } = string.Empty;
    public int Unread { get; set; }
}
