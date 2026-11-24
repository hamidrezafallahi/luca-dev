using OnlineShop.Domain.Common;

namespace OnlineShop.Domain.Entities;

public class LandingFeature : BaseEntity
{
    private LandingFeature() { }
    public string EyebrowFa { get; private set; } = "";
    public string EyebrowEn { get; private set; } = "";
    public string TitleFa { get; private set; } = "";
    public string TitleEn { get; private set; } = "";
    public string BodyFa { get; private set; } = "";
    public string BodyEn { get; private set; } = "";
    public string LinkTextFa { get; private set; } = "";
    public string LinkTextEn { get; private set; } = "";
    public string LinkUrl { get; private set; } = "";
    public string ImageUrl { get; private set; } = "";
    public int DisplayOrder { get; private set; }
    public bool Reverse { get; private set; }

    public static LandingFeature Create(LandingFeatureText text, int userId)
    {
        var feature = new LandingFeature();
        feature.Apply(text);
        feature.MarkCreated(userId);
        return feature;
    }

    public void Update(LandingFeatureText text, int userId)
    {
        Apply(text);
        MarkUpdated(userId);
    }

    public void SetImage(string imageUrl, int userId)
    {
        ImageUrl = Limit(imageUrl, 300);
        MarkUpdated(userId);
    }

    private void Apply(LandingFeatureText t)
    {
        EyebrowFa = Limit(t.EyebrowFa ?? EyebrowFa, 200);
        EyebrowEn = Limit(t.EyebrowEn ?? EyebrowEn, 200);
        TitleFa = Limit(t.TitleFa ?? TitleFa, 200);
        TitleEn = Limit(t.TitleEn ?? TitleEn, 200);
        BodyFa = Limit(t.BodyFa ?? BodyFa, 4000);
        BodyEn = Limit(t.BodyEn ?? BodyEn, 4000);
        LinkTextFa = Limit(t.LinkTextFa ?? LinkTextFa, 200);
        LinkTextEn = Limit(t.LinkTextEn ?? LinkTextEn, 200);
        LinkUrl = Limit(t.LinkUrl ?? LinkUrl, 300);
        DisplayOrder = t.DisplayOrder ?? DisplayOrder;
        Reverse = t.Reverse ?? Reverse;
    }

    private static string Limit(string? value, int max)
    {
        var cleaned = value?.Trim() ?? "";
        if (cleaned.Length > max) throw new DomainException($"Maximum length is {max} characters.");
        return cleaned;
    }
}

public sealed record LandingFeatureText(string? EyebrowFa, string? EyebrowEn,
    string? TitleFa, string? TitleEn, string? BodyFa, string? BodyEn,
    string? LinkTextFa, string? LinkTextEn, string? LinkUrl, int? DisplayOrder, bool? Reverse);
