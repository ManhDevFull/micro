using MassTransit;
using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.GrpcClients;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<OrderDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddSingleton<CatalogGrpcClient>();

builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"]);
    });
});

var app = builder.Build();
app.MapControllers();
app.Run();
