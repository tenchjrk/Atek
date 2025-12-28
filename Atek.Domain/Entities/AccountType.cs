namespace Atek.Domain.Entities;

public class AccountType
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    
    // Navigation property - accounts that use this type
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
}