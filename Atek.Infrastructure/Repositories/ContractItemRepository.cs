using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class ContractItemRepository : IContractItemRepository
{
    private readonly ApplicationDbContext _context;

    public ContractItemRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ContractItem>> GetAllAsync()
    {
        return await _context.ContractItems
            .Include(ci => ci.Contract)
            .Include(ci => ci.Item)
            .Include(ci => ci.ItemCategory)
            .Include(ci => ci.VendorSegment)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<ContractItem>> GetByContractIdAsync(int contractId)
    {
        return await _context.ContractItems
            .Where(ci => ci.ContractId == contractId)
            .Include(ci => ci.Contract)
            .Include(ci => ci.Item)
            .Include(ci => ci.ItemCategory)
            .Include(ci => ci.VendorSegment)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<ContractItem?> GetByIdAsync(int id)
    {
        return await _context.ContractItems
            .Include(ci => ci.Contract)
            .Include(ci => ci.Item)
            .Include(ci => ci.ItemCategory)
            .Include(ci => ci.VendorSegment)
            .AsNoTracking()
            .FirstOrDefaultAsync(ci => ci.Id == id);
    }

    public async Task<ContractItem> CreateAsync(ContractItem contractItem)
    {
        contractItem.CreatedDate = DateTime.UtcNow;
        contractItem.LastModifiedDate = DateTime.UtcNow;
        
        _context.ContractItems.Add(contractItem);
        await _context.SaveChangesAsync();
        
        var created = await _context.ContractItems
            .Include(ci => ci.Contract)
            .Include(ci => ci.Item)
            .Include(ci => ci.ItemCategory)
            .Include(ci => ci.VendorSegment)
            .AsNoTracking()
            .FirstOrDefaultAsync(ci => ci.Id == contractItem.Id);
        
        return created ?? contractItem;
    }

    public async Task<ContractItem> UpdateAsync(ContractItem contractItem)
    {
        var existing = await _context.ContractItems.FindAsync(contractItem.Id);
        if (existing != null)
        {
            existing.ContractId = contractItem.ContractId;
            existing.PricingLevel = contractItem.PricingLevel;
            existing.ItemId = contractItem.ItemId;
            existing.ItemCategoryId = contractItem.ItemCategoryId;
            existing.VendorSegmentId = contractItem.VendorSegmentId;
            existing.DiscountPercentage = contractItem.DiscountPercentage;
            existing.FlatDiscountPrice = contractItem.FlatDiscountPrice;
            existing.RebatePercentage = contractItem.RebatePercentage;
            existing.NetRebatePrice = contractItem.NetRebatePrice;
            existing.CommitmentQuantity = contractItem.CommitmentQuantity;
            existing.CommitmentDollars = contractItem.CommitmentDollars;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.ContractItems
            .Include(ci => ci.Contract)
            .Include(ci => ci.Item)
            .Include(ci => ci.ItemCategory)
            .Include(ci => ci.VendorSegment)
            .AsNoTracking()
            .FirstOrDefaultAsync(ci => ci.Id == contractItem.Id);
        
        return updated ?? contractItem;
    }

    public async Task DeleteAsync(int id)
    {
        var contractItem = await _context.ContractItems.FindAsync(id);
        if (contractItem != null)
        {
            _context.ContractItems.Remove(contractItem);
            await _context.SaveChangesAsync();
        }
    }
}