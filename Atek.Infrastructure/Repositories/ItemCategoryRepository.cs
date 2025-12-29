using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class ItemCategoryRepository : IItemCategoryRepository
{
    private readonly ApplicationDbContext _context;

    public ItemCategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ItemCategory>> GetAllAsync()
    {
        return await _context.ItemCategories
            .Include(ic => ic.VendorSegment)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<ItemCategory>> GetBySegmentIdAsync(int segmentId)
    {
        return await _context.ItemCategories
            .Where(ic => ic.VendorSegmentId == segmentId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<ItemCategory?> GetByIdAsync(int id)
    {
        return await _context.ItemCategories
            .Include(ic => ic.VendorSegment)
            .AsNoTracking()
            .FirstOrDefaultAsync(ic => ic.Id == id);
    }

    public async Task<ItemCategory> CreateAsync(ItemCategory itemCategory)
    {
        itemCategory.CreatedDate = DateTime.UtcNow;
        itemCategory.LastModifiedDate = DateTime.UtcNow;
        
        _context.ItemCategories.Add(itemCategory);
        await _context.SaveChangesAsync();
        
        var created = await _context.ItemCategories
            .Include(ic => ic.VendorSegment)
            .AsNoTracking()
            .FirstOrDefaultAsync(ic => ic.Id == itemCategory.Id);
        
        return created ?? itemCategory;
    }

    public async Task<ItemCategory> UpdateAsync(ItemCategory itemCategory)
    {
        var existing = await _context.ItemCategories.FindAsync(itemCategory.Id);
        if (existing != null)
        {
            existing.VendorSegmentId = itemCategory.VendorSegmentId;
            existing.Name = itemCategory.Name;
            existing.ShortName = itemCategory.ShortName;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.ItemCategories
            .Include(ic => ic.VendorSegment)
            .AsNoTracking()
            .FirstOrDefaultAsync(ic => ic.Id == itemCategory.Id);
        
        return updated ?? itemCategory;
    }

    public async Task DeleteAsync(int id)
    {
        var itemCategory = await _context.ItemCategories.FindAsync(id);
        if (itemCategory != null)
        {
            _context.ItemCategories.Remove(itemCategory);
            await _context.SaveChangesAsync();
        }
    }
}