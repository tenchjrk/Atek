namespace Atek.Domain.Entities;

public class AccountAddress
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    
    // Address fields
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    
    // Purpose flags
    public bool IsShipping { get; set; }
    public bool IsBilling { get; set; }
    
    // Optional descriptive name
    public string? Name { get; set; }
    
    // Audit fields
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    
    // Navigation property
    public Account? Account { get; set; }
}