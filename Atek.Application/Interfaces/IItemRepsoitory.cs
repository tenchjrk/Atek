using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IItemRepository
{
    Task<List<Item>> GetAllAsync();
    Task<List<Item>> GetByCategoryIdAsync(int categoryId);
    Task<Item?> GetByIdAsync(int id);
    Task<Item> CreateAsync(Item item);
    Task<Item> UpdateAsync(Item item);
    Task DeleteAsync(int id);
}