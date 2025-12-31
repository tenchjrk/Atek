using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atek.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddContractItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContractItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractId = table.Column<int>(type: "INTEGER", nullable: false),
                    PricingLevel = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    ItemId = table.Column<int>(type: "INTEGER", nullable: true),
                    ItemCategoryId = table.Column<int>(type: "INTEGER", nullable: true),
                    VendorSegmentId = table.Column<int>(type: "INTEGER", nullable: true),
                    DiscountPercentage = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true),
                    FlatDiscountPrice = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    RebatePercentage = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true),
                    NetRebatePrice = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    CommitmentQuantity = table.Column<int>(type: "INTEGER", nullable: true),
                    CommitmentDollars = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContractItems_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContractItems_ItemCategories_ItemCategoryId",
                        column: x => x.ItemCategoryId,
                        principalTable: "ItemCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractItems_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractItems_VendorSegments_VendorSegmentId",
                        column: x => x.VendorSegmentId,
                        principalTable: "VendorSegments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractItems_ContractId",
                table: "ContractItems",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractItems_ItemCategoryId",
                table: "ContractItems",
                column: "ItemCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractItems_ItemId",
                table: "ContractItems",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractItems_VendorSegmentId",
                table: "ContractItems",
                column: "VendorSegmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContractItems");
        }
    }
}
