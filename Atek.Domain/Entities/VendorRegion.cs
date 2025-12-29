namespace Atek.Domain.Entities;

public class VendorRegion
{
    public int Id { get; set; }
    public int VendorSegmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    
    // Audit fields
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    
    // Navigation property
    public VendorSegment? VendorSegment { get; set; }
}