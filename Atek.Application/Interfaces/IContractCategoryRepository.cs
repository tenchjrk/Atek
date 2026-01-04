using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IContractCategoryRepository
{
    Task<IEnumerable<ContractCategory>> GetAllAsync();
    Task<ContractCategory?> GetByIdAsync(int id);
    Task<IEnumerable<ContractCategory>> GetByContractIdAsync(int contractId);
    Task<ContractCategory> CreateAsync(ContractCategory contractCategory);
    Task<ContractCategory> UpdateAsync(int id, ContractCategory contractCategory);
    Task DeleteAsync(int id);
}