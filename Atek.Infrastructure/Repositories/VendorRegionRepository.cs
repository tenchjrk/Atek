using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class VendorRegionRepository : IVendorRegionRepository
{
    private readonly ApplicationDbContext _context;

    public VendorRegionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<VendorRegion>> GetAllAsync()
    {
        return await _context.VendorRegions
            .Include(vr => vr.VendorSegment)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<VendorRegion>> GetBySegmentIdAsync(int segmentId)
    {
        return await _context.VendorRegions
            .Where(vr => vr.VendorSegmentId == segmentId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<VendorRegion?> GetByIdAsync(int id)
    {
        return await _context.VendorRegions
            .Include(vr => vr.VendorSegment)
            .AsNoTracking()
            .FirstOrDefaultAsync(vr => vr.Id == id);
    }

    public async Task<VendorRegion> CreateAsync(VendorRegion vendorRegion)
    {
        vendorRegion.CreatedDate = DateTime.UtcNow;
        vendorRegion.LastModifiedDate = DateTime.UtcNow;
        
        _context.VendorRegions.Add(vendorRegion);
        await _context.SaveChangesAsync();
        
        var created = await _context.VendorRegions
            .Include(vr => vr.VendorSegment)
            .AsNoTracking()
            .FirstOrDefaultAsync(vr => vr.Id == vendorRegion.Id);
        
        return created ?? vendorRegion;
    }

    public async Task<VendorRegion> UpdateAsync(VendorRegion vendorRegion)
    {
        var existing = await _context.VendorRegions.FindAsync(vendorRegion.Id);
        if (existing != null)
        {
            existing.VendorSegmentId = vendorRegion.VendorSegmentId;
            existing.Name = vendorRegion.Name;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.VendorRegions
            .Include(vr => vr.VendorSegment)
            .AsNoTracking()
            .FirstOrDefaultAsync(vr => vr.Id == vendorRegion.Id);
        
        return updated ?? vendorRegion;
    }

    public async Task DeleteAsync(int id)
    {
        var vendorRegion = await _context.VendorRegions
            .Include(vr => vr.VendorSegment)
            .FirstOrDefaultAsync(vr => vr.Id == id);
            
        if (vendorRegion != null)
        {
            // Check if any territories exist for this region
            var territoriesCount = await _context.VendorTerritories
                .Where(vt => vt.VendorRegionId == id)
                .CountAsync();
            
            if (territoriesCount > 0)
            {
                throw new InvalidOperationException(
                    $"Cannot delete region '{vendorRegion.Name}' because it has {territoriesCount} territory/territories. " +
                    "Please delete the territories first.");
            }
            
            _context.VendorRegions.Remove(vendorRegion);
            await _context.SaveChangesAsync();
        }
    }
}