using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnlineShop.Domain.Entities;

namespace OnlineShop.Infrastructure.Persistence.Configurations
{
    public class ThemeSettingConfiguration : IEntityTypeConfiguration<ThemeSetting>
    {
        public void Configure(EntityTypeBuilder<ThemeSetting> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);

            foreach (var name in new[]
                     {
                         nameof(ThemeSetting.PrimaryColor), nameof(ThemeSetting.SecondaryColor),
                         nameof(ThemeSetting.HighlightColor), nameof(ThemeSetting.NeutralColor),
                         nameof(ThemeSetting.SuccessColor), nameof(ThemeSetting.ErrorColor),
                         nameof(ThemeSetting.WarningColor), nameof(ThemeSetting.InfoColor),
                         nameof(ThemeSetting.SurfaceColor), nameof(ThemeSetting.SurfaceMutedColor),
                         nameof(ThemeSetting.BorderColor), nameof(ThemeSetting.TextColor),
                         nameof(ThemeSetting.TextMutedColor),
                     })
            {
                builder.Property(name).IsRequired().HasMaxLength(7);
            }

            // ردیف‌های موجود هم فونت پیش‌فرض فعلی سایت (وزیرمتن) را می‌گیرند.
            builder.Property(x => x.FontFamily)
                   .IsRequired()
                   .HasMaxLength(ThemeFonts.MaxLength)
                   .HasDefaultValue(ThemeFonts.Default);

            builder.Property(x => x.HeadingFontFamily)
                   .IsRequired()
                   .HasMaxLength(ThemeFonts.MaxLength)
                   .HasDefaultValue(ThemeFonts.DefaultHeading);

            // ردیف‌های موجود اندازه‌ی «متوسط» می‌گیرند، یعنی سایت همان شکل فعلی را دارد.
            builder.Property(x => x.BodyTextSize)
                   .IsRequired()
                   .HasMaxLength(ThemeTextSizes.MaxLength)
                   .HasDefaultValue(ThemeTextSizes.Medium);

            builder.Property(x => x.HeadingTextSize)
                   .IsRequired()
                   .HasMaxLength(ThemeTextSizes.MaxLength)
                   .HasDefaultValue(ThemeTextSizes.Medium);

            // ردیف‌های موجود همان ضخامت فعلی سایت را می‌گیرند.
            builder.Property(x => x.BodyFontWeight)
                   .HasDefaultValue(ThemeFontWeights.DefaultBody);

            builder.Property(x => x.HeadingFontWeight)
                   .HasDefaultValue(ThemeFontWeights.DefaultHeading);

            builder.ToTable("ThemeSettings");

            // تم پیش‌فرض (همان پالت مونوکروم فعلی سایت) تا سایت از روز اول رنگ‌هایش را از دیتابیس بگیرد.
            builder.HasData(new
            {
                Id = 1,
                Name = "Luca",
                PrimaryColor = "#1e3a8a",
                SecondaryColor = "#111111",
                HighlightColor = "#1e3a8a",
                NeutralColor = "#f6f6f3",
                SuccessColor = "#1d5c3f",
                ErrorColor = "#a3262e",
                WarningColor = "#8a5a00",
                InfoColor = "#1e3a8a",
                SurfaceColor = "#ffffff",
                SurfaceMutedColor = "#f6f6f3",
                BorderColor = "#e4e4e0",
                TextColor = "#111111",
                TextMutedColor = "#5c5c58",
                FontFamily = ThemeFonts.Default,
                HeadingFontFamily = ThemeFonts.DefaultHeading,
                BodyTextSize = ThemeTextSizes.Medium,
                HeadingTextSize = ThemeTextSizes.Medium,
                BodyFontWeight = ThemeFontWeights.DefaultBody,
                HeadingFontWeight = ThemeFontWeights.DefaultHeading,
                IsActive = true,
                IsDeleted = false,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                CreatedBy = 1,
            });
        }
    }
}
