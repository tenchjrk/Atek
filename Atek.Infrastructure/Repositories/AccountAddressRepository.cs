using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class AccountAddressRepository : IAccountAddressRepository
{
    private readonly ApplicationDbContext _context;

    public AccountAddressRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AccountAddress>> GetAllAsync()
    {
        return await _context.AccountAddresses
            .Include(aa => aa.Account)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<AccountAddress>> GetByAccountIdAsync(int accountId)
    {
        return await _context.AccountAddresses
            .Where(aa => aa.AccountId == accountId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<AccountAddress?> GetByIdAsync(int id)
    {
        return await _context.AccountAddresses
            .Include(aa => aa.Account)
            .AsNoTracking()
            .FirstOrDefaultAsync(aa => aa.Id == id);
    }

    public async Task<AccountAddress> CreateAsync(AccountAddress accountAddress)
    {
        accountAddress.CreatedDate = DateTime.UtcNow;
        accountAddress.LastModifiedDate = DateTime.UtcNow;
        accountAddress.NumberOfKiosks = accountAddress.NumberOfKiosks;
        
        _context.AccountAddresses.Add(accountAddress);
        await _context.SaveChangesAsync();
        
        var created = await _context.AccountAddresses
            .Include(aa => aa.Account)
            .AsNoTracking()
            .FirstOrDefaultAsync(aa => aa.Id == accountAddress.Id);
        
        return created ?? accountAddress;
    }

    public async Task<AccountAddress> UpdateAsync(AccountAddress accountAddress)
    {
        var existing = await _context.AccountAddresses.FindAsync(accountAddress.Id);
        if (existing != null)
        {
            existing.AccountId = accountAddress.AccountId;
            existing.AddressLine1 = accountAddress.AddressLine1;
            existing.AddressLine2 = accountAddress.AddressLine2;
            existing.City = accountAddress.City;
            existing.State = accountAddress.State;
            existing.PostalCode = accountAddress.PostalCode;
            existing.Country = accountAddress.Country;
            existing.IsShipping = accountAddress.IsShipping;
            existing.IsBilling = accountAddress.IsBilling;
            existing.Name = accountAddress.Name;
            existing.NumberOfKiosks = accountAddress.NumberOfKiosks;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.AccountAddresses
            .Include(aa => aa.Account)
            .AsNoTracking()
            .FirstOrDefaultAsync(aa => aa.Id == accountAddress.Id);
        
        return updated ?? accountAddress;
    }

    public async Task DeleteAsync(int id)
    {
        var accountAddress = await _context.AccountAddresses.FindAsync(id);
        if (accountAddress != null)
        {
            _context.AccountAddresses.Remove(accountAddress);
            await _context.SaveChangesAsync();
        }
    }
}