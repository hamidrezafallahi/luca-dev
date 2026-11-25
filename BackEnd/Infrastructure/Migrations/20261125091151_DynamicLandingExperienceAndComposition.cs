using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DynamicLandingExperienceAndComposition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LandingExperiences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SiteKey = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    TitleFa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
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
                    table.PrimaryKey("PK_LandingExperiences", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LandingPageComponents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ComponentKey = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
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
                    table.PrimaryKey("PK_LandingPageComponents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LandingExperienceCards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LandingExperienceId = table.Column<int>(type: "integer", nullable: false),
                    CardKey = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    TitleFa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    BodyFa = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    BodyEn = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    CtaTextFa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CtaTextEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CtaLink = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    MobileImageUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    ImageAltFa = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    ImageAltEn = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
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
                    table.PrimaryKey("PK_LandingExperienceCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LandingExperienceCards_LandingExperiences_LandingExperience~",
                        column: x => x.LandingExperienceId,
                        principalTable: "LandingExperiences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "LandingExperiences",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "IsActive", "IsDeleted", "SiteKey", "TitleEn", "TitleFa", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, true, false, "home", "The Luca experience", "تجربه لوکا", null, null });

            migrationBuilder.InsertData(
                table: "LandingPageComponents",
                columns: new[] { "Id", "ComponentKey", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "DisplayOrder", "IsActive", "IsDeleted", "IsEnabled", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, "hero", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 0, true, false, true, null, null },
                    { 2, "products", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 1, true, false, true, null, null },
                    { 3, "homeSlider", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 2, true, false, true, null, null },
                    { 4, "categories", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 3, true, false, true, null, null },
                    { 5, "features", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 4, true, false, true, null, null },
                    { 6, "specialOffers", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 5, true, false, true, null, null },
                    { 7, "experience", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 6, true, false, true, null, null },
                    { 8, "usp", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 7, true, false, true, null, null },
                    { 9, "trust", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 8, true, false, true, null, null },
                    { 10, "blog", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 9, true, false, true, null, null },
                    { 11, "testimonials", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 10, true, false, true, null, null },
                    { 12, "faq", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 11, true, false, true, null, null },
                    { 13, "contactBand", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null, 12, true, false, true, null, null }
                });

            migrationBuilder.InsertData(
                table: "LandingExperienceCards",
                columns: new[] { "Id", "BodyEn", "BodyFa", "CardKey", "CreatedAt", "CreatedBy", "CtaLink", "CtaTextEn", "CtaTextFa", "DeletedAt", "DeletedBy", "ImageAltEn", "ImageAltFa", "ImageUrl", "IsActive", "IsDeleted", "LandingExperienceId", "MobileImageUrl", "TitleEn", "TitleFa", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, "In person or online, a Luca specialist recommends the magnification, working distance and frame that suit you.", "حضوری یا آنلاین، متخصص لوکا بزرگنمایی، فاصله کاری و فریم مناسب شما را پیشنهاد می‌کند.", "appointment", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "/cooperation", "Send a request", "ارسال درخواست", null, null, "", "", "", true, false, 1, "", "Book a consultation", "رزرو مشاوره", null, null },
                    { 2, "Your pupillary distance and viewing angle are measured so the loupes are built exactly for your face.", "فاصله مردمک‌ها و زاویه دید شما اندازه‌گیری می‌شود تا لوپ دقیقاً برای چهره شما ساخته شود.", "fitting", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "/faq", "FAQ on measuring and building your loupes", "پرسش‌های رایج درباره اندازه‌گیری و ساخت لوپ", null, null, "", "", "", true, false, 1, "", "Measurement and custom build", "اندازه‌گیری و ساخت سفارشی", null, null },
                    { 3, "Get in touch for buying advice, order tracking or after-sales service.", "برای مشاوره خرید، پیگیری سفارش یا خدمات پس از فروش با ما در تماس باشید.", "contact", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "/cooperation", "Ways to contact and work with Luca", "راه‌های تماس و همکاری با لوکا", null, null, "", "", "", true, false, 1, "", "Contact us", "تماس با ما", null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_LandingExperienceCards_LandingExperienceId_CardKey",
                table: "LandingExperienceCards",
                columns: new[] { "LandingExperienceId", "CardKey" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_LandingExperiences_SiteKey",
                table: "LandingExperiences",
                column: "SiteKey",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_LandingPageComponents_ComponentKey",
                table: "LandingPageComponents",
                column: "ComponentKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LandingPageComponents_DisplayOrder",
                table: "LandingPageComponents",
                column: "DisplayOrder");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LandingExperienceCards");

            migrationBuilder.DropTable(
                name: "LandingPageComponents");

            migrationBuilder.DropTable(
                name: "LandingExperiences");
        }
    }
}
