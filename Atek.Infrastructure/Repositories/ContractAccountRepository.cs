using Atek.Domain.Entities;
using Atek.Infrastructure.Data;
using Atek.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Atek.Infrastructure.Repositories;

public class ContractAccountRepository : IContractAccountRepository
{
    private readonly ApplicationDbContext _context;

    public ContractAccountRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ContractAccount>> GetAllAsync()
    {
        return await _context.ContractAccounts
            .Include(ca => ca.Contract)
            .Include(ca => ca.Account)
            .ToListAsync();
    }

    public async Task<ContractAccount?> GetByIdAsync(int id)
    {
        return await _context.ContractAccounts
            .Include(ca => ca.Contract)
            .Include(ca => ca.Account)
            .FirstOrDefaultAsync(ca => ca.Id == id);
    }

    public async Task<IEnumerable<ContractAccount>> GetByContractIdAsync(int contractId)
    {
        return await _context.ContractAccounts
            .Include(ca => ca.Contract)
            .Include(ca => ca.Account)
            .Where(ca => ca.ContractId == contractId)
            .ToListAsync();
    }

    public async Task<IEnumerable<ContractAccount>> GetByAccountIdAsync(int accountId)
    {
        return await _context.ContractAccounts
            .Include(ca => ca.Contract)
            .Include(ca => ca.Account)
            .Where(ca => ca.AccountId == accountId)
            .ToListAsync();
    }

    public async Task<ContractAccount> CreateAsync(ContractAccount contractAccount)
    {
        _context.ContractAccounts.Add(contractAccount);
        await _context.SaveChangesAsync();
        return contractAccount;
    }

    public async Task<ContractAccount> UpdateAsync(int id, ContractAccount contractAccount)
    {
        var existing = await _context.ContractAccounts.FindAsync(id);
        if (existing == null)
        {
            throw new KeyNotFoundException($"ContractAccount with id {id} not found");
        }

        existing.ContractId = contractAccount.ContractId;
        existing.AccountId = contractAccount.AccountId;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteAsync(int id)
    {
        var contractAccount = await _context.ContractAccounts.FindAsync(id);
        if (contractAccount != null)
        {
            _context.ContractAccounts.Remove(contractAccount);
            await _context.SaveChangesAsync();
        }
    }
}