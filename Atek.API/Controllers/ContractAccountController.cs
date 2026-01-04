using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractAccountController : ControllerBase
{
    private readonly IContractAccountRepository _repository;

    public ContractAccountController(IContractAccountRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContractAccount>>> GetAll()
    {
        var contractAccounts = await _repository.GetAllAsync();
        return Ok(contractAccounts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractAccount>> GetById(int id)
    {
        var contractAccount = await _repository.GetByIdAsync(id);
        if (contractAccount == null)
        {
            return NotFound();
        }
        return Ok(contractAccount);
    }

    [HttpGet("contract/{contractId}")]
    public async Task<ActionResult<IEnumerable<ContractAccount>>> GetByContractId(int contractId)
    {
        var contractAccounts = await _repository.GetByContractIdAsync(contractId);
        return Ok(contractAccounts);
    }

    [HttpGet("account/{accountId}")]
    public async Task<ActionResult<IEnumerable<ContractAccount>>> GetByAccountId(int accountId)
    {
        var contractAccounts = await _repository.GetByAccountIdAsync(accountId);
        return Ok(contractAccounts);
    }

    [HttpPost]
    public async Task<ActionResult<ContractAccount>> Create(ContractAccount contractAccount)
    {
        var created = await _repository.CreateAsync(contractAccount);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ContractAccount>> Update(int id, ContractAccount contractAccount)
    {
        if (id != contractAccount.Id)
        {
            return BadRequest();
        }

        var updated = await _repository.UpdateAsync(id, contractAccount);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}