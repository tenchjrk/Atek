using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractController : ControllerBase
{
    private readonly IContractRepository _repository;

    public ContractController(IContractRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Contract>>> GetAll()
    {
        var contracts = await _repository.GetAllAsync();
        return Ok(contracts);
    }

    [HttpGet("account/{accountId}")]
    public async Task<ActionResult<List<Contract>>> GetByAccountId(int accountId)
    {
        var contracts = await _repository.GetByAccountIdAsync(accountId);
        return Ok(contracts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Contract>> GetById(int id)
    {
        var contract = await _repository.GetByIdAsync(id);
        if (contract == null)
            return NotFound();
        return Ok(contract);
    }

    [HttpPost]
    public async Task<ActionResult<Contract>> Create(Contract contract)
    {
        var created = await _repository.CreateAsync(contract);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Contract>> Update(int id, Contract contract)
    {
        if (id != contract.Id)
            return BadRequest();

        var updated = await _repository.UpdateAsync(contract);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}