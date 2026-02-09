using Server.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Server.Services;

public interface IChatService
{
    Task<List<User>> GetUsersAsync();
    Task<List<Message>> GetMessagesAsync(int userId);
    Task AddMessageAsync(Message message);
    Task UpdateUserStatusAsync(int userId, string status);
    Task<User?> AuthenticateAsync(string username, string password);
    Task<User?> RegisterAsync(string username, string password, string displayName);
}

public class ChatService : IChatService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<Message> _messagesCollection;
    private readonly IMongoCollection<Sequence> _sequencesCollection;

    public ChatService(IOptions<ChatDatabaseSettings> chatDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            chatDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            chatDatabaseSettings.Value.DatabaseName);

        _usersCollection = mongoDatabase.GetCollection<User>(
            chatDatabaseSettings.Value.UsersCollectionName);

        _messagesCollection = mongoDatabase.GetCollection<Message>(
            chatDatabaseSettings.Value.MessagesCollectionName);
            
        _sequencesCollection = mongoDatabase.GetCollection<Sequence>("Sequences");
    }
    
    private async Task<int> GetNextSequenceValueAsync(string sequenceName)
    {
        var filter = Builders<Sequence>.Filter.Eq(s => s.Id, sequenceName);
        var update = Builders<Sequence>.Update.Inc(s => s.Value, 1);
        var options = new FindOneAndUpdateOptions<Sequence>
        {
            ReturnDocument = ReturnDocument.After,
            IsUpsert = true
        };

        var result = await _sequencesCollection.FindOneAndUpdateAsync(filter, update, options);
        return result.Value;
    }

    public async Task<List<User>> GetUsersAsync() =>
        await _usersCollection.Find(_ => true).ToListAsync();

    public async Task<List<Message>> GetMessagesAsync(int userId) =>
        await _messagesCollection.Find(_ => true).ToListAsync();

    public async Task AddMessageAsync(Message message)
    {
        message.Id = await GetNextSequenceValueAsync("messages");
        
        await _messagesCollection.InsertOneAsync(message);

        // Update user's last message and time
        var update = Builders<User>.Update
            .Set(u => u.LastMessage, message.Text)
            .Set(u => u.Time, message.Time);
            
        await _usersCollection.UpdateOneAsync(u => u.Id == message.SenderId, update);
    }

    public async Task UpdateUserStatusAsync(int userId, string status)
    {
        var update = Builders<User>.Update.Set(u => u.Status, status);
        if (status == "offline")
        {
            update = update.Set(u => u.LastSeen, DateTime.UtcNow.ToString("O"));
        }
        await _usersCollection.UpdateOneAsync(u => u.Id == userId, update);
    }

    public async Task<User?> AuthenticateAsync(string username, string password)
    {
        return await _usersCollection.Find(u => u.Username == username && u.Password == password).FirstOrDefaultAsync();
    }

    public async Task<User?> RegisterAsync(string username, string password, string displayName)
    {
        // Check if exists
        var existing = await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
        if (existing != null) return null;

        var user = new User
        {
            Id = await GetNextSequenceValueAsync("users"),
            Username = username,
            Password = password,
            Name = displayName,
            Status = "online",
            Avatar = $"/placeholder-user.jpg" // Could randomize
        };

        await _usersCollection.InsertOneAsync(user);
        return user;
    }
}
