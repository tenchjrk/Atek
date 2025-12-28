using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atek.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVendorTypeEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VendorTypeId",
                table: "Vendors",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VendorTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Type = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VendorTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Vendors_VendorTypeId",
                table: "Vendors",
                column: "VendorTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vendors_VendorTypes_VendorTypeId",
                table: "Vendors",
                column: "VendorTypeId",
                principalTable: "VendorTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vendors_VendorTypes_VendorTypeId",
                table: "Vendors");

            migrationBuilder.DropTable(
                name: "VendorTypes");

            migrationBuilder.DropIndex(
                name: "IX_Vendors_VendorTypeId",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "VendorTypeId",
                table: "Vendors");
        }
    }
}
