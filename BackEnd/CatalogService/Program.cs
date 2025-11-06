using CatalogService.Data;
using CatalogService.Grpc;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Server.Kestrel.Core;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5085, o => o.Protocols = HttpProtocols.Http2); // gRPC
    options.ListenAnyIP(5086, o => o.Protocols = HttpProtocols.Http1); // REST API
});

builder.Services.AddControllers();

builder.Services.AddGrpc(options =>
{
    options.EnableDetailedErrors = true;
});
// builder.Services.AddDbContext<CatalogDbContext>(opt =>
//     opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// builder.Services.AddMassTransit(x =>
// {
//     x.UsingRabbitMq((ctx, cfg) =>
//     {
//         cfg.Host(builder.Configuration["RabbitMq:Host"]);
//     });
// });

var app = builder.Build();
app.MapGrpcService<CategoryGrpcService>();
app.MapControllers();
app.Run();
