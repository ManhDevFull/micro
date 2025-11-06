using Contracts.Grpc;
using Grpc.Net.Client;
using System.Net.Http;

namespace OrderService.GrpcClients;

public class CatalogGrpcClient
{
    private readonly CategoryGrpc.CategoryGrpcClient _client;

    public CatalogGrpcClient(IConfiguration cfg)
    {
        var url = cfg["Grpc:CatalogUrl"]!;

        // Cho phép kết nối HTTPS tự ký hoặc HTTP thường (dev)
        var handler = new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        };

        var channel = GrpcChannel.ForAddress(url, new GrpcChannelOptions
        {
            HttpHandler = handler
        });

        _client = new CategoryGrpc.CategoryGrpcClient(channel);
    }

    public async Task<string> PingAsync()
    {
        var reply = await _client.PingAsync(new Empty());
        return reply.Message;
    }
}
