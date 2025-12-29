using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorSegmentsController : ControllerBase
{
    private readonly IVendorSegmentRepository _repository;

    public VendorSegmentsController(IVendorSegmentRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<VendorSegment>>> GetAll()
    {
        var segments = await _repository.GetAllAsync();
        return Ok(segments);
    }

    [HttpGet("vendor/{vendorId}")]
    public async Task<ActionResult<List<VendorSegment>>> GetByVendorId(int vendorId)
    {
        var segments = await _repository.GetByVendorIdAsync(vendorId);
        return Ok(segments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VendorSegment>> GetById(int id)
    {
        var segment = await _repository.GetByIdAsync(id);
        if (segment == null) return NotFound();
        return Ok(segment);
    }

    [HttpPost]
    public async Task<ActionResult<VendorSegment>> Create(VendorSegment vendorSegment)
    {
        var created = await _repository.CreateAsync(vendorSegment);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VendorSegment>> Update(int id, VendorSegment vendorSegment)
    {
        vendorSegment.Id = id;
        var updated = await _repository.UpdateAsync(vendorSegment);
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