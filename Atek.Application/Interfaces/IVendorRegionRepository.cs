using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IVendorRegionRepository
{
    Task<List<VendorRegion>> GetAllAsync();
    Task<List<VendorRegion>> GetBySegmentIdAsync(int segmentId);
    Task<VendorRegion?> GetByIdAsync(int id);
    Task<VendorRegion> CreateAsync(VendorRegion vendorRegion);
    Task<VendorRegion> UpdateAsync(VendorRegion vendorRegion);
    Task DeleteAsync(int id);
}