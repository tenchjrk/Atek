using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IVendorSegmentRepository
{
    Task<List<VendorSegment>> GetAllAsync();
    Task<List<VendorSegment>> GetByVendorIdAsync(int vendorId);
    Task<VendorSegment?> GetByIdAsync(int id);
    Task<VendorSegment> CreateAsync(VendorSegment vendorSegment);
    Task<VendorSegment> UpdateAsync(VendorSegment vendorSegment);
    Task DeleteAsync(int id);
}