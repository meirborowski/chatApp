using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models;

public class Sequence
{
    [BsonId]
    public string Id { get; set; } = string.Empty;
    
    public int Value { get; set; }
}
