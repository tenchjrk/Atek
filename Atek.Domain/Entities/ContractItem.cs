namespace Atek.Domain.Entities;

public class ContractItem
{
    public int Id { get; set; }
    public int ContractId { get; set; }
    public int ItemId { get; set; }
    
    // Pricing - simple discount and rebate percentages applied to all purchases
    public decimal? DiscountPercentage { get; set; }
    public decimal? RebatePercentage { get; set; }
    
    // Audit fields
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    
    // Navigation properties
    public Contract? Contract { get; set; }
    public Item? Item { get; set; }
}