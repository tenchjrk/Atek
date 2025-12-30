using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IItemTypeRepository
{
    Task<List<ItemType>> GetAllAsync();
    Task<ItemType?> GetByIdAsync(int id);
    Task<ItemType> CreateAsync(ItemType itemType);
    Task<ItemType> UpdateAsync(ItemType itemType);
    Task DeleteAsync(int id);
}