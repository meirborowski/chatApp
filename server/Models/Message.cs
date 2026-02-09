using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.Int32)]
    public int Id { get; set; }
    public int SenderId { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Status { get; set; } = "sent"; // sent, delivered, read
}
