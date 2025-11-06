using Contracts.Grpc;
using Grpc.Core;

namespace CatalogService.Grpc;

public class CategoryGrpcService : CategoryGrpc.CategoryGrpcBase
{
    public override Task<PingReply> Ping(Empty request, ServerCallContext context)
        => Task.FromResult(new PingReply { Message = "Hello from CatalogService gRPC!" });
}
