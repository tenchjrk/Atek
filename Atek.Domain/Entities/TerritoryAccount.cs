namespace Atek.Domain.Entities;

public class TerritoryAccount
{
    public int Id { get; set; }
    public int VendorTerritoryId { get; set; }
    public int AccountId { get; set; }

    // Navigation properties
    public VendorTerritory? VendorTerritory { get; set; }
    public Account? Account { get; set; }
}