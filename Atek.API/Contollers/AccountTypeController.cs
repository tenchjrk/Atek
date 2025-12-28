using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountTypesController : ControllerBase
{
    private readonly IAccountTypeRepository _repository;

    public AccountTypesController(IAccountTypeRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<AccountType>>> GetAll()
    {
        var accountTypes = await _repository.GetAllAsync();
        return Ok(accountTypes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AccountType>> GetById(int id)
    {
        var accountType = await _repository.GetByIdAsync(id);
        if (accountType == null) return NotFound();
        return Ok(accountType);
    }

    [HttpPost]
    public async Task<ActionResult<AccountType>> Create(AccountType accountType)
    {
        var created = await _repository.CreateAsync(accountType);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AccountType>> Update(int id, AccountType accountType)
    {
        accountType.Id = id;
        var updated = await _repository.UpdateAsync(accountType);
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