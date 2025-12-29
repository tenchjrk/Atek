using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class VendorTypeRepository : IVendorTypeRepository
{
    private readonly ApplicationDbContext _context;

    public VendorTypeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<VendorType>> GetAllAsync()
    {
        return await _context.VendorTypes
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<VendorType?> GetByIdAsync(int id)
    {
        return await _context.VendorTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(vt => vt.Id == id);
    }

    public async Task<VendorType> CreateAsync(VendorType vendorType)
    {
        _context.VendorTypes.Add(vendorType);
        await _context.SaveChangesAsync();
        return vendorType;
    }

    public async Task<VendorType> UpdateAsync(VendorType vendorType)
    {
        var existing = await _context.VendorTypes.FindAsync(vendorType.Id);
        if (existing != null)
        {
            existing.Type = vendorType.Type;
            await _context.SaveChangesAsync();
        }
        return vendorType;
    }

    public async Task DeleteAsync(int id)
    {
        var vendorType = await _context.VendorTypes.FindAsync(id);
        if (vendorType != null)
        {
            // Check if any vendors use this type
            var vendorsUsingType = await _context.Vendors
                .Where(v => v.VendorTypeId == id)
                .CountAsync();
            
            if (vendorsUsingType > 0)
            {
                throw new InvalidOperationException(
                    $"Cannot delete vendor type '{vendorType.Type}' because it is being used by {vendorsUsingType} vendor(s). " +
                    "Please reassign or remove these vendors first.");
            }
            
            _context.VendorTypes.Remove(vendorType);
            await _context.SaveChangesAsync();
        }
    }
}