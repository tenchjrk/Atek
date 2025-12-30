using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class ItemRepository : IItemRepository
{
    private readonly ApplicationDbContext _context;

    public ItemRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Item>> GetAllAsync()
    {
        return await _context.Items
            .Include(i => i.ItemCategory)
                .ThenInclude(ic => ic!.VendorSegment)
                    .ThenInclude(vs => vs!.Vendor)
            .Include(i => i.UnitOfMeasure)
            .Include(i => i.ItemType)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<Item>> GetByCategoryIdAsync(int categoryId)
    {
        return await _context.Items
            .Where(i => i.ItemCategoryId == categoryId)
            .Include(i => i.ItemCategory)
                .ThenInclude(ic => ic!.VendorSegment)
                    .ThenInclude(vs => vs!.Vendor)
            .Include(i => i.UnitOfMeasure)
            .Include(i => i.ItemType)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Item?> GetByIdAsync(int id)
    {
        return await _context.Items
            .Include(i => i.ItemCategory)
                .ThenInclude(ic => ic!.VendorSegment)
                    .ThenInclude(vs => vs!.Vendor)
            .Include(i => i.UnitOfMeasure)
            .Include(i => i.ItemType)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<Item> CreateAsync(Item item)
    {
        item.CreatedDate = DateTime.UtcNow;
        item.LastModifiedDate = DateTime.UtcNow;
        
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
        
        var created = await _context.Items
            .Include(i => i.ItemCategory)
                .ThenInclude(ic => ic!.VendorSegment)
                    .ThenInclude(vs => vs!.Vendor)
            .Include(i => i.UnitOfMeasure)
            .Include(i => i.ItemType)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == item.Id);
        
        return created ?? item;
    }

    public async Task<Item> UpdateAsync(Item item)
    {
        var existing = await _context.Items.FindAsync(item.Id);
        if (existing != null)
        {
            existing.ItemCategoryId = item.ItemCategoryId;
            existing.Name = item.Name;
            existing.ShortName = item.ShortName;
            existing.Description = item.Description;
            existing.ListPrice = item.ListPrice;
            existing.Cost = item.Cost;
            existing.EachesPerUnitOfMeasure = item.EachesPerUnitOfMeasure;
            existing.UnitOfMeasureId = item.UnitOfMeasureId;
            existing.ItemTypeId = item.ItemTypeId;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.Items
            .Include(i => i.ItemCategory)
                .ThenInclude(ic => ic!.VendorSegment)
                    .ThenInclude(vs => vs!.Vendor)
            .Include(i => i.UnitOfMeasure)
            .Include(i => i.ItemType)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == item.Id);
        
        return updated ?? item;
    }

    public async Task DeleteAsync(int id)
    {
        var item = await _context.Items.FindAsync(id);
        if (item != null)
        {
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}