using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemRepository _repository;

    public ItemsController(IItemRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Item>>> GetAll()
    {
        var items = await _repository.GetAllAsync();
        return Ok(items);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<List<Item>>> GetByCategoryId(int categoryId)
    {
        var items = await _repository.GetByCategoryIdAsync(categoryId);
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Item>> GetById(int id)
    {
        var item = await _repository.GetByIdAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Item>> Create(Item item)
    {
        var created = await _repository.CreateAsync(item);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Item>> Update(int id, Item item)
    {
        item.Id = id;
        var updated = await _repository.UpdateAsync(item);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}