using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atek.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNameAndDescriptionToContract : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Contracts",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Contracts",
                type: "TEXT",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Contracts");
        }
    }
}
