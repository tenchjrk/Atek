using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorRegionsController : ControllerBase
{
    private readonly IVendorRegionRepository _repository;

    public VendorRegionsController(IVendorRegionRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<VendorRegion>>> GetAll()
    {
        var regions = await _repository.GetAllAsync();
        return Ok(regions);
    }

    [HttpGet("segment/{segmentId}")]
    public async Task<ActionResult<List<VendorRegion>>> GetBySegmentId(int segmentId)
    {
        var regions = await _repository.GetBySegmentIdAsync(segmentId);
        return Ok(regions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VendorRegion>> GetById(int id)
    {
        var region = await _repository.GetByIdAsync(id);
        if (region == null) return NotFound();
        return Ok(region);
    }

    [HttpPost]
    public async Task<ActionResult<VendorRegion>> Create(VendorRegion vendorRegion)
    {
        var created = await _repository.CreateAsync(vendorRegion);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VendorRegion>> Update(int id, VendorRegion vendorRegion)
    {
        vendorRegion.Id = id;
        var updated = await _repository.UpdateAsync(vendorRegion);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}