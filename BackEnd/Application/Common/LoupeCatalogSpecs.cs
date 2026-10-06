namespace Application.Common;

/// <summary>
/// Dental loupe catalog keys stored as ProductSpecification.
/// </summary>
public static class LoupeCatalogSpecs
{
    public const string MagnificationKey = "بزرگ‌نمایی";
    public const string WorkingDistanceKey = "فاصله کاری";
    public const string FieldOfViewKey = "میدان دید";

    public static string FormatMagnification(decimal value) =>
        $"{Trim(value)} برابر";

    public static string FormatCm(decimal value) =>
        $"{Trim(value)} سانتی‌متر";

    public static string FormatMm(decimal value) =>
        $"{Trim(value)} میلی‌متر";

    private static string Trim(decimal value) =>
        value.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture);
}
