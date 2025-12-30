using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IContractRepository
{
    Task<List<Contract>> GetAllAsync();
    Task<List<Contract>> GetByAccountIdAsync(int accountId);
    Task<Contract?> GetByIdAsync(int id);
    Task<Contract> CreateAsync(Contract contract);
    Task<Contract> UpdateAsync(Contract contract);
    Task DeleteAsync(int id);
}