using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractSegmentController : ControllerBase
{
    private readonly IContractSegmentRepository _repository;

    public ContractSegmentController(IContractSegmentRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContractSegment>>> GetAll()
    {
        var contractSegments = await _repository.GetAllAsync();
        return Ok(contractSegments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractSegment>> GetById(int id)
    {
        var contractSegment = await _repository.GetByIdAsync(id);
        if (contractSegment == null)
        {
            return NotFound();
        }
        return Ok(contractSegment);
    }

    [HttpGet("contract/{contractId}")]
    public async Task<ActionResult<IEnumerable<ContractSegment>>> GetByContractId(int contractId)
    {
        var contractSegments = await _repository.GetByContractIdAsync(contractId);
        return Ok(contractSegments);
    }

    [HttpPost]
    public async Task<ActionResult<ContractSegment>> Create(ContractSegment contractSegment)
    {
        var created = await _repository.CreateAsync(contractSegment);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ContractSegment>> Update(int id, ContractSegment contractSegment)
    {
        if (id != contractSegment.Id)
        {
            return BadRequest();
        }

        var updated = await _repository.UpdateAsync(id, contractSegment);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}