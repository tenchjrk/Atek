using Atek.Domain.Entities;
using Atek.Infrastructure.Data;
using Atek.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Atek.Infrastructure.Repositories;

public class TerritoryAccountRepository : ITerritoryAccountRepository
{
    private readonly ApplicationDbContext _context;

    public TerritoryAccountRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TerritoryAccount>> GetAllAsync()
    {
        return await _context.TerritoryAccounts
            .Include(ta => ta.VendorTerritory)
            .Include(ta => ta.Account)
            .ToListAsync();
    }

    public async Task<TerritoryAccount?> GetByIdAsync(int id)
    {
        return await _context.TerritoryAccounts
            .Include(ta => ta.VendorTerritory)
            .Include(ta => ta.Account)
            .FirstOrDefaultAsync(ta => ta.Id == id);
    }

    public async Task<IEnumerable<TerritoryAccount>> GetByTerritoryIdAsync(int territoryId)
    {
        return await _context.TerritoryAccounts
            .Include(ta => ta.VendorTerritory)
            .Include(ta => ta.Account)
            .Where(ta => ta.VendorTerritoryId == territoryId)
            .ToListAsync();
    }

    public async Task<IEnumerable<TerritoryAccount>> GetByAccountIdAsync(int accountId)
    {
        return await _context.TerritoryAccounts
            .Include(ta => ta.VendorTerritory)
            .Include(ta => ta.Account)
            .Where(ta => ta.AccountId == accountId)
            .ToListAsync();
    }

    public async Task<TerritoryAccount> CreateAsync(TerritoryAccount territoryAccount)
    {
        _context.TerritoryAccounts.Add(territoryAccount);
        await _context.SaveChangesAsync();
        return territoryAccount;
    }

    public async Task<TerritoryAccount> UpdateAsync(int id, TerritoryAccount territoryAccount)
    {
        var existing = await _context.TerritoryAccounts.FindAsync(id);
        if (existing == null)
        {
            throw new KeyNotFoundException($"TerritoryAccount with id {id} not found");
        }

        existing.VendorTerritoryId = territoryAccount.VendorTerritoryId;
        existing.AccountId = territoryAccount.AccountId;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteAsync(int id)
    {
        var territoryAccount = await _context.TerritoryAccounts.FindAsync(id);
        if (territoryAccount != null)
        {
            _context.TerritoryAccounts.Remove(territoryAccount);
            await _context.SaveChangesAsync();
        }
    }
}