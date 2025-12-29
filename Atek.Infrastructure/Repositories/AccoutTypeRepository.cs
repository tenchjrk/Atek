using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class AccountTypeRepository : IAccountTypeRepository
{
    private readonly ApplicationDbContext _context;

    public AccountTypeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AccountType>> GetAllAsync()
    {
        return await _context.AccountTypes
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<AccountType?> GetByIdAsync(int id)
    {
        return await _context.AccountTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(at => at.Id == id);
    }

    public async Task<AccountType> CreateAsync(AccountType accountType)
    {
        _context.AccountTypes.Add(accountType);
        await _context.SaveChangesAsync();
        return accountType;
    }

    public async Task<AccountType> UpdateAsync(AccountType accountType)
    {
        var existing = await _context.AccountTypes.FindAsync(accountType.Id);
        if (existing != null)
        {
            existing.Type = accountType.Type;
            await _context.SaveChangesAsync();
        }
        return accountType;
    }

    public async Task DeleteAsync(int id)
    {
        var accountType = await _context.AccountTypes.FindAsync(id);
        if (accountType != null)
        {
            // Check if any accounts use this type
            var accountsUsingType = await _context.Accounts
                .Where(a => a.AccountTypeId == id)
                .CountAsync();
            
            if (accountsUsingType > 0)
            {
                throw new InvalidOperationException(
                    $"Cannot delete account type '{accountType.Type}' because it is being used by {accountsUsingType} account(s). " +
                    "Please reassign or remove these accounts first.");
            }
            
            _context.AccountTypes.Remove(accountType);
            await _context.SaveChangesAsync();
        }
    }
}