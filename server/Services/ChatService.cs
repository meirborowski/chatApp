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
    }

    public async Task<List<User>> GetUsersAsync() =>
        await _usersCollection.Find(_ => true).ToListAsync();

    public async Task<List<Message>> GetMessagesAsync(int userId) =>
        await _messagesCollection.Find(_ => true).ToListAsync();

    public async Task AddMessageAsync(Message message)
    {
        // Auto-increment ID strategy (Not ideal for MongoDB but keeping consistent with frontend logic for now)
        // In production, use ObjectId or a counter collection
        var lastMessage = await _messagesCollection.Find(_ => true)
            .SortByDescending(m => m.Id)
            .FirstOrDefaultAsync();
            
        message.Id = (lastMessage?.Id ?? 0) + 1;
        
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

        var lastUser = await _usersCollection.Find(_ => true).SortByDescending(u => u.Id).FirstOrDefaultAsync();
        int newId = (lastUser?.Id ?? 0) + 1;

        var user = new User
        {
            Id = newId,
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
