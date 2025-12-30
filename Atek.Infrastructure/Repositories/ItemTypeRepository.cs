using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class ItemTypeRepository : IItemTypeRepository
{
    private readonly ApplicationDbContext _context;

    public ItemTypeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ItemType>> GetAllAsync()
    {
        return await _context.ItemTypes
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<ItemType?> GetByIdAsync(int id)
    {
        return await _context.ItemTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(it => it.Id == id);
    }

    public async Task<ItemType> CreateAsync(ItemType itemType)
    {
        itemType.CreatedDate = DateTime.UtcNow;
        itemType.LastModifiedDate = DateTime.UtcNow;
        
        _context.ItemTypes.Add(itemType);
        await _context.SaveChangesAsync();
        
        var created = await _context.ItemTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(it => it.Id == itemType.Id);
        
        return created ?? itemType;
    }

    public async Task<ItemType> UpdateAsync(ItemType itemType)
    {
        var existing = await _context.ItemTypes.FindAsync(itemType.Id);
        if (existing != null)
        {
            existing.Name = itemType.Name;
            existing.ShortName = itemType.ShortName;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.ItemTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(it => it.Id == itemType.Id);
        
        return updated ?? itemType;
    }

    public async Task DeleteAsync(int id)
    {
        var itemType = await _context.ItemTypes.FindAsync(id);
        if (itemType != null)
        {
            _context.ItemTypes.Remove(itemType);
            await _context.SaveChangesAsync();
        }
    }
}