using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atek.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyContractItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractItems_ItemCategories_ItemCategoryId",
                table: "ContractItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractItems_VendorSegments_VendorSegmentId",
                table: "ContractItems");

            migrationBuilder.DropIndex(
                name: "IX_ContractItems_ItemCategoryId",
                table: "ContractItems");

            migrationBuilder.DropIndex(
                name: "IX_ContractItems_VendorSegmentId",
                table: "ContractItems");

            migrationBuilder.DropColumn(
                name: "CommitmentDollars",
                table: "ContractItems");

            migrationBuilder.DropColumn(
                name: "CommitmentQuantity",
                table: "ContractItems");

            migrationBuilder.DropColumn(
                name: "FlatDiscountPrice",
                table: "ContractItems");

            migrationBuilder.DropColumn(
                name: "ItemCategoryId",
                table: "ContractItems");

            migrationBuilder.DropColumn(
                name: "NetRebatePrice",
                table: "ContractItems");

            migrationBuilder.DropColumn(
                name: "PricingLevel",
                table: "ContractItems");

            migrationBuilder.DropColumn(
                name: "VendorSegmentId",
                table: "ContractItems");

            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                table: "ContractItems",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                table: "ContractItems",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<decimal>(
                name: "CommitmentDollars",
                table: "ContractItems",
                type: "TEXT",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CommitmentQuantity",
                table: "ContractItems",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FlatDiscountPrice",
                table: "ContractItems",
                type: "TEXT",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ItemCategoryId",
                table: "ContractItems",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "NetRebatePrice",
                table: "ContractItems",
                type: "TEXT",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PricingLevel",
                table: "ContractItems",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "VendorSegmentId",
                table: "ContractItems",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContractItems_ItemCategoryId",
                table: "ContractItems",
                column: "ItemCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractItems_VendorSegmentId",
                table: "ContractItems",
                column: "VendorSegmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractItems_ItemCategories_ItemCategoryId",
                table: "ContractItems",
                column: "ItemCategoryId",
                principalTable: "ItemCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractItems_VendorSegments_VendorSegmentId",
                table: "ContractItems",
                column: "VendorSegmentId",
                principalTable: "VendorSegments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
