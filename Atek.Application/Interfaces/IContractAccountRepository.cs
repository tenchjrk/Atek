using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IContractAccountRepository
{
    Task<IEnumerable<ContractAccount>> GetAllAsync();
    Task<ContractAccount?> GetByIdAsync(int id);
    Task<IEnumerable<ContractAccount>> GetByContractIdAsync(int contractId);
    Task<IEnumerable<ContractAccount>> GetByAccountIdAsync(int accountId);
    Task<ContractAccount> CreateAsync(ContractAccount contractAccount);
    Task<ContractAccount> UpdateAsync(int id, ContractAccount contractAccount);
    Task DeleteAsync(int id);
}