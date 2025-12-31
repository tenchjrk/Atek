namespace Atek.Domain.Entities;

public class ContractItem
{
    public int Id { get; set; }
    public int ContractId { get; set; }
    
    // Pricing level discriminator
    public string PricingLevel { get; set; } = string.Empty; // "Item", "Category", or "Segment"
    
    // Foreign keys (only one will be used based on PricingLevel)
    public int? ItemId { get; set; }
    public int? ItemCategoryId { get; set; }
    public int? VendorSegmentId { get; set; }
    
    // Pricing details - Discounts (user can enter both)
    public decimal? DiscountPercentage { get; set; }
    public decimal? FlatDiscountPrice { get; set; }
    
    // Pricing details - Rebates (user enters %, system calculates net price)
    public decimal? RebatePercentage { get; set; }
    public decimal? NetRebatePrice { get; set; }  // Calculated: FlatDiscountPrice * (1 - RebatePercentage)
    
    // Commitment tracking
    public int? CommitmentQuantity { get; set; }
    public decimal? CommitmentDollars { get; set; }
    
    // Audit fields
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    
    // Navigation properties
    public Contract? Contract { get; set; }
    public Item? Item { get; set; }
    public ItemCategory? ItemCategory { get; set; }
    public VendorSegment? VendorSegment { get; set; }
}