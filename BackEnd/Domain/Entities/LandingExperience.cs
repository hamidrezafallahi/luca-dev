using OnlineShop.Domain.Common;

namespace OnlineShop.Domain.Entities;

public sealed class LandingExperience : BaseEntity
{
    private LandingExperience() { }
    public string SiteKey { get; private set; } = "home";
    public string TitleFa { get; private set; } = "";
    public string TitleEn { get; private set; } = "";
    public ICollection<LandingExperienceCard> Cards { get; private set; } = new List<LandingExperienceCard>();

    public static LandingExperience Create(string titleFa, string titleEn, int userId)
    {
        var section = new LandingExperience();
        section.Update(titleFa, titleEn, userId);
        section.MarkCreated(userId);
        return section;
    }

    public void Update(string? titleFa, string? titleEn, int userId)
    {
        TitleFa = Clean(titleFa ?? TitleFa, 200);
        TitleEn = Clean(titleEn ?? TitleEn, 200);
        MarkUpdated(userId);
    }

    internal static string Clean(string? value, int max)
    {
        var cleaned = value?.Trim() ?? "";
        if (cleaned.Length > max) throw new DomainException($"Maximum length is {max} characters.");
        return cleaned;
    }
}

public sealed record LandingExperienceCardText(string? TitleFa, string? TitleEn,
    string? BodyFa, string? BodyEn, string? CtaTextFa, string? CtaTextEn,
    string? CtaLink, string? ImageAltFa, string? ImageAltEn);

public sealed class LandingExperienceCard : BaseEntity
{
    private LandingExperienceCard() { }
    public int LandingExperienceId { get; private set; }
    public string CardKey { get; private set; } = "";
    public string TitleFa { get; private set; } = "";
    public string TitleEn { get; private set; } = "";
    public string BodyFa { get; private set; } = "";
    public string BodyEn { get; private set; } = "";
    public string CtaTextFa { get; private set; } = "";
    public string CtaTextEn { get; private set; } = "";
    public string CtaLink { get; private set; } = "";
    public string ImageUrl { get; private set; } = "";
    public string MobileImageUrl { get; private set; } = "";
    public string ImageAltFa { get; private set; } = "";
    public string ImageAltEn { get; private set; } = "";

    public static readonly string[] Keys = ["appointment", "fitting", "contact"];

    public static LandingExperienceCard Create(string key, LandingExperienceCardText text, int userId)
    {
        if (!Keys.Contains(key, StringComparer.Ordinal)) throw new DomainException("Unsupported experience card.");
        var card = new LandingExperienceCard { CardKey = key };
        card.Update(text, userId);
        card.MarkCreated(userId);
        return card;
    }

    public void Update(LandingExperienceCardText t, int userId)
    {
        TitleFa = LandingExperience.Clean(t.TitleFa ?? TitleFa, 200);
        TitleEn = LandingExperience.Clean(t.TitleEn ?? TitleEn, 200);
        BodyFa = LandingExperience.Clean(t.BodyFa ?? BodyFa, 4000);
        BodyEn = LandingExperience.Clean(t.BodyEn ?? BodyEn, 4000);
        CtaTextFa = LandingExperience.Clean(t.CtaTextFa ?? CtaTextFa, 200);
        CtaTextEn = LandingExperience.Clean(t.CtaTextEn ?? CtaTextEn, 200);
        CtaLink = ValidateLink(t.CtaLink ?? CtaLink);
        ImageAltFa = LandingExperience.Clean(t.ImageAltFa ?? ImageAltFa, 300);
        ImageAltEn = LandingExperience.Clean(t.ImageAltEn ?? ImageAltEn, 300);
        MarkUpdated(userId);
    }

    public void SetImage(string path, bool mobile, int userId)
    {
        path = LandingExperience.Clean(path, 300);
        if (mobile) MobileImageUrl = path;
        else ImageUrl = path;
        MarkUpdated(userId);
    }

    private static string ValidateLink(string value)
    {
        value = LandingExperience.Clean(value, 500);
        if (value.Length == 0) return value;
        if (value.StartsWith('/') && !value.StartsWith("//") && !value.Contains('\\') && !value.Any(char.IsControl)) return value;
        if (Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme == Uri.UriSchemeHttps && !string.IsNullOrEmpty(uri.Host)) return value;
        throw new DomainException("CTA link must be a local path or HTTPS URL.");
    }
}
