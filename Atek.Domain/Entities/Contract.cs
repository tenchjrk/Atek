namespace Atek.Domain.Entities;

public enum ContractSchedule
{
    Monthly = 1,
    Annual = 2,
    SemiAnnual = 3,
    FullTerm = 4
}

public class Contract
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public int VendorId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ContractStatusId { get; set; }
    public int ContractTypeId { get; set; }
    public DateTime? ExecutionDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int TermLengthMonths { get; set; }
    public decimal? InterestRate { get; set; }
    public decimal? APR { get; set; }
    public string? LeaseType { get; set; }
    public ContractSchedule? Schedule { get; set; }
    public string? StatusNotes { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }

    // Navigation properties
    public Account? Account { get; set; }
    public Vendor? Vendor { get; set; }
    public ContractStatus? ContractStatus { get; set; }
    public ContractType? ContractType { get; set; }
    public ICollection<ContractItem> ContractItems { get; set; } = new List<ContractItem>();
    public ICollection<ContractSegment> ContractSegments { get; set; } = new List<ContractSegment>();
    public ICollection<ContractCategory> ContractCategories { get; set; } = new List<ContractCategory>();
    public ICollection<ContractAccount> ContractAccounts { get; set; } = new List<ContractAccount>();
}