using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddThemeHeadingFont : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeadingFontFamily",
                table: "ThemeSettings",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "markazi-text");

            migrationBuilder.UpdateData(
                table: "ThemeSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "HeadingFontFamily",
                value: "markazi-text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeadingFontFamily",
                table: "ThemeSettings");
        }
    }
}
