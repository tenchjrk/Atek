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
        return await _context.Accounts.ToListAsync();
    }

    public async Task<Account?> GetByIdAsync(int id)
    {
        return await _context.Accounts.FindAsync(id);
    }

    public async Task<Account> CreateAsync(Account account)
    {
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task<Account> UpdateAsync(Account account)
    {
        _context.Accounts.Update(account);
        await _context.SaveChangesAsync();
        return account;
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