using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IContractSegmentRepository
{
    Task<IEnumerable<ContractSegment>> GetAllAsync();
    Task<ContractSegment?> GetByIdAsync(int id);
    Task<IEnumerable<ContractSegment>> GetByContractIdAsync(int contractId);
    Task<ContractSegment> CreateAsync(ContractSegment contractSegment);
    Task<ContractSegment> UpdateAsync(int id, ContractSegment contractSegment);
    Task DeleteAsync(int id);
}