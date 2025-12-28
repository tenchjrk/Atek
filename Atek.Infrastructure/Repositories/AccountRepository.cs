using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly ApplicationDbContext _context;

    public AccountRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Account>> GetAllAsync()
    {
        return await _context.Accounts
            .Include(a => a.ParentAccount)
            .Include(a => a.AccountType)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Account?> GetByIdAsync(int id)
    {
        return await _context.Accounts
            .Include(a => a.ParentAccount)
            .Include(a => a.ChildAccounts)
            .Include(a => a.AccountType)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Account> CreateAsync(Account account)
    {
        account.CreatedDate = DateTime.UtcNow;
        account.LastModifiedDate = DateTime.UtcNow;
        
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();
        
        var created = await _context.Accounts
            .Include(a => a.ParentAccount)
            .Include(a => a.AccountType)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == account.Id);
        
        return created ?? account;
    }

    public async Task<Account> UpdateAsync(Account account)
    {
        var existing = await _context.Accounts.FindAsync(account.Id);
        if (existing != null)
        {
            existing.Name = account.Name;
            existing.DunsNumber = account.DunsNumber;
            existing.Ein = account.Ein;
            existing.ParentAccountId = account.ParentAccountId;
            existing.AccountTypeId = account.AccountTypeId;
            existing.AddressLine1 = account.AddressLine1;
            existing.AddressLine2 = account.AddressLine2;
            existing.City = account.City;
            existing.State = account.State;
            existing.PostalCode = account.PostalCode;
            existing.Country = account.Country;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.Accounts
            .Include(a => a.ParentAccount)
            .Include(a => a.AccountType)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == account.Id);
        
        return updated ?? account;
    }

    public async Task DeleteAsync(int id)
    {
        var account = await _context.Accounts
            .Include(a => a.ChildAccounts)
            .FirstOrDefaultAsync(a => a.Id == id);
            
        if (account != null)
        {
            if (account.ChildAccounts.Any())
            {
                throw new InvalidOperationException(
                    $"Cannot delete account '{account.Name}' because it has {account.ChildAccounts.Count} child account(s). " +
                    "Please reassign or delete the child accounts first.");
            }
            
            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
        }
    }
}