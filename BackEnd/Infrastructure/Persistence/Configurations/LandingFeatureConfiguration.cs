using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnlineShop.Domain.Entities;

namespace OnlineShop.Infrastructure.Persistence.Configurations;

public class LandingFeatureConfiguration : IEntityTypeConfiguration<LandingFeature>
{
    public void Configure(EntityTypeBuilder<LandingFeature> b)
    {
        b.ToTable("LandingFeatures");
        b.HasKey(x => x.Id);
        foreach (var name in new[] { nameof(LandingFeature.EyebrowFa), nameof(LandingFeature.EyebrowEn),
            nameof(LandingFeature.TitleFa), nameof(LandingFeature.TitleEn), nameof(LandingFeature.LinkTextFa), nameof(LandingFeature.LinkTextEn) })
            b.Property<string>(name).IsRequired().HasMaxLength(200);
        b.Property(x => x.BodyFa).IsRequired().HasMaxLength(4000);
        b.Property(x => x.BodyEn).IsRequired().HasMaxLength(4000);
        b.Property(x => x.LinkUrl).IsRequired().HasMaxLength(300);
        b.Property(x => x.ImageUrl).IsRequired().HasMaxLength(300);
        b.HasIndex(x => new { x.IsActive, x.DisplayOrder });
        b.HasData(
            Seed(1, "ارگونومی", "Ergonomics", "گردن صاف، نگاه مستقیم", "A straight neck, a direct view", "زاویه شیب لوپ‌های لوکا برای هر دندانپزشک جداگانه تنظیم می‌شود تا در طول روز کاری، سر و گردن در وضعیت طبیعی بماند.", "The declination angle of Luca loupes is set for each clinician, so head and neck stay in a natural position through the working day.", "آشنایی با لوپ‌های ارگونومیک", "Explore ergonomic loupes", "products", "/images/landingPage/Black%20Eyeglasses%20with%20LUCA%20Magnifying%20Loupe.png", 1, false),
            Seed(2, "اپتیک", "Optics", "وضوح، از مرکز تا لبه", "Clarity, centre to edge", "عدسی‌های چندلایه تصویری روشن و بدون اعوجاج در تمام میدان دید می‌دهند؛ رنگ بافت همان‌طور که هست دیده می‌شود.", "Multi-coated lenses give a bright, distortion-free image across the whole field of view; tissue colour appears as it is.", "داستان لوکا", "The Luca story", "story", "/images/landingPage/luca-onex-loupe.png", 2, true)
        );
    }

    private static object Seed(int id, string eyebrowFa, string eyebrowEn, string titleFa, string titleEn,
        string bodyFa, string bodyEn, string linkTextFa, string linkTextEn, string linkUrl, string imageUrl,
        int displayOrder, bool reverse) => new
    {
        Id = id, EyebrowFa = eyebrowFa, EyebrowEn = eyebrowEn, TitleFa = titleFa, TitleEn = titleEn,
        BodyFa = bodyFa, BodyEn = bodyEn, LinkTextFa = linkTextFa, LinkTextEn = linkTextEn,
        LinkUrl = linkUrl, ImageUrl = imageUrl, DisplayOrder = displayOrder, Reverse = reverse,
        IsActive = true, IsDeleted = false, CreatedAt = new DateTime(2026, 1, 1), CreatedBy = 1,
    };
}
