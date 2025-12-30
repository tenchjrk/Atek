namespace Atek.Domain.Entities;

public class Contract
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ContractStatusId { get; set; }
    public DateTime? ExecutionDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int TermLengthMonths { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }

    // Navigation properties
    public Account? Account { get; set; }
    public ContractStatus? ContractStatus { get; set; }
}