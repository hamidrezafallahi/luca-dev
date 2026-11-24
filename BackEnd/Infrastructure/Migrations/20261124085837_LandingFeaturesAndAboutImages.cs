using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class LandingFeaturesAndAboutImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "AboutSections",
                type: "character varying(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "LandingFeatures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EyebrowFa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    EyebrowEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleFa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    BodyFa = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    BodyEn = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    LinkTextFa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    LinkTextEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    LinkUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    Reverse = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: true),
                    UpdatedBy = table.Column<int>(type: "integer", nullable: true),
                    DeletedBy = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandingFeatures", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 1,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 3,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 4,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 5,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 6,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 7,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 8,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 9,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 10,
                column: "ImageUrl",
                value: "");

            migrationBuilder.UpdateData(
                table: "AboutSections",
                keyColumn: "Id",
                keyValue: 11,
                column: "ImageUrl",
                value: "");

            // Preserve any admin customizations to the existing form configuration.
            migrationBuilder.Sql("""
                UPDATE "EntityConfigs"
                SET "FormFieldsJson" = ("FormFieldsJson"::jsonb ||
                    CASE WHEN EXISTS (SELECT 1 FROM jsonb_array_elements("FormFieldsJson"::jsonb) field
                                      WHERE field->>'Name' = 'imageUrl')
                         THEN '[]'::jsonb ELSE jsonb_build_array(
                             jsonb_build_object('Name', 'imageUrl', 'Caption', 'Section image', 'Type', 'file')) END ||
                    CASE WHEN EXISTS (SELECT 1 FROM jsonb_array_elements("FormFieldsJson"::jsonb) field
                                      WHERE field->>'Name' = 'removeImage')
                         THEN '[]'::jsonb ELSE jsonb_build_array(
                             jsonb_build_object('Name', 'removeImage', 'Caption', 'Remove image', 'Type', 'checkbox')) END)::text
                WHERE "Id" = 35 AND "FormFieldsJson" IS NOT NULL
                ;
                """);

            migrationBuilder.InsertData(
                table: "EntityConfigs",
                columns: new[] { "Id", "ActionsJson", "ColumnsJson", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "EndPoint", "EnglishDisplayName", "EntityIconBase64", "EntityName", "FormFieldsJson", "IsActive", "PersianDisplayName", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 37, "[\"active\",\"edit\",\"delete\",\"new\"]", "[{\"Header\":\"Image\",\"Accessor\":\"imageUrl\",\"Type\":\"image\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"Title\",\"Accessor\":\"titleFa\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"Order\",\"Accessor\":\"displayOrder\",\"Type\":\"number\",\"Sortable\":false,\"Filterable\":false,\"Options\":null}]", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, null, "landingFeatures", "Landing features", "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25\" /></svg>", "landingFeatures", "[{\"Name\":\"eyebrowFa\",\"Caption\":\"\\u0628\\u0631\\u0686\\u0633\\u0628 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"eyebrowEn\",\"Caption\":\"English eyebrow\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"titleFa\",\"Caption\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"titleEn\",\"Caption\":\"English title\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"bodyFa\",\"Caption\":\"\\u0645\\u062A\\u0646 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Type\":\"textarea\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"bodyEn\",\"Caption\":\"English body\",\"Type\":\"textarea\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"linkTextFa\",\"Caption\":\"\\u0645\\u062A\\u0646 \\u0644\\u06CC\\u0646\\u06A9 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"linkTextEn\",\"Caption\":\"English link text\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"linkUrl\",\"Caption\":\"Link URL\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"imageUrl\",\"Caption\":\"Image\",\"Type\":\"file\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"removeImage\",\"Caption\":\"Remove image\",\"Type\":\"checkbox\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"displayOrder\",\"Caption\":\"Order\",\"Type\":\"number\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"reverse\",\"Caption\":\"Image on the right\",\"Type\":\"checkbox\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null}]", true, "ویژگی‌های صفحه اصلی", null, null });

            migrationBuilder.InsertData(
                table: "LandingFeatures",
                columns: new[] { "Id", "BodyEn", "BodyFa", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "DisplayOrder", "EyebrowEn", "EyebrowFa", "ImageUrl", "IsActive", "IsDeleted", "LinkTextEn", "LinkTextFa", "LinkUrl", "Reverse", "TitleEn", "TitleFa", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, "The declination angle of Luca loupes is set for each clinician, so head and neck stay in a natural position through the working day.", "زاویه شیب لوپ‌های لوکا برای هر دندانپزشک جداگانه تنظیم می‌شود تا در طول روز کاری، سر و گردن در وضعیت طبیعی بماند.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, null, 1, "Ergonomics", "ارگونومی", "/images/landingPage/Black%20Eyeglasses%20with%20LUCA%20Magnifying%20Loupe.png", true, false, "Explore ergonomic loupes", "آشنایی با لوپ‌های ارگونومیک", "products", false, "A straight neck, a direct view", "گردن صاف، نگاه مستقیم", null, null },
                    { 2, "Multi-coated lenses give a bright, distortion-free image across the whole field of view; tissue colour appears as it is.", "عدسی‌های چندلایه تصویری روشن و بدون اعوجاج در تمام میدان دید می‌دهند؛ رنگ بافت همان‌طور که هست دیده می‌شود.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, null, 2, "Optics", "اپتیک", "/images/landingPage/luca-onex-loupe.png", true, false, "The Luca story", "داستان لوکا", "story", true, "Clarity, centre to edge", "وضوح، از مرکز تا لبه", null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_LandingFeatures_IsActive_DisplayOrder",
                table: "LandingFeatures",
                columns: new[] { "IsActive", "DisplayOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LandingFeatures");

            migrationBuilder.DeleteData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "AboutSections");

            migrationBuilder.Sql("""
                UPDATE "EntityConfigs"
                SET "FormFieldsJson" = (
                    SELECT COALESCE(jsonb_agg(field), '[]'::jsonb)::text
                    FROM jsonb_array_elements("FormFieldsJson"::jsonb) field
                    WHERE field <> '{"Name":"imageUrl","Caption":"Section image","Type":"file"}'::jsonb
                      AND field <> '{"Name":"removeImage","Caption":"Remove image","Type":"checkbox"}'::jsonb
                )
                WHERE "Id" = 35 AND "FormFieldsJson" IS NOT NULL;
                """);

        }
    }
}
