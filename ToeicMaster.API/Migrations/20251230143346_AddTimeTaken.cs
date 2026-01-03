using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToeicMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTimeTaken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TimeTaken",
                table: "TestAttempts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeTaken",
                table: "TestAttempts");
        }
    }
}
