using Microsoft.EntityFrameworkCore;
using OnlineShop.Domain.Entities;
using OnlineShop.Domain.Interfaces;
using OnlineShop.Infrastructure.Persistence;

namespace OnlineShop.Infrastructure.Repositories
{
    public class HomeSlideRepository(AppDbContext context) : Repository<HomeSlide>(context), IHomeSlideRepository
    {
    }

    public class AboutSectionRepository(AppDbContext context) : Repository<AboutSection>(context), IAboutSectionRepository
    {
    }

    public class LandingExperienceRepository(AppDbContext context) : Repository<LandingExperience>(context), ILandingExperienceRepository
    {
    }

    public class LandingPageComponentRepository(AppDbContext context) : Repository<LandingPageComponent>(context), ILandingPageComponentRepository
    {
    }

    public class CustomFontRepository(AppDbContext context) : Repository<CustomFont>(context), ICustomFontRepository
    {
        public async Task<bool> IsActiveKeyAsync(string? key, CancellationToken cancellationToken = default)
        {
            var id = CustomFont.IdFromKey(key);
            if (id is null)
                return false;
            return await Query(f => f.Id == id.Value && f.IsActive && f.FileUrl != "").AnyAsync(cancellationToken);
        }
    }
}
