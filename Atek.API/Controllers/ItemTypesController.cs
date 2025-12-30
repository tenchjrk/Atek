using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemTypesController : ControllerBase
{
    private readonly IItemTypeRepository _repository;

    public ItemTypesController(IItemTypeRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<ItemType>>> GetAll()
    {
        var itemTypes = await _repository.GetAllAsync();
        return Ok(itemTypes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ItemType>> GetById(int id)
    {
        var itemType = await _repository.GetByIdAsync(id);
        if (itemType == null) return NotFound();
        return Ok(itemType);
    }

    [HttpPost]
    public async Task<ActionResult<ItemType>> Create(ItemType itemType)
    {
        var created = await _repository.CreateAsync(itemType);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ItemType>> Update(int id, ItemType itemType)
    {
        itemType.Id = id;
        var updated = await _repository.UpdateAsync(itemType);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}