using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IAccountTypeRepository
{
    Task<List<AccountType>> GetAllAsync();
    Task<AccountType?> GetByIdAsync(int id);
    Task<AccountType> CreateAsync(AccountType accountType);
    Task<AccountType> UpdateAsync(AccountType accountType);
    Task DeleteAsync(int id);
}