namespace Atek.Domain.Entities;

public class Account
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    // Self-referencing foreign key
    public int? ParentAccountId { get; set; }
    
    // Navigation property to parent
    public Account? ParentAccount { get; set; }
    
    // Navigation property to children
    public ICollection<Account> ChildAccounts { get; set; } = new List<Account>();
}