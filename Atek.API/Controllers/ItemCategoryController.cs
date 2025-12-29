using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemCategoriesController : ControllerBase
{
    private readonly IItemCategoryRepository _repository;

    public ItemCategoriesController(IItemCategoryRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<ItemCategory>>> GetAll()
    {
        var categories = await _repository.GetAllAsync();
        return Ok(categories);
    }

    [HttpGet("segment/{segmentId}")]
    public async Task<ActionResult<List<ItemCategory>>> GetBySegmentId(int segmentId)
    {
        var categories = await _repository.GetBySegmentIdAsync(segmentId);
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ItemCategory>> GetById(int id)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<ItemCategory>> Create(ItemCategory itemCategory)
    {
        var created = await _repository.CreateAsync(itemCategory);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ItemCategory>> Update(int id, ItemCategory itemCategory)
    {
        itemCategory.Id = id;
        var updated = await _repository.UpdateAsync(itemCategory);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}