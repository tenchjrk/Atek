namespace Atek.Domain.Entities;

public class ContractAccount
{
    public int Id { get; set; }
    public int ContractId { get; set; }
    public int AccountId { get; set; }

    // Navigation properties
    public Contract? Contract { get; set; }
    public Account? Account { get; set; }
}