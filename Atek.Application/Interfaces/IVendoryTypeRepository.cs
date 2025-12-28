using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IVendorTypeRepository
{
    Task<List<VendorType>> GetAllAsync();
    Task<VendorType?> GetByIdAsync(int id);
    Task<VendorType> CreateAsync(VendorType vendorType);
    Task<VendorType> UpdateAsync(VendorType vendorType);
    Task DeleteAsync(int id);
}