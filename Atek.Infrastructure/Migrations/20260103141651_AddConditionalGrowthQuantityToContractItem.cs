using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atek.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddConditionalGrowthQuantityToContractItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ConditionalRebate",
                table: "ContractItems",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "GrowthRebate",
                table: "ContractItems",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuantityCommitment",
                table: "ContractItems",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConditionalRebate",
                table: "ContractItems");

            migrationBuilder.DropColumn(
                name: "GrowthRebate",
                table: "ContractItems");

            migrationBuilder.DropColumn(
                name: "QuantityCommitment",
                table: "ContractItems");
        }
    }
}
