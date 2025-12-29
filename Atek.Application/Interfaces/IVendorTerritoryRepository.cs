using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IVendorTerritoryRepository
{
    Task<List<VendorTerritory>> GetAllAsync();
    Task<List<VendorTerritory>> GetByRegionIdAsync(int regionId);
    Task<VendorTerritory?> GetByIdAsync(int id);
    Task<VendorTerritory> CreateAsync(VendorTerritory vendorTerritory);
    Task<VendorTerritory> UpdateAsync(VendorTerritory vendorTerritory);
    Task DeleteAsync(int id);
}