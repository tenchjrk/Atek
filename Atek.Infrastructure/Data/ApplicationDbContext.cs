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
}