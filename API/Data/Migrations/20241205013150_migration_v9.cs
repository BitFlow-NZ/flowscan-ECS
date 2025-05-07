using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class migration_v9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "addedTime",
                table: "EventItems",
                newName: "EditTime");

            migrationBuilder.AddColumn<string>(
                name: "Img",
                table: "Units",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "EditPerson",
                table: "EventItems",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Img",
                table: "Units");

            migrationBuilder.DropColumn(
                name: "EditPerson",
                table: "EventItems");

            migrationBuilder.RenameColumn(
                name: "EditTime",
                table: "EventItems",
                newName: "addedTime");
        }
    }
}
