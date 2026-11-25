using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnlineShop.Domain.Entities;

namespace OnlineShop.Infrastructure.Persistence.Configurations;

public sealed class LandingExperienceConfiguration : IEntityTypeConfiguration<LandingExperience>
{
    public void Configure(EntityTypeBuilder<LandingExperience> b)
    {
        b.ToTable("LandingExperiences");
        b.HasKey(x => x.Id);
        b.Property(x => x.SiteKey).IsRequired().HasMaxLength(30);
        b.Property(x => x.TitleFa).IsRequired().HasMaxLength(200);
        b.Property(x => x.TitleEn).IsRequired().HasMaxLength(200);
        b.HasIndex(x => x.SiteKey).IsUnique().HasFilter("\"IsDeleted\" = false");
        b.HasMany(x => x.Cards).WithOne().HasForeignKey(x => x.LandingExperienceId)
            .OnDelete(DeleteBehavior.Cascade);
        b.HasData(new
        {
            Id = 1, SiteKey = "home", TitleFa = "تجربه لوکا", TitleEn = "The Luca experience",
            IsActive = true, IsDeleted = false, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            CreatedBy = (int?)1,
        });
    }
}

public sealed class LandingExperienceCardConfiguration : IEntityTypeConfiguration<LandingExperienceCard>
{
    public void Configure(EntityTypeBuilder<LandingExperienceCard> b)
    {
        b.ToTable("LandingExperienceCards");
        b.HasKey(x => x.Id);
        b.Property(x => x.CardKey).IsRequired().HasMaxLength(30);
        foreach (var name in new[] { nameof(LandingExperienceCard.TitleFa), nameof(LandingExperienceCard.TitleEn),
            nameof(LandingExperienceCard.CtaTextFa), nameof(LandingExperienceCard.CtaTextEn) })
            b.Property<string>(name).IsRequired().HasMaxLength(200);
        b.Property(x => x.BodyFa).IsRequired().HasMaxLength(4000);
        b.Property(x => x.BodyEn).IsRequired().HasMaxLength(4000);
        b.Property(x => x.CtaLink).IsRequired().HasMaxLength(500);
        b.Property(x => x.ImageUrl).IsRequired().HasMaxLength(300);
        b.Property(x => x.MobileImageUrl).IsRequired().HasMaxLength(300);
        b.Property(x => x.ImageAltFa).IsRequired().HasMaxLength(300);
        b.Property(x => x.ImageAltEn).IsRequired().HasMaxLength(300);
        b.HasIndex(x => new { x.LandingExperienceId, x.CardKey }).IsUnique()
            .HasFilter("\"IsDeleted\" = false");
        b.HasData(
            Row(1, "appointment", "رزرو مشاوره", "Book a consultation",
                "حضوری یا آنلاین، متخصص لوکا بزرگنمایی، فاصله کاری و فریم مناسب شما را پیشنهاد می‌کند.",
                "In person or online, a Luca specialist recommends the magnification, working distance and frame that suit you.",
                "ارسال درخواست", "Send a request", "/cooperation"),
            Row(2, "fitting", "اندازه‌گیری و ساخت سفارشی", "Measurement and custom build",
                "فاصله مردمک‌ها و زاویه دید شما اندازه‌گیری می‌شود تا لوپ دقیقاً برای چهره شما ساخته شود.",
                "Your pupillary distance and viewing angle are measured so the loupes are built exactly for your face.",
                "پرسش‌های رایج درباره اندازه‌گیری و ساخت لوپ", "FAQ on measuring and building your loupes", "/faq"),
            Row(3, "contact", "تماس با ما", "Contact us",
                "برای مشاوره خرید، پیگیری سفارش یا خدمات پس از فروش با ما در تماس باشید.",
                "Get in touch for buying advice, order tracking or after-sales service.",
                "راه‌های تماس و همکاری با لوکا", "Ways to contact and work with Luca", "/cooperation"));
    }

    private static object Row(int id, string key, string titleFa, string titleEn, string bodyFa, string bodyEn,
        string ctaFa, string ctaEn, string link) => new
        {
            Id = id, LandingExperienceId = 1, CardKey = key,
            TitleFa = titleFa, TitleEn = titleEn, BodyFa = bodyFa, BodyEn = bodyEn,
            CtaTextFa = ctaFa, CtaTextEn = ctaEn, CtaLink = link,
            ImageUrl = "", MobileImageUrl = "", ImageAltFa = "", ImageAltEn = "",
            IsActive = true, IsDeleted = false, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            CreatedBy = (int?)1,
        };
}

public sealed class LandingPageComponentConfiguration : IEntityTypeConfiguration<LandingPageComponent>
{
    public void Configure(EntityTypeBuilder<LandingPageComponent> b)
    {
        b.ToTable("LandingPageComponents");
        b.HasKey(x => x.Id);
        b.Property(x => x.ComponentKey).IsRequired().HasMaxLength(40);
        b.Property(x => x.DisplayOrder).IsRequired();
        b.Property(x => x.IsEnabled).IsRequired();
        b.HasIndex(x => x.ComponentKey).IsUnique();
        b.HasIndex(x => x.DisplayOrder);
        b.HasData(LandingPageComponent.Keys.Select((key, order) => new
        {
            Id = order + 1, ComponentKey = key, DisplayOrder = order,
            IsEnabled = true, IsActive = true, IsDeleted = false,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), CreatedBy = (int?)1,
        }).ToArray());
    }
}
