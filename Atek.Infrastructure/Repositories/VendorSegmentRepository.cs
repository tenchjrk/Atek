using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class VendorSegmentRepository : IVendorSegmentRepository
{
    private readonly ApplicationDbContext _context;

    public VendorSegmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<VendorSegment>> GetAllAsync()
    {
        return await _context.VendorSegments
            .Include(vs => vs.Vendor)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<VendorSegment>> GetByVendorIdAsync(int vendorId)
    {
        return await _context.VendorSegments
            .Where(vs => vs.VendorId == vendorId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<VendorSegment?> GetByIdAsync(int id)
    {
        return await _context.VendorSegments
            .Include(vs => vs.Vendor)
            .AsNoTracking()
            .FirstOrDefaultAsync(vs => vs.Id == id);
    }

    public async Task<VendorSegment> CreateAsync(VendorSegment vendorSegment)
    {
        vendorSegment.CreatedDate = DateTime.UtcNow;
        vendorSegment.LastModifiedDate = DateTime.UtcNow;
        
        _context.VendorSegments.Add(vendorSegment);
        await _context.SaveChangesAsync();
        
        var created = await _context.VendorSegments
            .Include(vs => vs.Vendor)
            .AsNoTracking()
            .FirstOrDefaultAsync(vs => vs.Id == vendorSegment.Id);
        
        return created ?? vendorSegment;
    }

    public async Task<VendorSegment> UpdateAsync(VendorSegment vendorSegment)
    {
        var existing = await _context.VendorSegments.FindAsync(vendorSegment.Id);
        if (existing != null)
        {
            existing.VendorId = vendorSegment.VendorId;
            existing.Name = vendorSegment.Name;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.VendorSegments
            .Include(vs => vs.Vendor)
            .AsNoTracking()
            .FirstOrDefaultAsync(vs => vs.Id == vendorSegment.Id);
        
        return updated ?? vendorSegment;
    }

    public async Task DeleteAsync(int id)
    {
        var vendorSegment = await _context.VendorSegments
            .Include(vs => vs.Vendor)
            .FirstOrDefaultAsync(vs => vs.Id == id);
            
        if (vendorSegment != null)
        {
            // Check if any regions exist for this segment
            var regionsCount = await _context.VendorRegions
                .Where(vr => vr.VendorSegmentId == id)
                .CountAsync();
            
            if (regionsCount > 0)
            {
                throw new InvalidOperationException(
                    $"Cannot delete segment '{vendorSegment.Name}' because it has {regionsCount} region(s). " +
                    "Please delete the regions first.");
            }
            
            _context.VendorSegments.Remove(vendorSegment);
            await _context.SaveChangesAsync();
        }
    }
}