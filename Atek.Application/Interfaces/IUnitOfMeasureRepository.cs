using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IUnitOfMeasureRepository
{
    Task<List<UnitOfMeasure>> GetAllAsync();
    Task<UnitOfMeasure?> GetByIdAsync(int id);
    Task<UnitOfMeasure> CreateAsync(UnitOfMeasure unitOfMeasure);
    Task<UnitOfMeasure> UpdateAsync(UnitOfMeasure unitOfMeasure);
    Task DeleteAsync(int id);
}