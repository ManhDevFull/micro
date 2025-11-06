using Microsoft.AspNetCore.Mvc;
using OrderService.Data;
using OrderService.Domain;
using OrderService.GrpcClients;

namespace OrderService.Controllers;

[Route("[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly OrderDbContext _db;
    private readonly CatalogGrpcClient _catalog;

    public OrderController(OrderDbContext db, CatalogGrpcClient catalog)
    {
        _db = db;
        _catalog = catalog;
    }

    [HttpGet("ping")]
    public async Task<IActionResult> PingCatalog()
    {
        var msg = await _catalog.PingAsync();
        return Ok(new { fromCatalog = msg });
    }

    [HttpPost]
    public IActionResult Create(Order order)
    {
        _db.Orders.Add(order);
        _db.SaveChanges();
        return Ok(order);
    }
}
