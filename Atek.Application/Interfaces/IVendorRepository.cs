using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IVendorRepository
{
    Task<List<Vendor>> GetAllAsync();
    Task<Vendor?> GetByIdAsync(int id);
    Task<Vendor> CreateAsync(Vendor vendor);
    Task<Vendor> UpdateAsync(Vendor vendor);
    Task DeleteAsync(int id);
}