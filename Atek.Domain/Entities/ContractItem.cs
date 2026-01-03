namespace Atek.Domain.Entities;

public class ContractItem
{
    public int Id { get; set; }
    public int ContractId { get; set; }
    public int ItemId { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public decimal? RebatePercentage { get; set; }
    public decimal? ConditionalRebate { get; set; }
    public decimal? GrowthRebate { get; set; }
    public int? QuantityCommitment { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }

    // Navigation properties
    public Contract? Contract { get; set; }
    public Item? Item { get; set; }
}