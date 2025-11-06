namespace OrderService.Domain;

public class Order
{
    public int Id { get; set; }
    public string Code { get; set; } = default!;
    public decimal Total { get; set; }
}
