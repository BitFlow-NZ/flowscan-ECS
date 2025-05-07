using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class migration_v16 : Migration
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

            migrationBuilder.DropColumn(
                name: "EditPerson",
                table: "EventItems");

            migrationBuilder.AddColumn<string>(
                name: "LastEditPerson",
                table: "Events",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditTime",
                table: "Events",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_EventItems_Items_ItemId",
                table: "EventItems",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventItems_Units_UnitId",
                table: "EventItems",
                column: "UnitId",
                principalTable: "Units",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
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

            migrationBuilder.DropColumn(
                name: "LastEditPerson",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "LastEditTime",
                table: "Events");

            migrationBuilder.AddColumn<string>(
                name: "EditPerson",
                table: "EventItems",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

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
    }
}
