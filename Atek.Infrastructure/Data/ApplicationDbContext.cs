using Microsoft.EntityFrameworkCore;
using Atek.Domain.Entities;

namespace Atek.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options)
    {
    }

    public DbSet<Account> Accounts { get; set; }
    public DbSet<Vendor> Vendors { get; set; }
    public DbSet<AccountType> AccountTypes { get; set; }
    public DbSet<VendorType> VendorTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Account self-referencing relationship
        modelBuilder.Entity<Account>()
            .HasOne(a => a.ParentAccount)
            .WithMany(a => a.ChildAccounts)
            .HasForeignKey(a => a.ParentAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Vendor self-referencing relationship
        modelBuilder.Entity<Vendor>()
            .HasOne(v => v.ParentVendor)
            .WithMany(v => v.ChildVendors)
            .HasForeignKey(v => v.ParentVendorId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Account to AccountType relationship
        modelBuilder.Entity<Account>()
            .HasOne(a => a.AccountType)
            .WithMany(at => at.Accounts)
            .HasForeignKey(a => a.AccountTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Vendor to VendorType relationship
        modelBuilder.Entity<Vendor>()
            .HasOne(v => v.VendorType)
            .WithMany(vt => vt.Vendors)
            .HasForeignKey(v => v.VendorTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}