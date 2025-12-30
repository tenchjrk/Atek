using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnitOfMeasuresController : ControllerBase
{
    private readonly IUnitOfMeasureRepository _repository;

    public UnitOfMeasuresController(IUnitOfMeasureRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<UnitOfMeasure>>> GetAll()
    {
        var unitOfMeasures = await _repository.GetAllAsync();
        return Ok(unitOfMeasures);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UnitOfMeasure>> GetById(int id)
    {
        var unitOfMeasure = await _repository.GetByIdAsync(id);
        if (unitOfMeasure == null) return NotFound();
        return Ok(unitOfMeasure);
    }

    [HttpPost]
    public async Task<ActionResult<UnitOfMeasure>> Create(UnitOfMeasure unitOfMeasure)
    {
        var created = await _repository.CreateAsync(unitOfMeasure);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UnitOfMeasure>> Update(int id, UnitOfMeasure unitOfMeasure)
    {
        unitOfMeasure.Id = id;
        var updated = await _repository.UpdateAsync(unitOfMeasure);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}