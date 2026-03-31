using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToeicMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAttemptGuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AttemptGuid",
                table: "TestAttempts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            // Set AttemptGuid to a new GUID for each existing row
            migrationBuilder.Sql("UPDATE TestAttempts SET AttemptGuid = NEWID() WHERE AttemptGuid = '00000000-0000-0000-0000-000000000000'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttemptGuid",
                table: "TestAttempts");
        }
    }
}
