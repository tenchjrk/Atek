using Microsoft.EntityFrameworkCore;
using Atek.Application.Interfaces;
using Atek.Domain.Entities;
using Atek.Infrastructure.Data;

namespace Atek.Infrastructure.Repositories;

public class ContractRepository : IContractRepository
{
    private readonly ApplicationDbContext _context;

    public ContractRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Contract>> GetAllAsync()
    {
        return await _context.Contracts
            .Include(c => c.Account)
            .Include(c => c.Vendor)
            .Include(c => c.ContractStatus)
            .Include(c => c.ContractType)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<Contract>> GetByAccountIdAsync(int accountId)
    {
        return await _context.Contracts
            .Where(c => c.AccountId == accountId)
            .Include(c => c.Account)
            .Include(c => c.Vendor)
            .Include(c => c.ContractStatus)
            .Include(c => c.ContractType)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Contract?> GetByIdAsync(int id)
    {
        return await _context.Contracts
            .Include(c => c.Account)
            .Include(c => c.Vendor)
            .Include(c => c.ContractStatus)
            .Include(c => c.ContractType)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Contract> CreateAsync(Contract contract)
    {
        contract.CreatedDate = DateTime.UtcNow;
        contract.LastModifiedDate = DateTime.UtcNow;
        contract.ExecutionDate = null;
        contract.StartDate = null;
        contract.EndDate = null;
        contract.InterestRate = contract.InterestRate;
        contract.APR = contract.APR;
        contract.LeaseType = contract.LeaseType;
        contract.VendorId = contract.VendorId;
        contract.Schedule = contract.Schedule;
        contract.StatusNotes = contract.StatusNotes;
        
        _context.Contracts.Add(contract);
        await _context.SaveChangesAsync();
        
        var created = await _context.Contracts
            .Include(c => c.Account)
            .Include(c => c.Vendor)
            .Include(c => c.ContractStatus)
            .Include(c => c.ContractType)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == contract.Id);
        
        return created ?? contract;
    }

    public async Task<Contract> UpdateAsync(Contract contract)
    {
        var existing = await _context.Contracts.FindAsync(contract.Id);
        if (existing != null)
        {
            existing.AccountId = contract.AccountId;
            existing.VendorId = contract.VendorId;
            existing.Name = contract.Name;
            existing.Description = contract.Description;
            existing.ContractStatusId = contract.ContractStatusId;
            existing.ContractTypeId = contract.ContractTypeId;
            existing.TermLengthMonths = contract.TermLengthMonths;
            existing.InterestRate = contract.InterestRate;
            existing.APR = contract.APR;
            existing.LeaseType = contract.LeaseType;
            existing.Schedule = contract.Schedule;
            existing.StatusNotes = contract.StatusNotes;
            existing.LastModifiedDate = DateTime.UtcNow;
            
            // Only update dates if execution date is being set
            if (contract.ExecutionDate.HasValue && !existing.ExecutionDate.HasValue)
            {
                existing.ExecutionDate = contract.ExecutionDate;
                existing.StartDate = new DateTime(
                    existing.ExecutionDate.Value.Year,
                    existing.ExecutionDate.Value.Month,
                    1
                ).AddMonths(1);
                
                existing.EndDate = existing.StartDate.Value.AddMonths(existing.TermLengthMonths);
            }
            
            await _context.SaveChangesAsync();
        }
        
        var updated = await _context.Contracts
            .Include(c => c.Account)
            .Include(c => c.Vendor)
            .Include(c => c.ContractStatus)
            .Include(c => c.ContractType)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == contract.Id);
        
        return updated ?? contract;
    }

    public async Task DeleteAsync(int id)
    {
        var contract = await _context.Contracts.FindAsync(id);
        if (contract != null)
        {
            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync();
        }
    }
}