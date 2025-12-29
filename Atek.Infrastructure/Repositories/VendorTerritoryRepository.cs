using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class VendorTerritoryRepository : IVendorTerritoryRepository
{
    private readonly ApplicationDbContext _context;

    public VendorTerritoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<VendorTerritory>> GetAllAsync()
    {
        return await _context.VendorTerritories
            .Include(vt => vt.VendorRegion)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<VendorTerritory>> GetByRegionIdAsync(int regionId)
    {
        return await _context.VendorTerritories
            .Where(vt => vt.VendorRegionId == regionId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<VendorTerritory?> GetByIdAsync(int id)
    {
        return await _context.VendorTerritories
            .Include(vt => vt.VendorRegion)
            .AsNoTracking()
            .FirstOrDefaultAsync(vt => vt.Id == id);
    }

    public async Task<VendorTerritory> CreateAsync(VendorTerritory vendorTerritory)
    {
        vendorTerritory.CreatedDate = DateTime.UtcNow;
        vendorTerritory.LastModifiedDate = DateTime.UtcNow;
        
        _context.VendorTerritories.Add(vendorTerritory);
        await _context.SaveChangesAsync();
        
        var created = await _context.VendorTerritories
            .Include(vt => vt.VendorRegion)
            .AsNoTracking()
            .FirstOrDefaultAsync(vt => vt.Id == vendorTerritory.Id);
        
        return created ?? vendorTerritory;
    }

    public async Task<VendorTerritory> UpdateAsync(VendorTerritory vendorTerritory)
    {
        var existing = await _context.VendorTerritories.FindAsync(vendorTerritory.Id);
        if (existing != null)
        {
            existing.VendorRegionId = vendorTerritory.VendorRegionId;
            existing.Name = vendorTerritory.Name;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.VendorTerritories
            .Include(vt => vt.VendorRegion)
            .AsNoTracking()
            .FirstOrDefaultAsync(vt => vt.Id == vendorTerritory.Id);
        
        return updated ?? vendorTerritory;
    }

    public async Task DeleteAsync(int id)
    {
        var vendorTerritory = await _context.VendorTerritories.FindAsync(id);
        if (vendorTerritory != null)
        {
            _context.VendorTerritories.Remove(vendorTerritory);
            await _context.SaveChangesAsync();
        }
    }
}