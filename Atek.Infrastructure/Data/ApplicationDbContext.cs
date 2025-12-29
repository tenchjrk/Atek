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
    }
}