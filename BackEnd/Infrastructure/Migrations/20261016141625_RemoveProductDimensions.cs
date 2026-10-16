using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <summary>
    /// Drops the Width/Height/Depth/Weight columns from Products and removes those inputs
    /// from the admin product form. Physical attributes, when relevant, now live in
    /// ProductSpecifications like every other product attribute.
    /// </summary>
    public partial class RemoveProductDimensions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dimensions_Depth",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Dimensions_Height",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Dimensions_Weight",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Dimensions_Width",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 5,
                column: "FormFieldsJson",
                value: "[{\"Name\":\"name\",\"Caption\":\"\\u0646\\u0627\\u0645 \\u0645\\u062D\\u0635\\u0648\\u0644\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0646\\u0627\\u0645 \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0648\\u0627\\u0631\\u062F \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u062B\\u0644\\u0627\\u064B: \\u062A\\u0644\\u0648\\u06CC\\u0632\\u06CC\\u0648\\u0646 \\u0633\\u0627\\u0645\\u0633\\u0648\\u0646\\u06AF 55 \\u0627\\u06CC\\u0646\\u0686\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u0646\\u0627\\u0645 \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"slug\",\"Caption\":\"Slug\",\"Type\":\"text\",\"PlaceHolder\":\"product-slug\",\"Help\":\"\\u0622\\u062F\\u0631\\u0633 \\u06CC\\u06A9\\u062A\\u0627\\u06CC \\u0645\\u062D\\u0635\\u0648\\u0644 \\u062F\\u0631 URL\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"seoTitleFa\",\"Caption\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0633\\u0626\\u0648 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0631 \\u06AF\\u0648\\u06AF\\u0644\",\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"seoTitleEn\",\"Caption\":\"SEO Title EN\",\"Type\":\"text\",\"PlaceHolder\":\"Google title\",\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"metaDescriptionFa\",\"Caption\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D \\u0645\\u062A\\u0627 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Type\":\"textarea\",\"PlaceHolder\":\"\\u062D\\u062F\\u0627\\u06A9\\u062B\\u0631 \\u06F1\\u06F6\\u06F0 \\u06A9\\u0627\\u0631\\u0627\\u06A9\\u062A\\u0631\",\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"metaDescriptionEn\",\"Caption\":\"Meta Description EN\",\"Type\":\"textarea\",\"PlaceHolder\":\"Max 160 chars\",\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"description\",\"Caption\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D\\u0627\\u062A\",\"Type\":\"textarea\",\"PlaceHolder\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D\\u0627\\u062A \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0648\\u0627\\u0631\\u062F \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u06CC\\u200C\\u062A\\u0648\\u0627\\u0646\\u06CC\\u062F \\u0648\\u06CC\\u0698\\u06AF\\u06CC\\u200C\\u0647\\u0627 \\u0648 \\u0645\\u0634\\u062E\\u0635\\u0627\\u062A \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0628\\u0646\\u0648\\u06CC\\u0633\\u06CC\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"categoryId\",\"Caption\":\"\\u062F\\u0633\\u062A\\u0647\\u200C\\u0628\\u0646\\u062F\\u06CC\",\"Type\":\"dynamicSelect\",\"PlaceHolder\":\"\\u062F\\u0633\\u062A\\u0647\\u200C\\u0628\\u0646\\u062F\\u06CC \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u062D\\u0635\\u0648\\u0644 \\u0628\\u0647 \\u06A9\\u062F\\u0627\\u0645 \\u062F\\u0633\\u062A\\u0647 \\u062A\\u0639\\u0644\\u0642 \\u062F\\u0627\\u0631\\u062F\",\"Order\":0,\"FetchConfig\":{\"api\":\"Categories/selectOption\",\"fetchFilters\":[]},\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u062F\\u0633\\u062A\\u0647\\u200C\\u0628\\u0646\\u062F\\u06CC \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"brandId\",\"Caption\":\"\\u0628\\u0631\\u0646\\u062F\",\"Type\":\"dynamicSelect\",\"PlaceHolder\":\"\\u0628\\u0631\\u0646\\u062F \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u062D\\u0635\\u0648\\u0644 \\u0628\\u0647 \\u06A9\\u062F\\u0627\\u0645 \\u0628\\u0631\\u0646\\u062F \\u062A\\u0639\\u0644\\u0642 \\u062F\\u0627\\u0631\\u062F\",\"Order\":0,\"FetchConfig\":{\"api\":\"Brands/selectOption\",\"fetchFilters\":[]},\"Options\":null,\"Rules\":[]}]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Dimensions_Depth",
                table: "Products",
                type: "numeric(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Dimensions_Height",
                table: "Products",
                type: "numeric(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Dimensions_Weight",
                table: "Products",
                type: "numeric(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Dimensions_Width",
                table: "Products",
                type: "numeric(10,2)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "EntityConfigs",
                keyColumn: "Id",
                keyValue: 5,
                column: "FormFieldsJson",
                value: "[{\"Name\":\"name\",\"Caption\":\"\\u0646\\u0627\\u0645 \\u0645\\u062D\\u0635\\u0648\\u0644\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0646\\u0627\\u0645 \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0648\\u0627\\u0631\\u062F \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u062B\\u0644\\u0627\\u064B: \\u062A\\u0644\\u0648\\u06CC\\u0632\\u06CC\\u0648\\u0646 \\u0633\\u0627\\u0645\\u0633\\u0648\\u0646\\u06AF 55 \\u0627\\u06CC\\u0646\\u0686\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u0646\\u0627\\u0645 \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"slug\",\"Caption\":\"Slug\",\"Type\":\"text\",\"PlaceHolder\":\"product-slug\",\"Help\":\"\\u0622\\u062F\\u0631\\u0633 \\u06CC\\u06A9\\u062A\\u0627\\u06CC \\u0645\\u062D\\u0635\\u0648\\u0644 \\u062F\\u0631 URL\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"seoTitleFa\",\"Caption\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0633\\u0626\\u0648 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Type\":\"text\",\"PlaceHolder\":\"\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0646\\u0645\\u0627\\u06CC\\u0634 \\u062F\\u0631 \\u06AF\\u0648\\u06AF\\u0644\",\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"seoTitleEn\",\"Caption\":\"SEO Title EN\",\"Type\":\"text\",\"PlaceHolder\":\"Google title\",\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"metaDescriptionFa\",\"Caption\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D \\u0645\\u062A\\u0627 \\u0641\\u0627\\u0631\\u0633\\u06CC\",\"Type\":\"textarea\",\"PlaceHolder\":\"\\u062D\\u062F\\u0627\\u06A9\\u062B\\u0631 \\u06F1\\u06F6\\u06F0 \\u06A9\\u0627\\u0631\\u0627\\u06A9\\u062A\\u0631\",\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"metaDescriptionEn\",\"Caption\":\"Meta Description EN\",\"Type\":\"textarea\",\"PlaceHolder\":\"Max 160 chars\",\"Help\":null,\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":null},{\"Name\":\"description\",\"Caption\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D\\u0627\\u062A\",\"Type\":\"textarea\",\"PlaceHolder\":\"\\u062A\\u0648\\u0636\\u06CC\\u062D\\u0627\\u062A \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0648\\u0627\\u0631\\u062F \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u06CC\\u200C\\u062A\\u0648\\u0627\\u0646\\u06CC\\u062F \\u0648\\u06CC\\u0698\\u06AF\\u06CC\\u200C\\u0647\\u0627 \\u0648 \\u0645\\u0634\\u062E\\u0635\\u0627\\u062A \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0628\\u0646\\u0648\\u06CC\\u0633\\u06CC\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"categoryId\",\"Caption\":\"\\u062F\\u0633\\u062A\\u0647\\u200C\\u0628\\u0646\\u062F\\u06CC\",\"Type\":\"dynamicSelect\",\"PlaceHolder\":\"\\u062F\\u0633\\u062A\\u0647\\u200C\\u0628\\u0646\\u062F\\u06CC \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u062D\\u0635\\u0648\\u0644 \\u0628\\u0647 \\u06A9\\u062F\\u0627\\u0645 \\u062F\\u0633\\u062A\\u0647 \\u062A\\u0639\\u0644\\u0642 \\u062F\\u0627\\u0631\\u062F\",\"Order\":0,\"FetchConfig\":{\"api\":\"Categories/selectOption\",\"fetchFilters\":[]},\"Options\":null,\"Rules\":[{\"Rule\":\"required\",\"Condition\":\"true\",\"Message\":\"\\u062F\\u0633\\u062A\\u0647\\u200C\\u0628\\u0646\\u062F\\u06CC \\u0627\\u0644\\u0632\\u0627\\u0645\\u06CC \\u0627\\u0633\\u062A\"}]},{\"Name\":\"brandId\",\"Caption\":\"\\u0628\\u0631\\u0646\\u062F\",\"Type\":\"dynamicSelect\",\"PlaceHolder\":\"\\u0628\\u0631\\u0646\\u062F \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0627\\u0646\\u062A\\u062E\\u0627\\u0628 \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u062D\\u0635\\u0648\\u0644 \\u0628\\u0647 \\u06A9\\u062F\\u0627\\u0645 \\u0628\\u0631\\u0646\\u062F \\u062A\\u0639\\u0644\\u0642 \\u062F\\u0627\\u0631\\u062F\",\"Order\":0,\"FetchConfig\":{\"api\":\"Brands/selectOption\",\"fetchFilters\":[]},\"Options\":null,\"Rules\":[]},{\"Name\":\"width\",\"Caption\":\"\\u0639\\u0631\\u0636\",\"Type\":\"number\",\"PlaceHolder\":\"\\u0639\\u0631\\u0636 \\u0645\\u062D\\u0635\\u0648\\u0644 \\u0631\\u0627 \\u0648\\u0627\\u0631\\u062F \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u06CC\\u200C\\u062A\\u0648\\u0627\\u0646\\u062F \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0627\\u0634\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"height\",\"Caption\":\"\\u0637\\u0648\\u0644 \\u06CC\\u0627 \\u0627\\u0631\\u062A\\u0641\\u0627\\u0639\",\"Type\":\"number\",\"PlaceHolder\":\"\\u0637\\u0648\\u0644 \\u06CC\\u0627 \\u0627\\u0631\\u062A\\u0641\\u0627\\u0639 \\u0631\\u0627 \\u0648\\u0627\\u0631\\u062F \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u06CC\\u200C\\u062A\\u0648\\u0627\\u0646\\u062F \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0627\\u0634\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"depth\",\"Caption\":\"\\u0639\\u0645\\u0642\",\"Type\":\"number\",\"PlaceHolder\":\"\\u0639\\u0645\\u0642 \\u0631\\u0627 \\u0648\\u0627\\u0631\\u062F \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u06CC\\u200C\\u062A\\u0648\\u0627\\u0646\\u062F \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0627\\u0634\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]},{\"Name\":\"weight\",\"Caption\":\"\\u0648\\u0632\\u0646\",\"Type\":\"number\",\"PlaceHolder\":\"\\u0648\\u0632\\u0646 \\u0631\\u0627 \\u0648\\u0627\\u0631\\u062F \\u06A9\\u0646\\u06CC\\u062F\",\"Help\":\"\\u0645\\u06CC\\u200C\\u062A\\u0648\\u0627\\u0646\\u062F \\u062E\\u0627\\u0644\\u06CC \\u0628\\u0627\\u0634\\u062F\",\"Order\":0,\"FetchConfig\":null,\"Options\":null,\"Rules\":[]}]");
        }
    }
}
