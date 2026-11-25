using Application.Dtos;
using Application.Queries;
using Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OnlineShop.Domain.Entities;
using OnlineShop.Domain.Interfaces;

namespace Application.Handler.QueryHandler;

public sealed class LandingExperienceQueryHandler(ILandingExperienceRepository experiences,
    ILandingPageComponentRepository components) :
    IRequestHandler<GetPublicLandingExperienceQuery, ServiceResult<LandingExperienceDto>>,
    IRequestHandler<GetAdminLandingExperienceQuery, ServiceResult<LandingExperienceDto>>,
    IRequestHandler<GetPublicLandingPageComponentsQuery, ServiceResult<List<LandingPageComponentDto>>>,
    IRequestHandler<GetAdminLandingPageComponentsQuery, ServiceResult<List<LandingPageComponentDto>>>
{
    private static LandingExperienceDto Map(LandingExperience e) => new()
    {
        Id = e.Id, TitleFa = e.TitleFa, TitleEn = e.TitleEn,
        Cards = e.Cards.Where(c => !c.IsDeleted && c.IsActive)
            .OrderBy(c => Array.IndexOf(LandingExperienceCard.Keys, c.CardKey))
            .Select(c => new LandingExperienceCardDto
            {
                CardKey = c.CardKey, TitleFa = c.TitleFa, TitleEn = c.TitleEn,
                BodyFa = c.BodyFa, BodyEn = c.BodyEn, CtaTextFa = c.CtaTextFa,
                CtaTextEn = c.CtaTextEn, CtaLink = c.CtaLink, ImageUrl = c.ImageUrl,
                MobileImageUrl = c.MobileImageUrl, ImageAltFa = c.ImageAltFa,
                ImageAltEn = c.ImageAltEn,
            }).ToList(),
    };

    public async Task<ServiceResult<LandingExperienceDto>> Handle(GetPublicLandingExperienceQuery request, CancellationToken ct)
    {
        var e = await experiences.Query(e => e.SiteKey == "home" && !e.IsDeleted && e.IsActive)
            .Include(e => e.Cards).AsNoTracking().FirstOrDefaultAsync(ct);
        return ServiceResult<LandingExperienceDto>.Ok(e is null ? null! : Map(e));
    }

    public async Task<ServiceResult<LandingExperienceDto>> Handle(GetAdminLandingExperienceQuery request, CancellationToken ct)
    {
        var e = await experiences.Query(e => e.SiteKey == "home" && !e.IsDeleted)
            .Include(e => e.Cards).AsNoTracking().FirstOrDefaultAsync(ct);
        return ServiceResult<LandingExperienceDto>.Ok(e is null ? null! : Map(e));
    }

    private async Task<ServiceResult<List<LandingPageComponentDto>>> List(bool publicOnly, CancellationToken ct)
    {
        var rows = await components.Query(c => !c.IsDeleted)
            .OrderBy(c => c.DisplayOrder).ThenBy(c => c.ComponentKey).AsNoTracking().ToListAsync(ct);
        return ServiceResult<List<LandingPageComponentDto>>.Ok(rows
            .Where(c => LandingPageComponent.Keys.Contains(c.ComponentKey, StringComparer.Ordinal)
                && (!publicOnly || (c.IsEnabled && c.IsActive)))
            .Select(c => new LandingPageComponentDto
            {
                ComponentKey = c.ComponentKey, DisplayOrder = c.DisplayOrder,
                IsEnabled = c.IsEnabled, IsRequired = c.ComponentKey == "hero",
            }).ToList());
    }

    public Task<ServiceResult<List<LandingPageComponentDto>>> Handle(GetPublicLandingPageComponentsQuery request, CancellationToken ct) => List(true, ct);
    public Task<ServiceResult<List<LandingPageComponentDto>>> Handle(GetAdminLandingPageComponentsQuery request, CancellationToken ct) => List(false, ct);
}
