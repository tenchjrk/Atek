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
        return await _context.AccountTypes.AsNoTracking().ToListAsync();
    }

    public async Task<AccountType?> GetByIdAsync(int id)
    {
        return await _context.AccountTypes.AsNoTracking().FirstOrDefaultAsync(at => at.Id == id);
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
            existing.Name = accountType.Name;
            await _context.SaveChangesAsync();
        }
        return accountType;
    }

    public async Task DeleteAsync(int id)
    {
        var accountType = await _context.AccountTypes.FindAsync(id);
        if (accountType != null)
        {
            _context.AccountTypes.Remove(accountType);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> IsInUseAsync(int id)
    {
        return await _context.Accounts.AnyAsync(a => a.AccountTypeId == id);
    }
}