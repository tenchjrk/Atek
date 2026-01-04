using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface ITerritoryAccountRepository
{
    Task<IEnumerable<TerritoryAccount>> GetAllAsync();
    Task<TerritoryAccount?> GetByIdAsync(int id);
    Task<IEnumerable<TerritoryAccount>> GetByTerritoryIdAsync(int territoryId);
    Task<IEnumerable<TerritoryAccount>> GetByAccountIdAsync(int accountId);
    Task<TerritoryAccount> CreateAsync(TerritoryAccount territoryAccount);
    Task<TerritoryAccount> UpdateAsync(int id, TerritoryAccount territoryAccount);
    Task DeleteAsync(int id);
}