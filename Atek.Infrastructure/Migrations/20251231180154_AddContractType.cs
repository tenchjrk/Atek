using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atek.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddContractType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ContractTypeId",
                table: "Contracts",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ContractTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_ContractTypeId",
                table: "Contracts",
                column: "ContractTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractTypes_Name",
                table: "ContractTypes",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_ContractTypes_ContractTypeId",
                table: "Contracts",
                column: "ContractTypeId",
                principalTable: "ContractTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_ContractTypes_ContractTypeId",
                table: "Contracts");

            migrationBuilder.DropTable(
                name: "ContractTypes");

            migrationBuilder.DropIndex(
                name: "IX_Contracts_ContractTypeId",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "ContractTypeId",
                table: "Contracts");
        }
    }
}
