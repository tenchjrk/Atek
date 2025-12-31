using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractItemController : ControllerBase
{
    private readonly IContractItemRepository _repository;

    public ContractItemController(IContractItemRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<ContractItem>>> GetAll()
    {
        var contractItems = await _repository.GetAllAsync();
        return Ok(contractItems);
    }

    [HttpGet("contract/{contractId}")]
    public async Task<ActionResult<List<ContractItem>>> GetByContractId(int contractId)
    {
        var contractItems = await _repository.GetByContractIdAsync(contractId);
        return Ok(contractItems);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractItem>> GetById(int id)
    {
        var contractItem = await _repository.GetByIdAsync(id);
        if (contractItem == null)
            return NotFound();
        return Ok(contractItem);
    }

    [HttpPost]
    public async Task<ActionResult<ContractItem>> Create(ContractItem contractItem)
    {
        var created = await _repository.CreateAsync(contractItem);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ContractItem>> Update(int id, ContractItem contractItem)
    {
        if (id != contractItem.Id)
            return BadRequest();

        var updated = await _repository.UpdateAsync(contractItem);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}