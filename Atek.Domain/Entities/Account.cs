namespace Atek.Domain.Entities;

public class Account
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
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
    public int? ParentAccountId { get; set; }
    
    // Navigation property to parent
    public Account? ParentAccount { get; set; }
    
    // Navigation property to children
    public ICollection<Account> ChildAccounts { get; set; } = new List<Account>();
}