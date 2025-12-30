using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IContractStatusRepository
{
    Task<List<ContractStatus>> GetAllAsync();
    Task<ContractStatus?> GetByIdAsync(int id);
    Task<ContractStatus> CreateAsync(ContractStatus contractStatus);
    Task<ContractStatus> UpdateAsync(ContractStatus contractStatus);
    Task DeleteAsync(int id);
    Task<bool> IsInUseAsync(int id);
}