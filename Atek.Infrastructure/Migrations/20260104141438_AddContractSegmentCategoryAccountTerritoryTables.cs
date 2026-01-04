using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atek.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddContractSegmentCategoryAccountTerritoryTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Schedule",
                table: "Contracts",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusNotes",
                table: "Contracts",
                type: "longtext",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ContractAccounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractId = table.Column<int>(type: "INTEGER", nullable: false),
                    AccountId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractAccounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContractAccounts_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractAccounts_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContractCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractId = table.Column<int>(type: "INTEGER", nullable: false),
                    ItemCategoryId = table.Column<int>(type: "INTEGER", nullable: false),
                    ItemTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    DiscountPercentage = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true),
                    RebatePercentage = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true),
                    ConditionalRebate = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true),
                    GrowthRebate = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContractCategories_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContractCategories_ItemCategories_ItemCategoryId",
                        column: x => x.ItemCategoryId,
                        principalTable: "ItemCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractCategories_ItemTypes_ItemTypeId",
                        column: x => x.ItemTypeId,
                        principalTable: "ItemTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ContractSegments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractId = table.Column<int>(type: "INTEGER", nullable: false),
                    VendorSegmentId = table.Column<int>(type: "INTEGER", nullable: false),
                    ItemTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    DiscountPercentage = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true),
                    RebatePercentage = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true),
                    ConditionalRebate = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true),
                    GrowthRebate = table.Column<decimal>(type: "TEXT", precision: 5, scale: 4, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractSegments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContractSegments_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContractSegments_ItemTypes_ItemTypeId",
                        column: x => x.ItemTypeId,
                        principalTable: "ItemTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContractSegments_VendorSegments_VendorSegmentId",
                        column: x => x.VendorSegmentId,
                        principalTable: "VendorSegments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TerritoryAccounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VendorTerritoryId = table.Column<int>(type: "INTEGER", nullable: false),
                    AccountId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TerritoryAccounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TerritoryAccounts_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TerritoryAccounts_VendorTerritories_VendorTerritoryId",
                        column: x => x.VendorTerritoryId,
                        principalTable: "VendorTerritories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractAccounts_AccountId",
                table: "ContractAccounts",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractAccounts_ContractId",
                table: "ContractAccounts",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractCategories_ContractId",
                table: "ContractCategories",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractCategories_ItemCategoryId",
                table: "ContractCategories",
                column: "ItemCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractCategories_ItemTypeId",
                table: "ContractCategories",
                column: "ItemTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractSegments_ContractId",
                table: "ContractSegments",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractSegments_ItemTypeId",
                table: "ContractSegments",
                column: "ItemTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractSegments_VendorSegmentId",
                table: "ContractSegments",
                column: "VendorSegmentId");

            migrationBuilder.CreateIndex(
                name: "IX_TerritoryAccounts_AccountId",
                table: "TerritoryAccounts",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_TerritoryAccounts_VendorTerritoryId",
                table: "TerritoryAccounts",
                column: "VendorTerritoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContractAccounts");

            migrationBuilder.DropTable(
                name: "ContractCategories");

            migrationBuilder.DropTable(
                name: "ContractSegments");

            migrationBuilder.DropTable(
                name: "TerritoryAccounts");

            migrationBuilder.DropColumn(
                name: "Schedule",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "StatusNotes",
                table: "Contracts");
        }
    }
}
