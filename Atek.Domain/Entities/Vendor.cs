namespace Atek.Domain.Entities;

public class Vendor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    // Legal entity identifiers
    public string DunsNumber { get; set; } = string.Empty;
    public string Ein { get; set; } = string.Empty;
    
    // Address fields
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    
    // Audit fields
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    
    // Self-referencing foreign key
    public int? ParentVendorId { get; set; }
    
    // Navigation property to parent
    public Vendor? ParentVendor { get; set; }
    
    // Navigation property to children
    public ICollection<Vendor> ChildVendors { get; set; } = new List<Vendor>();
    
    // Foreign key to VendorType
    public int? VendorTypeId { get; set; }
    
    // Navigation property to VendorType
    public VendorType? VendorType { get; set; }
}