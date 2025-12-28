using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorsController : ControllerBase
{
    private readonly IVendorRepository _repository;

    public VendorsController(IVendorRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Vendor>>> GetAll()
    {
        var vendors = await _repository.GetAllAsync();
        return Ok(vendors);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Vendor>> GetById(int id)
    {
        var vendor = await _repository.GetByIdAsync(id);
        if (vendor == null) return NotFound();
        return Ok(vendor);
    }

    [HttpPost]
    public async Task<ActionResult<Vendor>> Create(Vendor vendor)
    {
        var created = await _repository.CreateAsync(vendor);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Vendor>> Update(int id, Vendor vendor)
    {
        vendor.Id = id;
        var updated = await _repository.UpdateAsync(vendor);
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