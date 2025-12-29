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
    }
}