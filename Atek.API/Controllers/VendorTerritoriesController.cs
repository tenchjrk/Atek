using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorTerritoriesController : ControllerBase
{
    private readonly IVendorTerritoryRepository _repository;

    public VendorTerritoriesController(IVendorTerritoryRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<VendorTerritory>>> GetAll()
    {
        var territories = await _repository.GetAllAsync();
        return Ok(territories);
    }

    [HttpGet("region/{regionId}")]
    public async Task<ActionResult<List<VendorTerritory>>> GetByRegionId(int regionId)
    {
        var territories = await _repository.GetByRegionIdAsync(regionId);
        return Ok(territories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VendorTerritory>> GetById(int id)
    {
        var territory = await _repository.GetByIdAsync(id);
        if (territory == null) return NotFound();
        return Ok(territory);
    }

    [HttpPost]
    public async Task<ActionResult<VendorTerritory>> Create(VendorTerritory vendorTerritory)
    {
        var created = await _repository.CreateAsync(vendorTerritory);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VendorTerritory>> Update(int id, VendorTerritory vendorTerritory)
    {
        vendorTerritory.Id = id;
        var updated = await _repository.UpdateAsync(vendorTerritory);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}