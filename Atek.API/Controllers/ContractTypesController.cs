using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractTypeController : ControllerBase
{
    private readonly IContractTypeRepository _repository;

    public ContractTypeController(IContractTypeRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<ContractType>>> GetAll()
    {
        var contractTypes = await _repository.GetAllAsync();
        return Ok(contractTypes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractType>> GetById(int id)
    {
        var contractType = await _repository.GetByIdAsync(id);
        if (contractType == null)
            return NotFound();

        return Ok(contractType);
    }

    [HttpPost]
    public async Task<ActionResult<ContractType>> Create(ContractType contractType)
    {
        var created = await _repository.CreateAsync(contractType);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ContractType>> Update(int id, ContractType contractType)
    {
        if (id != contractType.Id)
            return BadRequest();

        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return NotFound();

        var updated = await _repository.UpdateAsync(contractType);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var isInUse = await _repository.IsInUseAsync(id);
        if (isInUse)
            return BadRequest(new { message = "Cannot delete contract type that is in use by contracts." });

        await _repository.DeleteAsync(id);
        return NoContent();
    }
}