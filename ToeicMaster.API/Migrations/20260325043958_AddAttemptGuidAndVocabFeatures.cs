using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToeicMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAttemptGuidAndVocabFeatures : Migration
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

            // Update existing rows to have unique GUIDs
            migrationBuilder.Sql("UPDATE TestAttempts SET AttemptGuid = NEWID()");

            migrationBuilder.CreateTable(
                name: "QuestionVocab",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TopicId = table.Column<int>(type: "int", nullable: false),
                    QuestionNo = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CorrectOption = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    ShortExplanation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LongExplanation = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionVocab", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionVocab_Topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionVocabAnswer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionVocabId = table.Column<int>(type: "int", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionVocabAnswer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionVocabAnswer_QuestionVocab_QuestionVocabId",
                        column: x => x.QuestionVocabId,
                        principalTable: "QuestionVocab",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionVocab_TopicId",
                table: "QuestionVocab",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionVocabAnswer_QuestionVocabId",
                table: "QuestionVocabAnswer",
                column: "QuestionVocabId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionVocabAnswer");

            migrationBuilder.DropTable(
                name: "QuestionVocab");

            migrationBuilder.DropColumn(
                name: "AttemptGuid",
                table: "TestAttempts");
        }
    }
}
