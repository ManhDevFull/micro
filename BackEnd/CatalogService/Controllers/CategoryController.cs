using Microsoft.AspNetCore.Mvc;
using CatalogService.Data;
using CatalogService.Domain;

namespace CatalogService.Controllers;

[Route("[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly CatalogDbContext _db;

    public CategoryController(CatalogDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_db.Categories.ToList());

    [HttpPost]
    public IActionResult Create(Category category)
    {
        _db.Categories.Add(category);
        _db.SaveChanges();
        return Ok(category);
    }
}
