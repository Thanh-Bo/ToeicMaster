using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToeicMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVocabStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Vocabularies");

            migrationBuilder.AddColumn<int>(
                name: "TopicId",
                table: "Vocabularies",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Topics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Level = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LevelRange = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WordFamilies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VocabularyId = table.Column<int>(type: "int", nullable: false),
                    Word = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PartOfSpeech = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Meaning = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WordFamilies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WordFamilies_Vocabularies_VocabularyId",
                        column: x => x.VocabularyId,
                        principalTable: "Vocabularies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Vocabularies_TopicId",
                table: "Vocabularies",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_WordFamilies_VocabularyId",
                table: "WordFamilies",
                column: "VocabularyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vocabularies_Topics_TopicId",
                table: "Vocabularies",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vocabularies_Topics_TopicId",
                table: "Vocabularies");

            migrationBuilder.DropTable(
                name: "Topics");

            migrationBuilder.DropTable(
                name: "WordFamilies");

            migrationBuilder.DropIndex(
                name: "IX_Vocabularies_TopicId",
                table: "Vocabularies");

            migrationBuilder.DropColumn(
                name: "TopicId",
                table: "Vocabularies");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Vocabularies",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
