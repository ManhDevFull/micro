using System.Security.Claims;
using ChatService.Data;
using Chat.Grpc;
using Dotnet.Grpc;
using Grpc.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using AuthUserRequest = Dotnet.Grpc.UserRequest;

namespace ChatService.Endpoints;

public static class ChatEndpoints
{
    public static RouteGroupBuilder MapChatEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/chat-api").RequireAuthorization();

        group.MapGet("/threads", async Task<IResult> (
            ClaimsPrincipal user,
            ChatDbContext db,
            AuthGrpc.AuthGrpcClient authClient,
            CancellationToken cancellationToken) =>
        {
            var userId = GetUserId(user);

            var messages = await db.Messages
                .AsNoTracking()
                .Where(m => m.sender_id == userId || m.receiver_id == userId)
                .ToListAsync(cancellationToken);

            if (messages.Count == 0)
            {
                return Results.Ok(Array.Empty<ThreadSummaryDto>());
            }

            var grouped = messages
                .GroupBy(m => m.sender_id == userId ? m.receiver_id : m.sender_id)
                .ToList();

        var contactIds = grouped.Select(g => g.Key).Distinct().ToList();
        var contacts = await FetchContactsAsync(contactIds, authClient, cancellationToken);

            var summaries = grouped
                .Select(group =>
                {
                    var ordered = group
                        .OrderBy(m => m.sent_at)
                        .ToList();
                    var last = ordered.Last();
                    var contactId = group.Key;
                    var lastTimestamp = last.sent_at;

                var contactInfo = contacts.TryGetValue(contactId, out var contact)
                    ? contact
                    : ContactInfo.CreateFallback(contactId);

                    var unreadCount = ordered.Count(m =>
                        m.sender_id == contactId &&
                        m.receiver_id == userId &&
                        !m.is_read);

                    var summary = new ThreadSummaryDto(
                        contactId,
                        contactInfo.DisplayName,
                        contactInfo.Initials,
                        last.sender_id,
                        last.content ?? string.Empty,
                        lastTimestamp.ToString("O"),
                        unreadCount,
                        contactInfo.Email,
                        lastTimestamp);

                    return summary;
                })
                .OrderByDescending(summary => summary.SortingTimestamp)
                .ToList();

            var response = summaries
                .Select(summary => new
                {
                    summary.ContactId,
                    summary.Name,
                    summary.AvatarInitials,
                    summary.LastSenderId,
                    summary.LastMessage,
                    summary.LastTimestamp,
                    summary.UnreadCount,
                    summary.ContactEmail
                });

            return Results.Ok(response);
        });

        group.MapGet("/threads/{contactId:int}/messages", async Task<IResult> (
            ClaimsPrincipal user,
            int contactId,
            ChatDbContext db,
            CancellationToken cancellationToken) =>
        {
            var userId = GetUserId(user);

            var conversation = await db.Messages
                .AsNoTracking()
                .Where(m =>
                    (m.sender_id == userId && m.receiver_id == contactId) ||
                    (m.sender_id == contactId && m.receiver_id == userId))
                .OrderBy(m => m.sent_at)
                .ToListAsync(cancellationToken);

            var messages = conversation.Select(m => new MessageDto(
                m.id,
                m.sender_id,
                m.receiver_id,
                m.content ?? string.Empty,
                m.sent_at.ToString("O"),
                m.is_read));

            return Results.Ok(messages);
        });

        group.MapPost("/threads/{contactId:int}/read", async Task<IResult> (
            ClaimsPrincipal user,
            int contactId,
            ChatDbContext db,
            CancellationToken cancellationToken) =>
        {
            var userId = GetUserId(user);

            var affected = await db.Messages
                .Where(m =>
                    m.sender_id == contactId &&
                    m.receiver_id == userId &&
                    !m.is_read)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(m => m.is_read, _ => true),
                    cancellationToken);

            return Results.Ok(new { updated = affected });
        });

        return group;
    }

    private static int GetUserId(ClaimsPrincipal user)
    {
        var idValue = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(idValue) || !int.TryParse(idValue, out var id))
        {
            throw new RpcException(new Status(StatusCode.Unauthenticated, "User id is missing."));
        }

        return id;
    }

    private static async Task<Dictionary<int, ContactInfo>> FetchContactsAsync(
        IEnumerable<int> contactIds,
        AuthGrpc.AuthGrpcClient authClient,
        CancellationToken cancellationToken)
    {
        var tasks = contactIds.Select(async id =>
        {
            try
            {
                var user = await authClient.GetUserByIdAsync(
                    new AuthUserRequest { Id = id },
                    cancellationToken: cancellationToken);
                var info = ContactInfo.FromUser(id, user);
                return (Id: id, Info: info);
            }
            catch
            {
                return (Id: id, Info: ContactInfo.CreateFallback(id));
            }
        });

        var results = await Task.WhenAll(tasks);
        return results.ToDictionary(k => k.Id, v => v.Info);
    }

    private static string BuildInitials(string name)
    {
        var parts = name
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        if (parts.Length == 0)
        {
            return "?";
        }

        if (parts.Length == 1)
        {
            var segment = parts[0];
            return segment.Length >= 2
                ? segment[..2].ToUpperInvariant()
                : segment[0].ToString().ToUpperInvariant();
        }

        return $"{parts[0][0]}{parts[^1][0]}".ToUpperInvariant();
    }

    private record ThreadSummaryDto(
        int ContactId,
        string Name,
        string AvatarInitials,
        int LastSenderId,
        string LastMessage,
        string LastTimestamp,
        int UnreadCount,
        string ContactEmail,
        DateTimeOffset SortingTimestamp);

    private record MessageDto(
        int Id,
        int SenderId,
        int ReceiverId,
        string Content,
        string Timestamp,
        bool IsRead);

    private record ContactInfo(string DisplayName, string Initials, string Email)
    {
        public static ContactInfo FromUser(int id, UserReply user)
        {
            var first = user.Firstname?.Trim();
            var last = user.Lastname?.Trim();
            var parts = new[] { first, last }.Where(s => !string.IsNullOrWhiteSpace(s)).ToArray();
            var rawName = parts.Length > 0 ? string.Join(" ", parts) : string.Empty;
            var email = user.Email ?? string.Empty;
            var displayName = string.IsNullOrWhiteSpace(rawName)
                ? (!string.IsNullOrWhiteSpace(email) ? email : $"User #{id}")
                : rawName;
            var initials = BuildInitials(displayName);
            return new ContactInfo(displayName, initials, email);
        }

        public static ContactInfo CreateFallback(int id)
        {
            var display = $"User #{id}";
            return new ContactInfo(display, BuildInitials(display), string.Empty);
        }

        private static string BuildInitials(string value)
        {
            var parts = value
                .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            if (parts.Length == 0)
            {
                if (value.Contains('@'))
                {
                    var cleaned = value.Replace("@", string.Empty);
                    return cleaned.Length >= 2 ? cleaned[..2].ToUpperInvariant() : cleaned[..1].ToUpperInvariant();
                }
                return "?";
            }

            if (parts.Length == 1)
            {
                var segment = parts[0];
                if (segment.Contains('@'))
                {
                    var cleaned = segment.Replace("@", string.Empty);
                    return cleaned.Length >= 2 ? cleaned[..2].ToUpperInvariant() : cleaned[..1].ToUpperInvariant();
                }
                return segment.Length >= 2
                    ? segment[..2].ToUpperInvariant()
                    : segment[..1].ToUpperInvariant();
            }

            return $"{parts[0][0]}{parts[^1][0]}".ToUpperInvariant();
        }
    }
}
