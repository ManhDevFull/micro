using MassTransit;
using NotificationService.Messaging.Consumers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<OrderCreatedConsumer>();

    x.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"]);
        cfg.ConfigureEndpoints(ctx);
    });
});

var app = builder.Build();
app.MapGet("/", () => "Notification Service Running...");
app.Run();
