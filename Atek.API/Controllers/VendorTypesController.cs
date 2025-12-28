using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorTypesController : ControllerBase
{
    private readonly IVendorTypeRepository _repository;

    public VendorTypesController(IVendorTypeRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<VendorType>>> GetAll()
    {
        var vendorTypes = await _repository.GetAllAsync();
        return Ok(vendorTypes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VendorType>> GetById(int id)
    {
        var vendorType = await _repository.GetByIdAsync(id);
        if (vendorType == null) return NotFound();
        return Ok(vendorType);
    }

    [HttpPost]
    public async Task<ActionResult<VendorType>> Create(VendorType vendorType)
    {
        var created = await _repository.CreateAsync(vendorType);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VendorType>> Update(int id, VendorType vendorType)
    {
        vendorType.Id = id;
        var updated = await _repository.UpdateAsync(vendorType);
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