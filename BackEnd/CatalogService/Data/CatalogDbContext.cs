using Microsoft.EntityFrameworkCore;
using CatalogService.Domain;

namespace CatalogService.Data;

public class CatalogDbContext : DbContext
{
    public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }
    public DbSet<Category> Categories => Set<Category>();
}
