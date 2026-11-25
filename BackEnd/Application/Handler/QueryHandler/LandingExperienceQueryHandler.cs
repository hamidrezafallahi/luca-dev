using Application.Dtos;
using Application.Queries;
using Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OnlineShop.Domain.Entities;
using OnlineShop.Domain.Interfaces;
using System.Text.Json;

namespace Application.Handler.QueryHandler;

public sealed class LandingExperienceQueryHandler(ILandingExperienceRepository experiences,
    ILandingPageComponentRepository components, IEntityConfigRepository configs) :
    IRequestHandler<GetPublicLandingExperienceQuery, ServiceResult<LandingExperienceDto>>,
    IRequestHandler<GetAdminLandingExperienceQuery, ServiceResult<LandingExperienceDto>>,
    IRequestHandler<GetLandingExperienceAdminListQuery, ServiceResult<ListDto<Dictionary<string, object?>>>>,
    IRequestHandler<GetLandingExperienceAdminFormQuery, ServiceResult<Dictionary<string, object?>>>,
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

    private static Dictionary<string, object?> Form(LandingExperience e)
    {
        var values = new Dictionary<string, object?> { ["id"] = e.Id, ["titleFa"] = e.TitleFa, ["titleEn"] = e.TitleEn };
        foreach (var key in LandingExperienceCard.Keys)
        {
            var card = e.Cards.FirstOrDefault(c => c.CardKey == key && !c.IsDeleted);
            values[$"{key}TitleFa"] = card?.TitleFa ?? "";
            values[$"{key}TitleEn"] = card?.TitleEn ?? "";
            values[$"{key}BodyFa"] = card?.BodyFa ?? "";
            values[$"{key}BodyEn"] = card?.BodyEn ?? "";
            values[$"{key}CtaTextFa"] = card?.CtaTextFa ?? "";
            values[$"{key}CtaTextEn"] = card?.CtaTextEn ?? "";
            values[$"{key}CtaLink"] = card?.CtaLink ?? "";
            values[$"{key}ImageAltFa"] = card?.ImageAltFa ?? "";
            values[$"{key}ImageAltEn"] = card?.ImageAltEn ?? "";
            values[$"{key}Image"] = card?.ImageUrl ?? "";
            values[$"{key}MobileImage"] = card?.MobileImageUrl ?? "";
        }
        return values;
    }

    public async Task<ServiceResult<ListDto<Dictionary<string, object?>>>> Handle(GetLandingExperienceAdminListQuery request, CancellationToken ct)
    {
        var e = await experiences.Query(e => e.SiteKey == "home" && !e.IsDeleted)
            .Include(e => e.Cards).AsNoTracking().FirstOrDefaultAsync(ct);
        var config = request.ByConfig == true ? await configs.GetByEntityNameAsync("landingExperiences") : null;
        string? actions = null;
        if (config is not null)
        {
            try
            {
                var allowed = JsonSerializer.Deserialize<string[]>(config.ActionsJson ?? "[]") ?? [];
                var eligible = e is null ? new[] { "new" } : new[] { "edit", "delete" };
                actions = JsonSerializer.Serialize(eligible.Where(a => allowed.Contains(a, StringComparer.OrdinalIgnoreCase)));
            }
            catch (JsonException) { actions = "[]"; }
        }
        var size = Math.Clamp(request.pageSize ?? 10, 1, 100);
        var page = Math.Max(request.page ?? 1, 1);
        var matches = e != null && (string.IsNullOrWhiteSpace(request.Q) ||
            e.TitleFa.Contains(request.Q.Trim(), StringComparison.OrdinalIgnoreCase) ||
            e.TitleEn.Contains(request.Q.Trim(), StringComparison.OrdinalIgnoreCase));
        return ServiceResult<ListDto<Dictionary<string, object?>>>.Ok(new ListDto<Dictionary<string, object?>>
        {
            Records = matches && page == 1 ? [Form(e!)] : [],
            TotalCount = matches ? 1 : 0, PageNumber = page, PageSize = size,
            ColumnsJson = config?.ColumnsJson,
            ActionsJson = actions,
        });
    }

    public async Task<ServiceResult<Dictionary<string, object?>>> Handle(GetLandingExperienceAdminFormQuery request, CancellationToken ct)
    {
        var e = await experiences.Query(e => e.Id == request.Id && e.SiteKey == "home" && !e.IsDeleted)
            .Include(e => e.Cards).AsNoTracking().FirstOrDefaultAsync(ct);
        return e is null ? ServiceResult<Dictionary<string, object?>>.Failed("Landing experience not found.")
            : ServiceResult<Dictionary<string, object?>>.Ok(Form(e));
    }

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
