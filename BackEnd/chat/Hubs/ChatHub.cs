using System.Security.Claims;
using ChatService.Data;
using chat.Models;
using Dotnet.Grpc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

public class ChatHub : Hub
{
    private readonly ChatDbContext _db;
    private readonly AuthGrpc.AuthGrpcClient _authClient;

    public ChatHub(ChatDbContext db, AuthGrpc.AuthGrpcClient authClient)
    {
        _db = db;
        _authClient = authClient;
    }

    public async Task SendMessage(int receiverId, string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new HubException("Message content cannot be empty.");
        }

        var senderId = GetUserId();
        var timestamp = DateTimeOffset.UtcNow;

        var message = new Message
        {
            sender_id = senderId,
            receiver_id = receiverId,
            content = content,
            sent_at = timestamp,
            is_read = false
        };

        _db.Messages.Add(message);
        await _db.SaveChangesAsync();
        await _db.Entry(message).ReloadAsync();

        var sender = await _authClient.GetUserByIdAsync(new UserRequest { Id = senderId });
        var receiver = await _authClient.GetUserByIdAsync(new UserRequest { Id = receiverId });
        var senderName = ComposeDisplayName(sender, senderId);
        var receiverName = ComposeDisplayName(receiver, receiverId);

        var payload = new
        {
            messageId = message.id,
            senderId,
            receiverId,
            content,
            timestamp = message.sent_at.ToString("O"),
            isRead = message.is_read,
            senderName,
            receiverName
        };

        await Clients.Users(senderId.ToString(), receiverId.ToString()).SendAsync("ReceiveMessage", payload);
    }

    private int GetUserId()
    {
        var idValue = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(idValue))
        {
            throw new HubException("User context is missing.");
        }

        if (!int.TryParse(idValue, out var userId))
        {
            throw new HubException("Invalid user identifier.");
        }

        return userId;
    }

    private static string ComposeDisplayName(UserReply user, int fallbackId)
    {
        var first = user.Firstname?.Trim();
        var last = user.Lastname?.Trim();
        var parts = new[] { first, last }
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToArray();

        if (parts.Length > 0)
        {
            return string.Join(" ", parts);
        }

        if (!string.IsNullOrWhiteSpace(user.Email))
        {
            return user.Email!;
        }

        return $"User #{fallbackId}";
    }
}
