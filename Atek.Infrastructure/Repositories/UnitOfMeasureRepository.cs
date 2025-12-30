using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class UnitOfMeasureRepository : IUnitOfMeasureRepository
{
    private readonly ApplicationDbContext _context;

    public UnitOfMeasureRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UnitOfMeasure>> GetAllAsync()
    {
        return await _context.UnitOfMeasures
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<UnitOfMeasure?> GetByIdAsync(int id)
    {
        return await _context.UnitOfMeasures
            .AsNoTracking()
            .FirstOrDefaultAsync(uom => uom.Id == id);
    }

    public async Task<UnitOfMeasure> CreateAsync(UnitOfMeasure unitOfMeasure)
    {
        unitOfMeasure.CreatedDate = DateTime.UtcNow;
        unitOfMeasure.LastModifiedDate = DateTime.UtcNow;
        
        _context.UnitOfMeasures.Add(unitOfMeasure);
        await _context.SaveChangesAsync();
        
        var created = await _context.UnitOfMeasures
            .AsNoTracking()
            .FirstOrDefaultAsync(uom => uom.Id == unitOfMeasure.Id);
        
        return created ?? unitOfMeasure;
    }

    public async Task<UnitOfMeasure> UpdateAsync(UnitOfMeasure unitOfMeasure)
    {
        var existing = await _context.UnitOfMeasures.FindAsync(unitOfMeasure.Id);
        if (existing != null)
        {
            existing.Name = unitOfMeasure.Name;
            existing.ShortName = unitOfMeasure.ShortName;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.UnitOfMeasures
            .AsNoTracking()
            .FirstOrDefaultAsync(uom => uom.Id == unitOfMeasure.Id);
        
        return updated ?? unitOfMeasure;
    }

    public async Task DeleteAsync(int id)
    {
        var unitOfMeasure = await _context.UnitOfMeasures.FindAsync(id);
        if (unitOfMeasure != null)
        {
            _context.UnitOfMeasures.Remove(unitOfMeasure);
            await _context.SaveChangesAsync();
        }
    }
}