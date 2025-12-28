using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class VendorRepository : IVendorRepository
{
    private readonly ApplicationDbContext _context;

    public VendorRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Vendor>> GetAllAsync()
    {
        return await _context.Vendors
            .Include(v => v.ParentVendor)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Vendor?> GetByIdAsync(int id)
    {
        return await _context.Vendors
            .Include(v => v.ParentVendor)
            .Include(v => v.ChildVendors)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<Vendor> CreateAsync(Vendor vendor)
    {
        // Set audit fields on create
        vendor.CreatedDate = DateTime.UtcNow;
        vendor.LastModifiedDate = DateTime.UtcNow;
        
        _context.Vendors.Add(vendor);
        await _context.SaveChangesAsync();
        
        // Reload with parent info
        var created = await _context.Vendors
            .Include(v => v.ParentVendor)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == vendor.Id);
        
        return created ?? vendor;
    }

    public async Task<Vendor> UpdateAsync(Vendor vendor)
    {
        // Attach and update properties
        var existing = await _context.Vendors.FindAsync(vendor.Id);
        if (existing != null)
        {
            existing.Name = vendor.Name;
            existing.ParentVendorId = vendor.ParentVendorId;
            existing.AddressLine1 = vendor.AddressLine1;
            existing.AddressLine2 = vendor.AddressLine2;
            existing.City = vendor.City;
            existing.State = vendor.State;
            existing.PostalCode = vendor.PostalCode;
            existing.Country = vendor.Country;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        // Reload with parent info
        var updated = await _context.Vendors
            .Include(v => v.ParentVendor)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == vendor.Id);
        
        return updated ?? vendor;
    }

    public async Task DeleteAsync(int id)
    {
        var vendor = await _context.Vendors.FindAsync(id);
        if (vendor != null)
        {
            _context.Vendors.Remove(vendor);
            await _context.SaveChangesAsync();
        }
    }
}