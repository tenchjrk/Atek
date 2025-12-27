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
            .AsNoTracking() // Prevents tracking and helps with serialization
            .ToListAsync();
    }

    public async Task<Account?> GetByIdAsync(int id)
    {
        return await _context.Accounts
            .Include(a => a.ParentAccount)
            .Include(a => a.ChildAccounts)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Account> CreateAsync(Account account)
    {
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();
        
        // Reload with parent info
        var created = await _context.Accounts
            .Include(a => a.ParentAccount)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == account.Id);
        
        return created ?? account;
    }

    public async Task<Account> UpdateAsync(Account account)
    {
        // Attach and update only the scalar properties
        var existing = await _context.Accounts.FindAsync(account.Id);
        if (existing != null)
        {
            existing.Name = account.Name;
            existing.ParentAccountId = account.ParentAccountId;
            await _context.SaveChangesAsync();
        }
        
        // Reload with parent info
        var updated = await _context.Accounts
            .Include(a => a.ParentAccount)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == account.Id);
        
        return updated ?? account;
    }

    public async Task DeleteAsync(int id)
    {
        var account = await _context.Accounts.FindAsync(id);
        if (account != null)
        {
            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
        }
    }
}