using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IAccountRepository
{
    Task<List<Account>> GetAllAsync();
    Task<Account?> GetByIdAsync(int id);
    Task<Account> CreateAsync(Account account);
    Task<Account> UpdateAsync(Account account);
    Task DeleteAsync(int id);
}