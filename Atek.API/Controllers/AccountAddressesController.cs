using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountAddressesController : ControllerBase
{
    private readonly IAccountAddressRepository _repository;

    public AccountAddressesController(IAccountAddressRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<AccountAddress>>> GetAll()
    {
        var accountAddresses = await _repository.GetAllAsync();
        return Ok(accountAddresses);
    }

    [HttpGet("account/{accountId}")]
    public async Task<ActionResult<List<AccountAddress>>> GetByAccountId(int accountId)
    {
        var accountAddresses = await _repository.GetByAccountIdAsync(accountId);
        return Ok(accountAddresses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AccountAddress>> GetById(int id)
    {
        var accountAddress = await _repository.GetByIdAsync(id);
        if (accountAddress == null) return NotFound();
        return Ok(accountAddress);
    }

    [HttpPost]
    public async Task<ActionResult<AccountAddress>> Create(AccountAddress accountAddress)
    {
        var created = await _repository.CreateAsync(accountAddress);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AccountAddress>> Update(int id, AccountAddress accountAddress)
    {
        accountAddress.Id = id;
        var updated = await _repository.UpdateAsync(accountAddress);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}