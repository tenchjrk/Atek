namespace Atek.Domain.Entities;

public class ContractSegment
{
    public int Id { get; set; }
    public int ContractId { get; set; }
    public int VendorSegmentId { get; set; }
    public int ItemTypeId { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public decimal? RebatePercentage { get; set; }
    public decimal? ConditionalRebate { get; set; }
    public decimal? GrowthRebate { get; set; }

    // Navigation properties
    public Contract? Contract { get; set; }
    public VendorSegment? VendorSegment { get; set; }
    public ItemType? ItemType { get; set; }
}