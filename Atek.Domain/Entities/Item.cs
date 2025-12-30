namespace Atek.Domain.Entities;

public class Item
{
    public int Id { get; set; }
    public int ItemCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ShortName { get; set; }
    public string? Description { get; set; }
    public decimal ListPrice { get; set; }
    public decimal Cost { get; set; }
    public int EachesPerUnitOfMeasure { get; set; }
    public int UnitOfMeasureId { get; set; }
    public int ItemTypeId { get; set; }
    
    // Audit fields
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
    
    // Navigation properties
    public ItemCategory? ItemCategory { get; set; }
    public UnitOfMeasure? UnitOfMeasure { get; set; }
    public ItemType? ItemType { get; set; }
}