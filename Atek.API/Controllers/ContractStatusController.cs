using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractStatusController : ControllerBase
{
    private readonly IContractStatusRepository _repository;

    public ContractStatusController(IContractStatusRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<ContractStatus>>> GetAll()
    {
        var contractStatuses = await _repository.GetAllAsync();
        return Ok(contractStatuses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractStatus>> GetById(int id)
    {
        var contractStatus = await _repository.GetByIdAsync(id);
        if (contractStatus == null)
            return NotFound();
        return Ok(contractStatus);
    }

    [HttpPost]
    public async Task<ActionResult<ContractStatus>> Create(ContractStatus contractStatus)
    {
        var created = await _repository.CreateAsync(contractStatus);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ContractStatus>> Update(int id, ContractStatus contractStatus)
    {
        if (id != contractStatus.Id)
            return BadRequest();

        var updated = await _repository.UpdateAsync(contractStatus);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var isInUse = await _repository.IsInUseAsync(id);
        if (isInUse)
        {
            return BadRequest(new { message = "Cannot delete contract status because it is assigned to one or more contracts." });
        }

        await _repository.DeleteAsync(id);
        return NoContent();
    }
}