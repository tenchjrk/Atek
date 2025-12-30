using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atek.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameTypeToNameInAccountAndVendorTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "VendorTypes",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "AccountTypes",
                newName: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "VendorTypes",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "AccountTypes",
                newName: "Type");
        }
    }
}
