using OnlineShop.Domain.Common;

namespace OnlineShop.Domain.Entities;

public sealed class LandingPageComponent : BaseEntity
{
    private LandingPageComponent() { }
    public string ComponentKey { get; private set; } = "";
    public int DisplayOrder { get; private set; }
    public bool IsEnabled { get; private set; } = true;

    public static readonly string[] Keys = ["hero", "products", "homeSlider", "categories", "features",
        "specialOffers", "experience", "usp", "trust", "blog", "testimonials", "faq", "contactBand"];

    public static LandingPageComponent Create(string key, int order, int userId)
    {
        if (!Keys.Contains(key, StringComparer.Ordinal)) throw new DomainException("Unsupported landing component.");
        var component = new LandingPageComponent { ComponentKey = key, DisplayOrder = order };
        component.MarkCreated(userId);
        return component;
    }

    public void Reorder(int order, int userId)
    {
        if (order < 0) throw new DomainException("Invalid display order.");
        DisplayOrder = order;
        MarkUpdated(userId);
    }

    public void SetEnabled(bool enabled, int userId)
    {
        if (ComponentKey == "hero" && !enabled) throw new DomainException("The hero is required.");
        IsEnabled = enabled;
        MarkUpdated(userId);
    }
}
