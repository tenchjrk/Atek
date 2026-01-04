using Atek.Domain.Entities;
using Atek.Infrastructure.Data;
using Atek.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Atek.Infrastructure.Repositories;

public class ContractSegmentRepository : IContractSegmentRepository
{
    private readonly ApplicationDbContext _context;

    public ContractSegmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ContractSegment>> GetAllAsync()
    {
        return await _context.ContractSegments
            .Include(cs => cs.Contract)
            .Include(cs => cs.VendorSegment)
            .Include(cs => cs.ItemType)
            .ToListAsync();
    }

    public async Task<ContractSegment?> GetByIdAsync(int id)
    {
        return await _context.ContractSegments
            .Include(cs => cs.Contract)
            .Include(cs => cs.VendorSegment)
            .Include(cs => cs.ItemType)
            .FirstOrDefaultAsync(cs => cs.Id == id);
    }

    public async Task<IEnumerable<ContractSegment>> GetByContractIdAsync(int contractId)
    {
        return await _context.ContractSegments
            .Include(cs => cs.Contract)
            .Include(cs => cs.VendorSegment)
            .Include(cs => cs.ItemType)
            .Where(cs => cs.ContractId == contractId)
            .ToListAsync();
    }

    public async Task<ContractSegment> CreateAsync(ContractSegment contractSegment)
    {
        _context.ContractSegments.Add(contractSegment);
        await _context.SaveChangesAsync();
        return contractSegment;
    }

    public async Task<ContractSegment> UpdateAsync(int id, ContractSegment contractSegment)
    {
        var existing = await _context.ContractSegments.FindAsync(id);
        if (existing == null)
        {
            throw new KeyNotFoundException($"ContractSegment with id {id} not found");
        }

        existing.ContractId = contractSegment.ContractId;
        existing.VendorSegmentId = contractSegment.VendorSegmentId;
        existing.ItemTypeId = contractSegment.ItemTypeId;
        existing.DiscountPercentage = contractSegment.DiscountPercentage;
        existing.RebatePercentage = contractSegment.RebatePercentage;
        existing.ConditionalRebate = contractSegment.ConditionalRebate;
        existing.GrowthRebate = contractSegment.GrowthRebate;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteAsync(int id)
    {
        var contractSegment = await _context.ContractSegments.FindAsync(id);
        if (contractSegment != null)
        {
            _context.ContractSegments.Remove(contractSegment);
            await _context.SaveChangesAsync();
        }
    }
}