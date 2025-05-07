using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class migration_v15 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventItems_Items_ItemId",
                table: "EventItems");

            migrationBuilder.DropForeignKey(
                name: "FK_EventItems_Units_UnitId",
                table: "EventItems");

            migrationBuilder.AddForeignKey(
                name: "FK_EventItems_Items_ItemId",
                table: "EventItems",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EventItems_Units_UnitId",
                table: "EventItems",
                column: "UnitId",
                principalTable: "Units",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventItems_Items_ItemId",
                table: "EventItems");

            migrationBuilder.DropForeignKey(
                name: "FK_EventItems_Units_UnitId",
                table: "EventItems");

            migrationBuilder.AddForeignKey(
                name: "FK_EventItems_Items_ItemId",
                table: "EventItems",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventItems_Units_UnitId",
                table: "EventItems",
                column: "UnitId",
                principalTable: "Units",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
