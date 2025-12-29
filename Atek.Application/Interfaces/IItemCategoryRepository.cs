using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IItemCategoryRepository
{
    Task<List<ItemCategory>> GetAllAsync();
    Task<List<ItemCategory>> GetBySegmentIdAsync(int segmentId);
    Task<ItemCategory?> GetByIdAsync(int id);
    Task<ItemCategory> CreateAsync(ItemCategory itemCategory);
    Task<ItemCategory> UpdateAsync(ItemCategory itemCategory);
    Task DeleteAsync(int id);
}