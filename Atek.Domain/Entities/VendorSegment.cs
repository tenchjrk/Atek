namespace Atek.Domain.Entities;

public class VendorSegment
{
    public int Id { get; set; }
    public int VendorId { get; set; }
    public string Name { get; set; } = string.Empty;
    
    // Audit fields
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    
    // Navigation property
    public Vendor? Vendor { get; set; }
}