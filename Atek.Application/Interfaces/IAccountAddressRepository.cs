using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IAccountAddressRepository
{
    Task<List<AccountAddress>> GetAllAsync();
    Task<List<AccountAddress>> GetByAccountIdAsync(int accountId);
    Task<AccountAddress?> GetByIdAsync(int id);
    Task<AccountAddress> CreateAsync(AccountAddress accountAddress);
    Task<AccountAddress> UpdateAsync(AccountAddress accountAddress);
    Task DeleteAsync(int id);
}