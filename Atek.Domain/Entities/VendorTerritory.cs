namespace Atek.Domain.Entities;

public class VendorTerritory
{
    public int Id { get; set; }
    public int VendorRegionId { get; set; }
    public string Name { get; set; } = string.Empty;
    
    // Audit fields
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    
    // Navigation property
    public VendorRegion? VendorRegion { get; set; }
}