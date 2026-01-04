using Atek.Domain.Entities;
using Atek.Infrastructure.Data;
using Atek.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Atek.Infrastructure.Repositories;

public class ContractCategoryRepository : IContractCategoryRepository
{
    private readonly ApplicationDbContext _context;

    public ContractCategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ContractCategory>> GetAllAsync()
    {
        return await _context.ContractCategories
            .Include(cc => cc.Contract)
            .Include(cc => cc.ItemCategory)
            .Include(cc => cc.ItemType)
            .ToListAsync();
    }

    public async Task<ContractCategory?> GetByIdAsync(int id)
    {
        return await _context.ContractCategories
            .Include(cc => cc.Contract)
            .Include(cc => cc.ItemCategory)
            .Include(cc => cc.ItemType)
            .FirstOrDefaultAsync(cc => cc.Id == id);
    }

    public async Task<IEnumerable<ContractCategory>> GetByContractIdAsync(int contractId)
    {
        return await _context.ContractCategories
            .Include(cc => cc.Contract)
            .Include(cc => cc.ItemCategory)
            .Include(cc => cc.ItemType)
            .Where(cc => cc.ContractId == contractId)
            .ToListAsync();
    }

    public async Task<ContractCategory> CreateAsync(ContractCategory contractCategory)
    {
        _context.ContractCategories.Add(contractCategory);
        await _context.SaveChangesAsync();
        return contractCategory;
    }

    public async Task<ContractCategory> UpdateAsync(int id, ContractCategory contractCategory)
    {
        var existing = await _context.ContractCategories.FindAsync(id);
        if (existing == null)
        {
            throw new KeyNotFoundException($"ContractCategory with id {id} not found");
        }

        existing.ContractId = contractCategory.ContractId;
        existing.ItemCategoryId = contractCategory.ItemCategoryId;
        existing.ItemTypeId = contractCategory.ItemTypeId;
        existing.DiscountPercentage = contractCategory.DiscountPercentage;
        existing.RebatePercentage = contractCategory.RebatePercentage;
        existing.ConditionalRebate = contractCategory.ConditionalRebate;
        existing.GrowthRebate = contractCategory.GrowthRebate;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteAsync(int id)
    {
        var contractCategory = await _context.ContractCategories.FindAsync(id);
        if (contractCategory != null)
        {
            _context.ContractCategories.Remove(contractCategory);
            await _context.SaveChangesAsync();
        }
    }
}