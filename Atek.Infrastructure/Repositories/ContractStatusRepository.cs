using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class ContractStatusRepository : IContractStatusRepository
{
    private readonly ApplicationDbContext _context;

    public ContractStatusRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ContractStatus>> GetAllAsync()
    {
        return await _context.ContractStatuses.AsNoTracking().ToListAsync();
    }

    public async Task<ContractStatus?> GetByIdAsync(int id)
    {
        return await _context.ContractStatuses.AsNoTracking().FirstOrDefaultAsync(cs => cs.Id == id);
    }

    public async Task<ContractStatus> CreateAsync(ContractStatus contractStatus)
    {
        _context.ContractStatuses.Add(contractStatus);
        await _context.SaveChangesAsync();
        return contractStatus;
    }

    public async Task<ContractStatus> UpdateAsync(ContractStatus contractStatus)
    {
        var existing = await _context.ContractStatuses.FindAsync(contractStatus.Id);
        if (existing != null)
        {
            existing.Name = contractStatus.Name;
            await _context.SaveChangesAsync();
        }
        return contractStatus;
    }

    public async Task DeleteAsync(int id)
    {
        var contractStatus = await _context.ContractStatuses.FindAsync(id);
        if (contractStatus != null)
        {
            _context.ContractStatuses.Remove(contractStatus);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> IsInUseAsync(int id)
    {
        return await _context.Contracts.AnyAsync(c => c.ContractStatusId == id);
    }
}