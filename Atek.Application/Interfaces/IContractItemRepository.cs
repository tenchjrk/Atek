using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IContractItemRepository
{
    Task<List<ContractItem>> GetAllAsync();
    Task<List<ContractItem>> GetByContractIdAsync(int contractId);
    Task<ContractItem?> GetByIdAsync(int id);
    Task<ContractItem> CreateAsync(ContractItem contractItem);
    Task<ContractItem> UpdateAsync(ContractItem contractItem);
    Task DeleteAsync(int id);
}