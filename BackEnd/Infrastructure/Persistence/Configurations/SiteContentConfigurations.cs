using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnlineShop.Domain.Entities;

namespace OnlineShop.Infrastructure.Persistence.Configurations
{
    public class HomeSlideConfiguration : IEntityTypeConfiguration<HomeSlide>
    {
        public void Configure(EntityTypeBuilder<HomeSlide> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ImageUrl).IsRequired().HasMaxLength(300);
            builder.Property(x => x.MobileImageUrl).IsRequired().HasMaxLength(300);
            builder.Property(x => x.LinkUrl).IsRequired().HasMaxLength(HomeSlide.MaxUrlLength);
            builder.Property(x => x.TitleFa).IsRequired().HasMaxLength(HomeSlide.MaxTitleLength);
            builder.Property(x => x.TitleEn).IsRequired().HasMaxLength(HomeSlide.MaxTitleLength);
            builder.Property(x => x.DisplayOrder).IsRequired();
            builder.HasIndex(x => new { x.IsActive, x.DisplayOrder });
            builder.ToTable("HomeSlides");
        }
    }

    public class CustomFontConfiguration : IEntityTypeConfiguration<CustomFont>
    {
        public void Configure(EntityTypeBuilder<CustomFont> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Ignore(x => x.Key);
            builder.Property(x => x.NameFa).IsRequired().HasMaxLength(CustomFont.MaxNameLength);
            builder.Property(x => x.NameEn).IsRequired().HasMaxLength(CustomFont.MaxNameLength);
            builder.Property(x => x.Category).IsRequired().HasMaxLength(20);
            builder.Property(x => x.FileUrl).IsRequired().HasMaxLength(300);
            builder.ToTable("CustomFonts");
        }
    }

    public class AboutSectionConfiguration : IEntityTypeConfiguration<AboutSection>
    {
        public void Configure(EntityTypeBuilder<AboutSection> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.SectionKey).IsRequired().HasMaxLength(AboutSection.MaxKeyLength);
            builder.Property(x => x.EyebrowFa).IsRequired().HasMaxLength(AboutSection.MaxShortLength);
            builder.Property(x => x.EyebrowEn).IsRequired().HasMaxLength(AboutSection.MaxShortLength);
            builder.Property(x => x.TitleFa).IsRequired().HasMaxLength(AboutSection.MaxShortLength);
            builder.Property(x => x.TitleEn).IsRequired().HasMaxLength(AboutSection.MaxShortLength);
            builder.Property(x => x.BodyFa).IsRequired().HasMaxLength(AboutSection.MaxBodyLength);
            builder.Property(x => x.BodyEn).IsRequired().HasMaxLength(AboutSection.MaxBodyLength);
            builder.Property(x => x.LinkTextFa).IsRequired().HasMaxLength(AboutSection.MaxShortLength);
            builder.Property(x => x.LinkTextEn).IsRequired().HasMaxLength(AboutSection.MaxShortLength);
            builder.Property(x => x.LinkUrl).IsRequired().HasMaxLength(AboutSection.MaxShortLength);
            builder.HasIndex(x => x.SectionKey).IsUnique().HasFilter("\"IsDeleted\" = false");
            builder.ToTable("AboutSections");

            // همان متن‌های فعلی صفحه‌ی «داستان لوکا»؛ جاهایی که هنوز قالب بودند ([سال] و ...) خالی
            // مانده‌اند تا تا وقتی ادمین پرشان نکرده در سایت نمایش داده نشوند.
            builder.HasData(
                Row(1, "hero", 1,
                    "درباره ما", "About us",
                    "داستان لوکا", "The Luca story",
                    "ابزاری که دیده نمی‌شود، تا شما بهتر ببینید.", "A tool that disappears, so you can see better."),
                Row(2, "intro", 2,
                    "", "",
                    "", "",
                    "لوکا لوپ دندانپزشکی می‌سازد؛ ابزاری که باید ساعت‌ها روی صورت بماند و فراموش شود. هر تصمیم طراحی ما از همین‌جا شروع می‌شود: وضوح بیشتر، وزن کمتر و وضعیت بدنی سالم‌تر برای دندانپزشک.",
                    "Luca makes dental loupes: a tool that has to sit on the face for hours and be forgotten. Every design decision starts there — more clarity, less weight and a healthier posture for the clinician."),
                Row(3, "chapter-optics", 3,
                    "۰۱ — اپتیک", "01 — Optics",
                    "شیشه، پیش از هر چیز", "Glass, before anything else",
                    "کیفیت یک لوپ از عدسی آن شروع می‌شود. تراش، پوشش و هم‌ترازی هر جفت عدسی پیش از سوار شدن روی فریم کنترل می‌شود.",
                    "The quality of a loupe starts with its lens. Grinding, coating and alignment of each lens pair are checked before they are mounted on the frame."),
                Row(4, "chapter-ergonomics", 4,
                    "۰۲ — ارگونومی", "02 — Ergonomics",
                    "طراحی برای یک عمر کار", "Designed for a lifetime of work",
                    "لوپ خوب وضعیت نشستن را اصلاح می‌کند. زاویه دید و توزیع وزن طوری تنظیم می‌شود که فشار از گردن و شانه برداشته شود.",
                    "Good loupes correct the way you sit. Viewing angle and weight distribution are set to take the load off the neck and shoulders."),
                Row(5, "chapter-custom", 5,
                    "۰۳ — ساخت سفارشی", "03 — Custom build",
                    "ساخته‌شده برای یک چهره", "Made for one face",
                    "فاصله مردمک‌ها، ارتفاع دید و فاصله کاری شما اندازه‌گیری می‌شود و لوپ بر همان اساس ساخته می‌شود.",
                    "Your pupillary distance, viewing height and working distance are measured, and the loupes are built to match.",
                    "رزرو وقت اندازه‌گیری", "Book a measurement", "cooperation"),
                Row(6, "quote", 6, "", "", "", "", "", ""),
                Row(7, "fact-1", 7, "", "", "", "", "آغاز کار لوکا", "Luca founded"),
                Row(8, "fact-2", 8, "", "", "", "", "کشور با نمایندگی رسمی", "Countries with official dealers"),
                Row(9, "fact-3", 9, "", "", "", "", "گارانتی اپتیک", "Optics warranty"),
                Row(10, "cta-shop", 10, "", "", "مشاهده لوپ‌ها", "Shop loupes", "", "",
                    "خرید", "Shop", "products"),
                Row(11, "cta-contact", 11, "", "", "مشاوره با کارشناس", "Talk to a specialist", "", "",
                    "رزرو وقت", "Book a consultation", "cooperation"));
        }

        private static object Row(
            int id, string key, int order,
            string eyebrowFa, string eyebrowEn,
            string titleFa, string titleEn,
            string bodyFa, string bodyEn,
            string linkTextFa = "", string linkTextEn = "", string linkUrl = "") => new
            {
                Id = id,
                SectionKey = key,
                DisplayOrder = order,
                EyebrowFa = eyebrowFa,
                EyebrowEn = eyebrowEn,
                TitleFa = titleFa,
                TitleEn = titleEn,
                BodyFa = bodyFa,
                BodyEn = bodyEn,
                LinkTextFa = linkTextFa,
                LinkTextEn = linkTextEn,
                LinkUrl = linkUrl,
                IsActive = true,
                IsDeleted = false,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                CreatedBy = 1,
            };
    }
}
