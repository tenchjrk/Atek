using Microsoft.EntityFrameworkCore;
using Atek.Domain.Entities;

namespace Atek.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<AccountType> AccountTypes => Set<AccountType>();
    public DbSet<VendorType> VendorTypes => Set<VendorType>();
    public DbSet<AccountAddress> AccountAddresses => Set<AccountAddress>();
    public DbSet<VendorSegment> VendorSegments => Set<VendorSegment>();
    public DbSet<VendorRegion> VendorRegions => Set<VendorRegion>();
    public DbSet<VendorTerritory> VendorTerritories => Set<VendorTerritory>();
    public DbSet<ItemCategory> ItemCategories => Set<ItemCategory>();
    public DbSet<UnitOfMeasure> UnitOfMeasures => Set<UnitOfMeasure>();
    public DbSet<ItemType> ItemTypes => Set<ItemType>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<ContractStatus> ContractStatuses => Set<ContractStatus>();
    public DbSet<Contract> Contracts => Set<Contract>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Account self-referencing relationship
        modelBuilder.Entity<Account>()
            .HasOne(a => a.ParentAccount)
            .WithMany(a => a.ChildAccounts)
            .HasForeignKey(a => a.ParentAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        // Vendor self-referencing relationship
        modelBuilder.Entity<Vendor>()
            .HasOne(v => v.ParentVendor)
            .WithMany(v => v.ChildVendors)
            .HasForeignKey(v => v.ParentVendorId)
            .OnDelete(DeleteBehavior.Restrict);

        // AccountAddress to Account relationship
        modelBuilder.Entity<AccountAddress>()
            .HasOne(aa => aa.Account)
            .WithMany()
            .HasForeignKey(aa => aa.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        // VendorSegment to Vendor relationship
        modelBuilder.Entity<VendorSegment>()
            .HasOne(vs => vs.Vendor)
            .WithMany()
            .HasForeignKey(vs => vs.VendorId)
            .OnDelete(DeleteBehavior.Cascade);

        // VendorRegion to VendorSegment relationship
        modelBuilder.Entity<VendorRegion>()
            .HasOne(vr => vr.VendorSegment)
            .WithMany()
            .HasForeignKey(vr => vr.VendorSegmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // VendorTerritory to VendorRegion relationship
        modelBuilder.Entity<VendorTerritory>()
            .HasOne(vt => vt.VendorRegion)
            .WithMany()
            .HasForeignKey(vt => vt.VendorRegionId)
            .OnDelete(DeleteBehavior.Cascade);

        // ItemCategory to VendorSegment relationship
        modelBuilder.Entity<ItemCategory>()
            .HasOne(ic => ic.VendorSegment)
            .WithMany()
            .HasForeignKey(ic => ic.VendorSegmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Item to ItemCategory relationship
        modelBuilder.Entity<Item>()
            .HasOne(i => i.ItemCategory)
            .WithMany()
            .HasForeignKey(i => i.ItemCategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Item to UnitOfMeasure relationship
        modelBuilder.Entity<Item>()
            .HasOne(i => i.UnitOfMeasure)
            .WithMany()
            .HasForeignKey(i => i.UnitOfMeasureId)
            .OnDelete(DeleteBehavior.Restrict);

        // Item to ItemType relationship
        modelBuilder.Entity<Item>()
            .HasOne(i => i.ItemType)
            .WithMany()
            .HasForeignKey(i => i.ItemTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure decimal precision for Item prices
        modelBuilder.Entity<Item>()
            .Property(i => i.ListPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Item>()
            .Property(i => i.Cost)
            .HasPrecision(18, 2);

                // ContractStatus configuration
        modelBuilder.Entity<ContractStatus>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Contract configuration
        modelBuilder.Entity<Contract>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TermLengthMonths).IsRequired();
            entity.Property(e => e.CreatedDate).IsRequired();
            entity.Property(e => e.LastModifiedDate).IsRequired();

            entity.HasOne(e => e.Account)
                .WithMany()
                .HasForeignKey(e => e.AccountId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ContractStatus)
                .WithMany()
                .HasForeignKey(e => e.ContractStatusId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}