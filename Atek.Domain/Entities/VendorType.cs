namespace Atek.Domain.Entities;

public class VendorType
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    
    // Navigation property - vendors that use this type
    public ICollection<Vendor> Vendors { get; set; } = new List<Vendor>();
}