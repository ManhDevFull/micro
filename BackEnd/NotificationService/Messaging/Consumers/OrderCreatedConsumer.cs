using MassTransit;

namespace NotificationService.Messaging.Consumers;

public record OrderCreated(string Code, decimal Total);

public class OrderCreatedConsumer : IConsumer<OrderCreated>
{
    public Task Consume(ConsumeContext<OrderCreated> context)
    {
        Console.WriteLine($"[Notification] Order: {context.Message.Code} - Total: {context.Message.Total}");
        return Task.CompletedTask;
    }
}
