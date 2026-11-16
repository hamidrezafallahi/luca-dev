using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class HeroLinksHomeSlidesAboutFonts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BodyTextSize",
                table: "ThemeSettings",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "medium");

            migrationBuilder.AddColumn<int>(
                name: "BodyTextSizePx",
                table: "ThemeSettings",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeadingTextSize",
                table: "ThemeSettings",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "medium");

            migrationBuilder.AddColumn<int>(
                name: "HeadingTextSizePx",
                table: "ThemeSettings",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondUrlTextEn",
                table: "Slides",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SecondUrlTextFa",
                table: "Slides",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "AboutSections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SectionKey = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    EyebrowFa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    EyebrowEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleFa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    BodyFa = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    BodyEn = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    LinkTextFa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    LinkTextEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    LinkUrl = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
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
                    table.PrimaryKey("PK_AboutSections", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomFonts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NameFa = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    NameEn = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Category = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    FileUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
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
                    table.PrimaryKey("PK_CustomFonts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HomeSlides",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ImageUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    MobileImageUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    LinkUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    TitleFa = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_HomeSlides", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AboutSections",
                columns: new[] { "Id", "BodyEn", "BodyFa", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "DisplayOrder", "EyebrowEn", "EyebrowFa", "IsActive", "IsDeleted", "LinkTextEn", "LinkTextFa", "LinkUrl", "SectionKey", "TitleEn", "TitleFa", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, "A tool that disappears, so you can see better.", "ابزاری که دیده نمی‌شود، تا شما بهتر ببینید.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 1, "About us", "درباره ما", true, false, "", "", "", "hero", "The Luca story", "داستان لوکا", null, null },
                    { 2, "Luca makes dental loupes: a tool that has to sit on the face for hours and be forgotten. Every design decision starts there — more clarity, less weight and a healthier posture for the clinician.", "لوکا لوپ دندانپزشکی می‌سازد؛ ابزاری که باید ساعت‌ها روی صورت بماند و فراموش شود. هر تصمیم طراحی ما از همین‌جا شروع می‌شود: وضوح بیشتر، وزن کمتر و وضعیت بدنی سالم‌تر برای دندانپزشک.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 2, "", "", true, false, "", "", "", "intro", "", "", null, null },
                    { 3, "The quality of a loupe starts with its lens. Grinding, coating and alignment of each lens pair are checked before they are mounted on the frame.", "کیفیت یک لوپ از عدسی آن شروع می‌شود. تراش، پوشش و هم‌ترازی هر جفت عدسی پیش از سوار شدن روی فریم کنترل می‌شود.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 3, "01 — Optics", "۰۱ — اپتیک", true, false, "", "", "", "chapter-optics", "Glass, before anything else", "شیشه، پیش از هر چیز", null, null },
                    { 4, "Good loupes correct the way you sit. Viewing angle and weight distribution are set to take the load off the neck and shoulders.", "لوپ خوب وضعیت نشستن را اصلاح می‌کند. زاویه دید و توزیع وزن طوری تنظیم می‌شود که فشار از گردن و شانه برداشته شود.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 4, "02 — Ergonomics", "۰۲ — ارگونومی", true, false, "", "", "", "chapter-ergonomics", "Designed for a lifetime of work", "طراحی برای یک عمر کار", null, null },
                    { 5, "Your pupillary distance, viewing height and working distance are measured, and the loupes are built to match.", "فاصله مردمک‌ها، ارتفاع دید و فاصله کاری شما اندازه‌گیری می‌شود و لوپ بر همان اساس ساخته می‌شود.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 5, "03 — Custom build", "۰۳ — ساخت سفارشی", true, false, "Book a measurement", "رزرو وقت اندازه‌گیری", "cooperation", "chapter-custom", "Made for one face", "ساخته‌شده برای یک چهره", null, null },
                    { 6, "", "", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 6, "", "", true, false, "", "", "", "quote", "", "", null, null },
                    { 7, "Luca founded", "آغاز کار لوکا", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 7, "", "", true, false, "", "", "", "fact-1", "", "", null, null },
                    { 8, "Countries with official dealers", "کشور با نمایندگی رسمی", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 8, "", "", true, false, "", "", "", "fact-2", "", "", null, null },
                    { 9, "Optics warranty", "گارانتی اپتیک", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 9, "", "", true, false, "", "", "", "fact-3", "", "", null, null },
                    { 10, "", "", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 10, "", "", true, false, "Shop", "خرید", "products", "cta-shop", "Shop loupes", "مشاهده لوپ‌ها", null, null },
                    { 11, "", "", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 11, "", "", true, false, "Book a consultation", "رزرو وقت", "cooperation", "cta-contact", "Talk to a specialist", "مشاوره با کارشناس", null, null }
                });

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 4,
                column: "EntityIconBase64",
                value: "\r\n<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-6'>\r\n  <path stroke-linecap='round' stroke-linejoin='round' d='m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z' />\r\n</svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 5,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\r\n</svg>\r\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 6,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z\" />\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6 6h.008v.008H6V6Z\" /></svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 7,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z\" />\r\n</svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 9,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z\" /></svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 16,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\r\n</svg>\r\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 17,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\r\n</svg>\r\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 18,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\r\n</svg>\r\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 19,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\r\n                </svg>\r\n                ");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "ColumnsJson", "EnglishDisplayName", "EntityIconBase64", "FormFieldsJson", "PersianDisplayName" },
                values: new object[] { "[{\"Header\":\"\\u0634\\u0646\\u0627\\u0633\\u0647\",\"Accessor\":\"id\",\"Type\":\"number\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0639\\u06A9\\u0633\",\"Accessor\":\"bannerUrl\",\"Type\":\"image\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0628\\u0646\\u0631\",\"Accessor\":\"bannerTitle\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D \\u0628\\u0646\\u0631\",\"Accessor\":\"bannerDescription\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0622\\u062F\\u0631\\u0633 \\u0627\\u0648\\u0644\",\"Accessor\":\"firstUrl\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0622\\u062F\\u0631\\u0633 \\u062F\\u0648\\u0645\",\"Accessor\":\"secondUrl\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0645\\u062A\\u0646 \\u0644\\u06CC\\u0646\\u06A9 \\u062F\\u0648\\u0645\",\"Accessor\":\"secondUrlTextFa\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0646\\u0645\\u0627\\u06CC\\u0634 \\u0628\\u0646\\u0631\",\"Accessor\":\"isHero\",\"Type\":\"bool\",\"Sortable\":false,\"Filterable\":false,\"Options\":null}]", "home hero banner", "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\r\n                </svg>\r\n                ", "[{\"Name\":\"bannerUrl\",\"Caption\":\"\\u067E\\u0648\\u0633\\u062A\\u0631 / \\u0639\\u06A9\\u0633 \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E\",\"Type\":\"file\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0628\\u0646\\u0631\",\"Help\":\"\\u0639\\u06A9\\u0633 \\u0646\\u0633\\u062E\\u0647\\u200C\\u06CC \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E\\u061B \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0648\\u06CC\\u062F\\u06CC\\u0648 \\u0648 \\u062C\\u0627\\u06CC\\u06AF\\u0632\\u06CC\\u0646 \\u0622\\u0646 \\u0647\\u0645 \\u0647\\u0633\\u062A\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0639\\u06A9\\u0633 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"bannerTitle\",\"Caption\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0628\\u0646\\u0631 (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0628\\u0646\\u0631\",\"Help\":\"\\u0627\\u06AF\\u0631 \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0645\\u0627\\u0646\\u062F\\u060C \\u0639\\u0646\\u0648\\u0627\\u0646\\u06CC \\u0631\\u0648\\u06CC \\u0628\\u0646\\u0631 \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0646\\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"bannerDescription\",\"Caption\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D \\u0628\\u0646\\u0631 (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D\\u0627\\u062A \\u0628\\u0646\\u0631\",\"Help\":\"\\u0627\\u06AF\\u0631 \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0645\\u0627\\u0646\\u062F\\u060C \\u062A\\u0648\\u0636\\u06CC\\u062D\\u06CC \\u0631\\u0648\\u06CC \\u0628\\u0646\\u0631 \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0646\\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"firstUrl\",\"Caption\":\"\\u0622\\u062F\\u0631\\u0633 \\u0627\\u0648\\u0644\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0622\\u062F\\u0631\\u0633 \\u0627\\u0648\\u0644\",\"Help\":\"\\u0628\\u0627 \\u06A9\\u0644\\u06CC\\u06A9 \\u0628\\u0631 \\u0631\\u0648\\u06CC \\u0639\\u06A9\\u0633 \\u06CC\\u0627 \\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u0628\\u0646\\u0631 \\u0628\\u0647 \\u0686\\u0647 \\u0622\\u062F\\u0631\\u0633\\u06CC \\u0628\\u0631\\u0648\\u062F\\u061F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u0622\\u062F\\u0631\\u0633   \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"secondUrl\",\"Caption\":\"\\u0622\\u062F\\u0631\\u0633 \\u062F\\u0648\\u0645 (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0622\\u062F\\u0631\\u0633 \\u0635\\u0641\\u062D\\u0647 \\u062F\\u0648\\u0645\",\"Help\":\"\\u0627\\u06AF\\u0631 \\u067E\\u0631 \\u0634\\u0648\\u062F\\u060C \\u06CC\\u06A9 \\u0644\\u06CC\\u0646\\u06A9 \\u0645\\u062A\\u0646\\u06CC \\u0631\\u0648\\u06CC \\u0628\\u0646\\u0631 \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F\\u061B \\u0645\\u062A\\u0646 \\u0641\\u0627\\u0631\\u0633\\u06CC \\u0648 \\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC \\u0622\\u0646 \\u0631\\u0627 \\u067E\\u0627\\u06CC\\u06CC\\u0646\\u200C\\u062A\\u0631 \\u0648\\u0627\\u0631\\u062F \\u06A9\\u0646\\u06CC\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"secondUrlTextFa\",\"Caption\":\"\\u0645\\u062A\\u0646 \\u0644\\u06CC\\u0646\\u06A9 \\u062F\\u0648\\u0645 (\\u0641\\u0627\\u0631\\u0633\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0645\\u062B\\u0644\\u0627\\u064B: \\u0645\\u0634\\u0627\\u0647\\u062F\\u0647 \\u062A\\u062E\\u0641\\u06CC\\u0641\\u200C\\u0647\\u0627\",\"Help\":\"\\u0628\\u0627 \\u0648\\u062C\\u0648\\u062F \\u0622\\u062F\\u0631\\u0633 \\u062F\\u0648\\u0645 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\\u061B \\u062F\\u0631 \\u0646\\u0633\\u062E\\u0647\\u200C\\u06CC \\u0641\\u0627\\u0631\\u0633\\u06CC \\u0633\\u0627\\u06CC\\u062A \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"secondUrlTextEn\",\"Caption\":\"\\u0645\\u062A\\u0646 \\u0644\\u06CC\\u0646\\u06A9 \\u062F\\u0648\\u0645 (\\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":\"e.g. See the offers\",\"Help\":\"\\u0628\\u0627 \\u0648\\u062C\\u0648\\u062F \\u0622\\u062F\\u0631\\u0633 \\u062F\\u0648\\u0645 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\\u061B \\u062F\\u0631 \\u0646\\u0633\\u062E\\u0647\\u200C\\u06CC \\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC \\u0633\\u0627\\u06CC\\u062A \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"videoUrl\",\"Caption\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"video\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0648\\u06CC\\u062F\\u06CC\\u0648 (mp4 \\u06CC\\u0627 webm)\",\"Help\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u06A9\\u0648\\u062A\\u0627\\u0647 \\u0628\\u06CC\\u200C\\u0635\\u062F\\u0627\\u060C \\u062D\\u062F\\u0627\\u06A9\\u062B\\u0631 \\u06F3\\u06F0 \\u0645\\u06AF\\u0627\\u0628\\u0627\\u06CC\\u062A\\u060C \\u062A\\u0631\\u062C\\u06CC\\u062D\\u0627\\u064B \\u06F1\\u06F6:\\u06F9 \\u0648 \\u062D\\u062F\\u0648\\u062F \\u06F1\\u06F5 \\u062B\\u0627\\u0646\\u06CC\\u0647. \\u0639\\u06A9\\u0633 \\u0628\\u0646\\u0631 \\u0628\\u0647\\u200C\\u0639\\u0646\\u0648\\u0627\\u0646 \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0648 \\u062C\\u0627\\u06CC\\u06AF\\u0632\\u06CC\\u0646 \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"mobileBannerUrl\",\"Caption\":\"\\u067E\\u0648\\u0633\\u062A\\u0631 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"file\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644\",\"Help\":\"\\u0639\\u06A9\\u0633 \\u0639\\u0645\\u0648\\u062F\\u06CC \\u0645\\u062E\\u0635\\u0648\\u0635 \\u0635\\u0641\\u062D\\u0647\\u200C\\u0647\\u0627\\u06CC \\u06A9\\u0648\\u0686\\u06A9\\u061B \\u0627\\u06AF\\u0631 \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0627\\u0634\\u062F \\u0627\\u0632 \\u0639\\u06A9\\u0633 \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E \\u0627\\u0633\\u062A\\u0641\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"mobileVideoUrl\",\"Caption\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"video\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0648\\u06CC\\u062F\\u06CC\\u0648 (mp4 \\u06CC\\u0627 webm)\",\"Help\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u0633\\u0628\\u06A9 \\u0648 \\u0639\\u0645\\u0648\\u062F\\u06CC \\u0628\\u0631\\u0627\\u06CC \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644\\u060C \\u062D\\u062F\\u0627\\u06A9\\u062B\\u0631 \\u06F3\\u06F0 \\u0645\\u06AF\\u0627\\u0628\\u0627\\u06CC\\u062A\\u061B \\u0627\\u06AF\\u0631 \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0627\\u0634\\u062F \\u0627\\u0632 \\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E \\u0627\\u0633\\u062A\\u0641\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"removeMobileBanner\",\"Caption\":\"\\u062D\\u0630\\u0641 \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u0641\\u0639\\u0644\\u06CC\",\"Type\":\"checkbox\",\"PlaceHolder\":\"\",\"Help\":\"\\u062F\\u0631 \\u0648\\u06CC\\u0631\\u0627\\u06CC\\u0634: \\u0628\\u0631\\u0627\\u06CC \\u062D\\u0630\\u0641 \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u062B\\u0628\\u062A\\u200C\\u0634\\u062F\\u0647 \\u0641\\u0639\\u0627\\u0644 \\u06A9\\u0646\\u06CC\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"removeMobileVideo\",\"Caption\":\"\\u062D\\u0630\\u0641 \\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u0641\\u0639\\u0644\\u06CC\",\"Type\":\"checkbox\",\"PlaceHolder\":\"\",\"Help\":\"\\u062F\\u0631 \\u0648\\u06CC\\u0631\\u0627\\u06CC\\u0634: \\u0628\\u0631\\u0627\\u06CC \\u062D\\u0630\\u0641 \\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u062B\\u0628\\u062A\\u200C\\u0634\\u062F\\u0647 \\u0641\\u0639\\u0627\\u0644 \\u06A9\\u0646\\u06CC\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"removeVideo\",\"Caption\":\"\\u062D\\u0630\\u0641 \\u0648\\u06CC\\u062F\\u06CC\\u0648 \\u0641\\u0639\\u0644\\u06CC\",\"Type\":\"checkbox\",\"PlaceHolder\":\"\",\"Help\":\"\\u062F\\u0631 \\u0648\\u06CC\\u0631\\u0627\\u06CC\\u0634: \\u0628\\u0631\\u0627\\u06CC \\u062D\\u0630\\u0641 \\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u062B\\u0628\\u062A\\u200C\\u0634\\u062F\\u0647 \\u0641\\u0639\\u0627\\u0644 \\u06A9\\u0646\\u06CC\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]}]", "بنر هیرو صفحه اصلی" });

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 21,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\r\n                </svg>\r\n                ");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 22,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\r\n                </svg>\r\n                ");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 24,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9\" /></svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 25,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z\" /></svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 26,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\r\n</svg>\r\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 27,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\r\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9\" /></svg>");

            migrationBuilder.InsertData(
                table: "EntityConfigs",
                columns: new[] { "Id", "ActionsJson", "ColumnsJson", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "EndPoint", "EnglishDisplayName", "EntityIconBase64", "EntityName", "FormFieldsJson", "IsActive", "PersianDisplayName", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 34, "[\"active\",\"edit\",\"delete\",\"new\"]", "[{\"Header\":\"\\u0634\\u0646\\u0627\\u0633\\u0647\",\"Accessor\":\"id\",\"Type\":\"number\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0639\\u06A9\\u0633\",\"Accessor\":\"imageUrl\",\"Type\":\"image\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0639\\u0646\\u0648\\u0627\\u0646\",\"Accessor\":\"titleFa\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0644\\u06CC\\u0646\\u06A9\",\"Accessor\":\"linkUrl\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u062A\\u0631\\u062A\\u06CC\\u0628\",\"Accessor\":\"displayOrder\",\"Type\":\"number\",\"Sortable\":false,\"Filterable\":false,\"Options\":null}]", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, null, "homeSlides", "Home slider", "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z\" /></svg>", "homeSlides", "[{\"Name\":\"imageUrl\",\"Caption\":\"\\u0639\\u06A9\\u0633 \\u0627\\u0633\\u0644\\u0627\\u06CC\\u062F\",\"Type\":\"file\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0639\\u06A9\\u0633\",\"Help\":\"\\u0639\\u06A9\\u0633 \\u0627\\u0641\\u0642\\u06CC\\u060C \\u062A\\u0631\\u062C\\u06CC\\u062D\\u0627\\u064B \\u06F1\\u06F6:\\u06F7\\u061B \\u0641\\u0642\\u0637 \\u062F\\u0631 \\u0627\\u0633\\u0644\\u0627\\u06CC\\u062F\\u0631 \\u0645\\u06CC\\u0627\\u0646\\u06CC \\u0635\\u0641\\u062D\\u0647\\u200C\\u06CC \\u0627\\u0635\\u0644\\u06CC \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F (\\u0646\\u0647 \\u062F\\u0631 \\u0628\\u0646\\u0631 \\u0647\\u06CC\\u0631\\u0648).\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0639\\u06A9\\u0633 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"mobileImageUrl\",\"Caption\":\"\\u0639\\u06A9\\u0633 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"file\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0639\\u06A9\\u0633 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644\",\"Help\":\"\\u0627\\u06AF\\u0631 \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0627\\u0634\\u062F \\u0647\\u0645\\u0627\\u0646 \\u0639\\u06A9\\u0633 \\u0627\\u0635\\u0644\\u06CC \\u0627\\u0633\\u062A\\u0641\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"removeMobileImage\",\"Caption\":\"\\u062D\\u0630\\u0641 \\u0639\\u06A9\\u0633 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u0641\\u0639\\u0644\\u06CC\",\"Type\":\"checkbox\",\"PlaceHolder\":null,\"Help\":\"\\u062F\\u0631 \\u0648\\u06CC\\u0631\\u0627\\u06CC\\u0634: \\u0628\\u0631\\u0627\\u06CC \\u062D\\u0630\\u0641 \\u0639\\u06A9\\u0633 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u062B\\u0628\\u062A\\u200C\\u0634\\u062F\\u0647 \\u0641\\u0639\\u0627\\u0644 \\u06A9\\u0646\\u06CC\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"linkUrl\",\"Caption\":\"\\u0622\\u062F\\u0631\\u0633 \\u0644\\u06CC\\u0646\\u06A9 (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0645\\u062B\\u0644\\u0627\\u064B products\",\"Help\":\"\\u0628\\u0627 \\u06A9\\u0644\\u06CC\\u06A9 \\u0631\\u0648\\u06CC \\u0627\\u0633\\u0644\\u0627\\u06CC\\u062F \\u0628\\u0647 \\u0627\\u06CC\\u0646 \\u0635\\u0641\\u062D\\u0647 \\u0645\\u06CC\\u200C\\u0631\\u0648\\u062F\\u061B \\u062E\\u0627\\u0644\\u06CC = \\u0628\\u062F\\u0648\\u0646 \\u0644\\u06CC\\u0646\\u06A9.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"titleFa\",\"Caption\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0641\\u0627\\u0631\\u0633\\u06CC (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":\"\\u0645\\u062A\\u0646 \\u062C\\u0627\\u06CC\\u06AF\\u0632\\u06CC\\u0646 \\u0639\\u06A9\\u0633 \\u0628\\u0631\\u0627\\u06CC \\u0645\\u0648\\u062A\\u0648\\u0631\\u0647\\u0627\\u06CC \\u062C\\u0633\\u062A\\u062C\\u0648 \\u0648 \\u0635\\u0641\\u062D\\u0647\\u200C\\u062E\\u0648\\u0627\\u0646.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"titleEn\",\"Caption\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"displayOrder\",\"Caption\":\"\\u062A\\u0631\\u062A\\u06CC\\u0628 \\u0646\\u0645\\u0627\\u06CC\\u0634\",\"Type\":\"number\",\"PlaceHolder\":\"0\",\"Help\":\"\\u0639\\u062F\\u062F \\u06A9\\u0648\\u0686\\u06A9\\u200C\\u062A\\u0631 \\u0632\\u0648\\u062F\\u062A\\u0631 \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null}]", true, "اسلایدر صفحه اصلی", null, null },
                    { 35, "[\"active\",\"edit\"]", "[{\"Header\":\"\\u0628\\u062E\\u0634\",\"Accessor\":\"sectionKey\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0628\\u0631\\u0686\\u0633\\u0628\",\"Accessor\":\"eyebrowFa\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u062A\\u06CC\\u062A\\u0631\",\"Accessor\":\"titleFa\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0645\\u062A\\u0646\",\"Accessor\":\"bodyFa\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u062A\\u0631\\u062A\\u06CC\\u0628\",\"Accessor\":\"displayOrder\",\"Type\":\"number\",\"Sortable\":false,\"Filterable\":false,\"Options\":null}]", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, null, "aboutSections", "Our story", "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25\" /></svg>", "aboutSections", "[{\"Name\":\"eyebrowFa\",\"Caption\":\"\\u0628\\u0631\\u0686\\u0633\\u0628 \\u0628\\u0627\\u0644\\u0627\\u06CC \\u062A\\u06CC\\u062A\\u0631 (\\u0641\\u0627\\u0631\\u0633\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":\"\\u062E\\u0627\\u0644\\u06CC = \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0646\\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"eyebrowEn\",\"Caption\":\"\\u0628\\u0631\\u0686\\u0633\\u0628 \\u0628\\u0627\\u0644\\u0627\\u06CC \\u062A\\u06CC\\u062A\\u0631 (\\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"titleFa\",\"Caption\":\"\\u062A\\u06CC\\u062A\\u0631 (\\u0641\\u0627\\u0631\\u0633\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":\"\\u062F\\u0631 \\u0628\\u062E\\u0634\\u200C\\u0647\\u0627\\u06CC \\u00ABfact\\u00BB \\u0639\\u062F\\u062F \\u06CC\\u0627 \\u0645\\u0642\\u062F\\u0627\\u0631 \\u0628\\u0632\\u0631\\u06AF\\u061B \\u062F\\u0631 \\u00ABquote\\u00BB \\u0646\\u0627\\u0645 \\u06AF\\u0648\\u06CC\\u0646\\u062F\\u0647.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"titleEn\",\"Caption\":\"\\u062A\\u06CC\\u062A\\u0631 (\\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"bodyFa\",\"Caption\":\"\\u0645\\u062A\\u0646 (\\u0641\\u0627\\u0631\\u0633\\u06CC)\",\"Type\":\"textarea\",\"PlaceHolder\":null,\"Help\":\"\\u062F\\u0631 \\u0628\\u062E\\u0634 \\u00ABquote\\u00BB \\u0645\\u062A\\u0646 \\u0646\\u0642\\u0644\\u200C\\u0642\\u0648\\u0644\\u061B \\u062F\\u0631 \\u00ABfact\\u00BB \\u062A\\u0648\\u0636\\u06CC\\u062D \\u0632\\u06CC\\u0631 \\u0639\\u062F\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"bodyEn\",\"Caption\":\"\\u0645\\u062A\\u0646 (\\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC)\",\"Type\":\"textarea\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"linkTextFa\",\"Caption\":\"\\u0645\\u062A\\u0646 \\u0644\\u06CC\\u0646\\u06A9 (\\u0641\\u0627\\u0631\\u0633\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":\"\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC\\u061B \\u0641\\u0642\\u0637 \\u0628\\u062E\\u0634\\u200C\\u0647\\u0627\\u06CC\\u06CC \\u06A9\\u0647 \\u0644\\u06CC\\u0646\\u06A9 \\u062F\\u0627\\u0631\\u0646\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"linkTextEn\",\"Caption\":\"\\u0645\\u062A\\u0646 \\u0644\\u06CC\\u0646\\u06A9 (\\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC)\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"linkUrl\",\"Caption\":\"\\u0622\\u062F\\u0631\\u0633 \\u0644\\u06CC\\u0646\\u06A9\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0645\\u062B\\u0644\\u0627\\u064B cooperation\",\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"displayOrder\",\"Caption\":\"\\u062A\\u0631\\u062A\\u06CC\\u0628\",\"Type\":\"number\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null}]", true, "داستان لوکا (درباره ما)", null, null },
                    { 36, "[\"active\",\"edit\",\"delete\"]", "[{\"Header\":\"\\u0634\\u0646\\u0627\\u0633\\u0647\",\"Accessor\":\"id\",\"Type\":\"number\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0646\\u0627\\u0645 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Accessor\":\"nameFa\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0646\\u0627\\u0645 \\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC\",\"Accessor\":\"nameEn\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u062F\\u0633\\u062A\\u0647\",\"Accessor\":\"category\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u06A9\\u0644\\u06CC\\u062F\",\"Accessor\":\"key\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null}]", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, null, "customFonts", "Custom fonts", "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 19.5 8.25 4.5h1.5L15 19.5M5.1 14.25h7.8M15.75 19.5l2.625-7.5h.75L21.75 19.5m-5.25-2.25h4.5\" /></svg>", "customFonts", "[{\"Name\":\"nameFa\",\"Caption\":\"\\u0646\\u0627\\u0645 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"nameEn\",\"Caption\":\"\\u0646\\u0627\\u0645 \\u0627\\u0646\\u06AF\\u0644\\u06CC\\u0633\\u06CC\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"category\",\"Caption\":\"\\u062F\\u0633\\u062A\\u0647 (general / formal / fancy)\",\"Type\":\"text\",\"PlaceHolder\":null,\"Help\":\"general = \\u0639\\u0645\\u0648\\u0645\\u06CC\\u060C formal = \\u0631\\u0633\\u0645\\u06CC\\u060C fancy = \\u0641\\u0627\\u0646\\u062A\\u0632\\u06CC\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null}]", true, "فونت‌های آپلودی", null, null }
                });

            migrationBuilder.UpdateData(
                table: "ThemeSettings",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BodyTextSize", "BodyTextSizePx", "HeadingTextSize", "HeadingTextSizePx" },
                values: new object[] { "medium", null, "medium", null });

            migrationBuilder.CreateIndex(
                name: "IX_AboutSections_SectionKey",
                table: "AboutSections",
                column: "SectionKey",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_HomeSlides_IsActive_DisplayOrder",
                table: "HomeSlides",
                columns: new[] { "IsActive", "DisplayOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AboutSections");

            migrationBuilder.DropTable(
                name: "CustomFonts");

            migrationBuilder.DropTable(
                name: "HomeSlides");

            migrationBuilder.DeleteData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DropColumn(
                name: "BodyTextSize",
                table: "ThemeSettings");

            migrationBuilder.DropColumn(
                name: "BodyTextSizePx",
                table: "ThemeSettings");

            migrationBuilder.DropColumn(
                name: "HeadingTextSize",
                table: "ThemeSettings");

            migrationBuilder.DropColumn(
                name: "HeadingTextSizePx",
                table: "ThemeSettings");

            migrationBuilder.DropColumn(
                name: "SecondUrlTextEn",
                table: "Slides");

            migrationBuilder.DropColumn(
                name: "SecondUrlTextFa",
                table: "Slides");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 4,
                column: "EntityIconBase64",
                value: "\n<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-6'>\n  <path stroke-linecap='round' stroke-linejoin='round' d='m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z' />\n</svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 5,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\n</svg>\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 6,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z\" />\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6 6h.008v.008H6V6Z\" /></svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 7,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z\" />\n</svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 9,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z\" /></svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 16,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\n</svg>\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 17,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\n</svg>\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 18,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\n</svg>\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 19,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\n                </svg>\n                ");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "ColumnsJson", "EnglishDisplayName", "EntityIconBase64", "FormFieldsJson", "PersianDisplayName" },
                values: new object[] { "[{\"Header\":\"\\u0634\\u0646\\u0627\\u0633\\u0647\",\"Accessor\":\"id\",\"Type\":\"number\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0639\\u06A9\\u0633\",\"Accessor\":\"banner\",\"Type\":\"image\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0628\\u0646\\u0631\",\"Accessor\":\"bannerTitle\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D \\u0628\\u0646\\u0631\",\"Accessor\":\"bannerDescription\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0622\\u062F\\u0631\\u0633 \\u0627\\u0648\\u0644\",\"Accessor\":\"firstUrl\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0622\\u062F\\u0631\\u0633 \\u062F\\u0648\\u0645\",\"Accessor\":\"secondUrl\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648 \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E\",\"Accessor\":\"videoUrl\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644\",\"Accessor\":\"mobileVideoUrl\",\"Type\":\"text\",\"Sortable\":false,\"Filterable\":false,\"Options\":null},{\"Header\":\"\\u0646\\u0645\\u0627\\u06CC\\u0634 \\u0628\\u0646\\u0631\",\"Accessor\":\"isHero\",\"Type\":\"bool\",\"Sortable\":false,\"Filterable\":false,\"Options\":null}]", "landing slide", "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\n                </svg>\n                ", "[{\"Name\":\"bannerUrl\",\"Caption\":\"\\u067E\\u0648\\u0633\\u062A\\u0631 / \\u0639\\u06A9\\u0633 \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E\",\"Type\":\"file\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0628\\u0646\\u0631\",\"Help\":\"\\u0639\\u06A9\\u0633 \\u0646\\u0633\\u062E\\u0647\\u200C\\u06CC \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E\\u061B \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0648\\u06CC\\u062F\\u06CC\\u0648 \\u0648 \\u062C\\u0627\\u06CC\\u06AF\\u0632\\u06CC\\u0646 \\u0622\\u0646 \\u0647\\u0645 \\u0647\\u0633\\u062A\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0639\\u06A9\\u0633 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"bannerTitle\",\"Caption\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0628\\u0646\\u0631\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0628\\u0646\\u0631\",\"Help\":\"\\u062F\\u0631 \\u0628\\u0646\\u0631 \\u0686\\u0647 \\u0639\\u0646\\u0648\\u0627\\u0646\\u06CC \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0634\\u0648\\u062F \\u061F \\u061F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0628\\u0646\\u0631 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"bannerDescription\",\"Caption\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D \\u0628\\u0646\\u0631\",\"Type\":\"text\",\"PlaceHolder\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D\\u0627\\u062A \\u0628\\u0646\\u0631\",\"Help\":\"\\u062F\\u0631 \\u0628\\u0646\\u0631 \\u0686\\u0647 \\u062A\\u0648\\u0636\\u06CC\\u062D\\u0627\\u062A\\u06CC \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0634\\u0648\\u062F \\u061F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D\\u0627\\u062A \\u0628\\u0646\\u0631 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"firstUrl\",\"Caption\":\"\\u0622\\u062F\\u0631\\u0633 \\u0627\\u0648\\u0644\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0622\\u062F\\u0631\\u0633 \\u0627\\u0648\\u0644\",\"Help\":\"\\u0628\\u0627 \\u06A9\\u0644\\u06CC\\u06A9 \\u0628\\u0631 \\u0631\\u0648\\u06CC \\u0639\\u06A9\\u0633 \\u0628\\u0647 \\u0686\\u0647 \\u0622\\u062F\\u0631\\u0633\\u06CC \\u0628\\u0631\\u0648\\u062F \\u061F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u0622\\u062F\\u0631\\u0633   \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"secondUrl\",\"Caption\":\"\\u0622\\u062F\\u0631\\u0633 \\u062F\\u0648\\u0645\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0622\\u062F\\u0631\\u0633 \\u0635\\u0641\\u062D\\u0647 \\u062F\\u0648\\u0645\",\"Help\":\"\\u0628\\u0627 \\u06A9\\u0644\\u06CC\\u06A9 \\u0628\\u0631 \\u0631\\u0648\\u06CC \\u062F\\u06A9\\u0645\\u0647 \\u062F\\u0648\\u0645 \\u0628\\u0647 \\u0686\\u0647 \\u0622\\u062F\\u0631\\u0633\\u06CC \\u0628\\u0631\\u0648\\u062F \\u061F (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"videoUrl\",\"Caption\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"video\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0648\\u06CC\\u062F\\u06CC\\u0648 (mp4 \\u06CC\\u0627 webm)\",\"Help\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u06A9\\u0648\\u062A\\u0627\\u0647 \\u0628\\u06CC\\u200C\\u0635\\u062F\\u0627\\u060C \\u062D\\u062F\\u0627\\u06A9\\u062B\\u0631 \\u06F3\\u06F0 \\u0645\\u06AF\\u0627\\u0628\\u0627\\u06CC\\u062A\\u060C \\u062A\\u0631\\u062C\\u06CC\\u062D\\u0627\\u064B \\u06F1\\u06F6:\\u06F9 \\u0648 \\u062D\\u062F\\u0648\\u062F \\u06F1\\u06F5 \\u062B\\u0627\\u0646\\u06CC\\u0647. \\u0639\\u06A9\\u0633 \\u0628\\u0646\\u0631 \\u0628\\u0647\\u200C\\u0639\\u0646\\u0648\\u0627\\u0646 \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0648 \\u062C\\u0627\\u06CC\\u06AF\\u0632\\u06CC\\u0646 \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"mobileBannerUrl\",\"Caption\":\"\\u067E\\u0648\\u0633\\u062A\\u0631 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"file\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644\",\"Help\":\"\\u0639\\u06A9\\u0633 \\u0639\\u0645\\u0648\\u062F\\u06CC \\u0645\\u062E\\u0635\\u0648\\u0635 \\u0635\\u0641\\u062D\\u0647\\u200C\\u0647\\u0627\\u06CC \\u06A9\\u0648\\u0686\\u06A9\\u061B \\u0627\\u06AF\\u0631 \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0627\\u0634\\u062F \\u0627\\u0632 \\u0639\\u06A9\\u0633 \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E \\u0627\\u0633\\u062A\\u0641\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"mobileVideoUrl\",\"Caption\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 (\\u0627\\u062E\\u062A\\u06CC\\u0627\\u0631\\u06CC)\",\"Type\":\"video\",\"PlaceHolder\":\"\\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u0648\\u06CC\\u062F\\u06CC\\u0648 (mp4 \\u06CC\\u0627 webm)\",\"Help\":\"\\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u0633\\u0628\\u06A9 \\u0648 \\u0639\\u0645\\u0648\\u062F\\u06CC \\u0628\\u0631\\u0627\\u06CC \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644\\u060C \\u062D\\u062F\\u0627\\u06A9\\u062B\\u0631 \\u06F3\\u06F0 \\u0645\\u06AF\\u0627\\u0628\\u0627\\u06CC\\u062A\\u061B \\u0627\\u06AF\\u0631 \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0627\\u0634\\u062F \\u0627\\u0632 \\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u062F\\u0633\\u06A9\\u062A\\u0627\\u067E \\u0627\\u0633\\u062A\\u0641\\u0627\\u062F\\u0647 \\u0645\\u06CC\\u200C\\u0634\\u0648\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"removeMobileBanner\",\"Caption\":\"\\u062D\\u0630\\u0641 \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u0641\\u0639\\u0644\\u06CC\",\"Type\":\"checkbox\",\"PlaceHolder\":\"\",\"Help\":\"\\u062F\\u0631 \\u0648\\u06CC\\u0631\\u0627\\u06CC\\u0634: \\u0628\\u0631\\u0627\\u06CC \\u062D\\u0630\\u0641 \\u067E\\u0648\\u0633\\u062A\\u0631 \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u062B\\u0628\\u062A\\u200C\\u0634\\u062F\\u0647 \\u0641\\u0639\\u0627\\u0644 \\u06A9\\u0646\\u06CC\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"removeMobileVideo\",\"Caption\":\"\\u062D\\u0630\\u0641 \\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u0641\\u0639\\u0644\\u06CC\",\"Type\":\"checkbox\",\"PlaceHolder\":\"\",\"Help\":\"\\u062F\\u0631 \\u0648\\u06CC\\u0631\\u0627\\u06CC\\u0634: \\u0628\\u0631\\u0627\\u06CC \\u062D\\u0630\\u0641 \\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u0645\\u0648\\u0628\\u0627\\u06CC\\u0644 \\u062B\\u0628\\u062A\\u200C\\u0634\\u062F\\u0647 \\u0641\\u0639\\u0627\\u0644 \\u06A9\\u0646\\u06CC\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"removeVideo\",\"Caption\":\"\\u062D\\u0630\\u0641 \\u0648\\u06CC\\u062F\\u06CC\\u0648 \\u0641\\u0639\\u0644\\u06CC\",\"Type\":\"checkbox\",\"PlaceHolder\":\"\",\"Help\":\"\\u062F\\u0631 \\u0648\\u06CC\\u0631\\u0627\\u06CC\\u0634: \\u0628\\u0631\\u0627\\u06CC \\u062D\\u0630\\u0641 \\u0648\\u06CC\\u062F\\u06CC\\u0648\\u06CC \\u062B\\u0628\\u062A\\u200C\\u0634\\u062F\\u0647 \\u0641\\u0639\\u0627\\u0644 \\u06A9\\u0646\\u06CC\\u062F.\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]}]", "اسلاید صفحه اصلی" });

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 21,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\n                </svg>\n                ");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 22,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\n                </svg>\n                ");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 24,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9\" /></svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 25,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z\" /></svg>");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 26,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z\" />\n</svg>\n");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 27,
                column: "EntityIconBase64",
                value: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9\" /></svg>");
        }
    }
}
