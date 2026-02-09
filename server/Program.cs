using Server.Services;
using Server.Hubs;
using Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<ChatDatabaseSettings>(
    builder.Configuration.GetSection("ChatDatabase"));

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IChatService, ChatService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPermission", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Next.js client
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Important for SignalR
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection(); // Disabled for easy local dev without certs

app.UseCors("ClientPermission");

app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.Run();
