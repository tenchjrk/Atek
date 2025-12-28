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
            .Include(v => v.VendorType)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Vendor?> GetByIdAsync(int id)
    {
        return await _context.Vendors
            .Include(v => v.ParentVendor)
            .Include(v => v.ChildVendors)
            .Include(v => v.VendorType)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<Vendor> CreateAsync(Vendor vendor)
    {
        vendor.CreatedDate = DateTime.UtcNow;
        vendor.LastModifiedDate = DateTime.UtcNow;
        
        _context.Vendors.Add(vendor);
        await _context.SaveChangesAsync();
        
        var created = await _context.Vendors
            .Include(v => v.ParentVendor)
            .Include(v => v.VendorType)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == vendor.Id);
        
        return created ?? vendor;
    }

    public async Task<Vendor> UpdateAsync(Vendor vendor)
    {
        var existing = await _context.Vendors.FindAsync(vendor.Id);
        if (existing != null)
        {
            existing.Name = vendor.Name;
            existing.DunsNumber = vendor.DunsNumber;
            existing.Ein = vendor.Ein;
            existing.ParentVendorId = vendor.ParentVendorId;
            existing.VendorTypeId = vendor.VendorTypeId;
            existing.AddressLine1 = vendor.AddressLine1;
            existing.AddressLine2 = vendor.AddressLine2;
            existing.City = vendor.City;
            existing.State = vendor.State;
            existing.PostalCode = vendor.PostalCode;
            existing.Country = vendor.Country;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.Vendors
            .Include(v => v.ParentVendor)
            .Include(v => v.VendorType)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == vendor.Id);
        
        return updated ?? vendor;
    }

    public async Task DeleteAsync(int id)
    {
        var vendor = await _context.Vendors
            .Include(v => v.ChildVendors)
            .FirstOrDefaultAsync(v => v.Id == id);
            
        if (vendor != null)
        {
            if (vendor.ChildVendors.Any())
            {
                throw new InvalidOperationException(
                    $"Cannot delete vendor '{vendor.Name}' because it has {vendor.ChildVendors.Count} child vendor(s). " +
                    "Please reassign or delete the child vendors first.");
            }
            
            _context.Vendors.Remove(vendor);
            await _context.SaveChangesAsync();
        }
    }
}