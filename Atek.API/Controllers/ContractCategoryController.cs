using Microsoft.AspNetCore.Mvc;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;

namespace Atek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractCategoryController : ControllerBase
{
    private readonly IContractCategoryRepository _repository;

    public ContractCategoryController(IContractCategoryRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContractCategory>>> GetAll()
    {
        var contractCategories = await _repository.GetAllAsync();
        return Ok(contractCategories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractCategory>> GetById(int id)
    {
        var contractCategory = await _repository.GetByIdAsync(id);
        if (contractCategory == null)
        {
            return NotFound();
        }
        return Ok(contractCategory);
    }

    [HttpGet("contract/{contractId}")]
    public async Task<ActionResult<IEnumerable<ContractCategory>>> GetByContractId(int contractId)
    {
        var contractCategories = await _repository.GetByContractIdAsync(contractId);
        return Ok(contractCategories);
    }

    [HttpPost]
    public async Task<ActionResult<ContractCategory>> Create(ContractCategory contractCategory)
    {
        var created = await _repository.CreateAsync(contractCategory);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ContractCategory>> Update(int id, ContractCategory contractCategory)
    {
        if (id != contractCategory.Id)
        {
            return BadRequest();
        }

        var updated = await _repository.UpdateAsync(id, contractCategory);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}