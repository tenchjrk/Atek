using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class ContractTypeRepository : IContractTypeRepository
{
    private readonly ApplicationDbContext _context;

    public ContractTypeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ContractType>> GetAllAsync()
    {
        return await _context.ContractTypes.AsNoTracking().ToListAsync();
    }

    public async Task<ContractType?> GetByIdAsync(int id)
    {
        return await _context.ContractTypes.AsNoTracking().FirstOrDefaultAsync(ct => ct.Id == id);
    }

    public async Task<ContractType> CreateAsync(ContractType contractType)
    {
        _context.ContractTypes.Add(contractType);
        await _context.SaveChangesAsync();
        return contractType;
    }

    public async Task<ContractType> UpdateAsync(ContractType contractType)
    {
        var existing = await _context.ContractTypes.FindAsync(contractType.Id);
        if (existing != null)
        {
            existing.Name = contractType.Name;
            await _context.SaveChangesAsync();
        }
        return contractType;
    }

    public async Task DeleteAsync(int id)
    {
        var contractType = await _context.ContractTypes.FindAsync(id);
        if (contractType != null)
        {
            _context.ContractTypes.Remove(contractType);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> IsInUseAsync(int id)
    {
        return await _context.Contracts.AnyAsync(c => c.ContractTypeId == id);
    }
}