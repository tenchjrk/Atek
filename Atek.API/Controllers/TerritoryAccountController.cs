using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TerritoryAccountController : ControllerBase
{
    private readonly ITerritoryAccountRepository _repository;

    public TerritoryAccountController(ITerritoryAccountRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TerritoryAccount>>> GetAll()
    {
        var territoryAccounts = await _repository.GetAllAsync();
        return Ok(territoryAccounts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TerritoryAccount>> GetById(int id)
    {
        var territoryAccount = await _repository.GetByIdAsync(id);
        if (territoryAccount == null)
        {
            return NotFound();
        }
        return Ok(territoryAccount);
    }

    [HttpGet("territory/{territoryId}")]
    public async Task<ActionResult<IEnumerable<TerritoryAccount>>> GetByTerritoryId(int territoryId)
    {
        var territoryAccounts = await _repository.GetByTerritoryIdAsync(territoryId);
        return Ok(territoryAccounts);
    }

    [HttpGet("account/{accountId}")]
    public async Task<ActionResult<IEnumerable<TerritoryAccount>>> GetByAccountId(int accountId)
    {
        var territoryAccounts = await _repository.GetByAccountIdAsync(accountId);
        return Ok(territoryAccounts);
    }

    [HttpPost]
    public async Task<ActionResult<TerritoryAccount>> Create(TerritoryAccount territoryAccount)
    {
        var created = await _repository.CreateAsync(territoryAccount);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TerritoryAccount>> Update(int id, TerritoryAccount territoryAccount)
    {
        if (id != territoryAccount.Id)
        {
            return BadRequest();
        }

        var updated = await _repository.UpdateAsync(id, territoryAccount);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}