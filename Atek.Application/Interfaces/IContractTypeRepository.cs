using Atek.Domain.Entities;

namespace Atek.Application.Interfaces;

public interface IContractTypeRepository
{
    Task<List<ContractType>> GetAllAsync();
    Task<ContractType?> GetByIdAsync(int id);
    Task<ContractType> CreateAsync(ContractType contractType);
    Task<ContractType> UpdateAsync(ContractType contractType);
    Task DeleteAsync(int id);
    Task<bool> IsInUseAsync(int id);
}
