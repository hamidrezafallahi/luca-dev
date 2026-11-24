using Application.Dtos;
using Application.Queries;
using Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OnlineShop.Domain.Entities;
using OnlineShop.Domain.Interfaces;

namespace Application.Handler.QueryHandler;

public class LandingFeatureQueryHandler(ILandingFeatureRepository repo, IEntityConfigRepository configRepo) :
    IRequestHandler<GetAllLandingFeaturesQuery, ServiceResult<ListDto<LandingFeatureDto>>>,
    IRequestHandler<GetLandingFeatureByIdQuery, ServiceResult<LandingFeatureDto>>,
    IRequestHandler<GetPublicLandingFeaturesQuery, ServiceResult<List<LandingFeatureDto>>>
{
    private static LandingFeatureDto ToDto(LandingFeature f) => new()
    {
        Id = f.Id, IsActive = f.IsActive, ImageUrl = f.ImageUrl,
        EyebrowFa = f.EyebrowFa, EyebrowEn = f.EyebrowEn,
        TitleFa = f.TitleFa, TitleEn = f.TitleEn, BodyFa = f.BodyFa, BodyEn = f.BodyEn,
        LinkTextFa = f.LinkTextFa, LinkTextEn = f.LinkTextEn, LinkUrl = f.LinkUrl,
        DisplayOrder = f.DisplayOrder, Reverse = f.Reverse,
    };

    public async Task<ServiceResult<ListDto<LandingFeatureDto>>> Handle(GetAllLandingFeaturesQuery request, CancellationToken ct)
    {
        var query = repo.Query();
        if (request.OnlyActives == true) query = query.Where(f => f.IsActive);
        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            var q = request.Q.Trim();
            query = query.Where(f => f.TitleFa.Contains(q) || f.TitleEn.Contains(q));
        }
        var total = await query.CountAsync(ct);
        var page = request.page is null or < 1 ? 1 : request.page.Value;
        var size = request.pageSize is null or < 1 ? 10 : request.pageSize.Value;
        var rows = await query.OrderBy(f => f.DisplayOrder).ThenBy(f => f.Id)
            .Skip((page - 1) * size).Take(size).AsNoTracking().ToListAsync(ct);
        var config = request.ByConfig == true ? await configRepo.GetByEntityNameAsync("landingFeatures") : null;
        return ServiceResult<ListDto<LandingFeatureDto>>.Ok(new ListDto<LandingFeatureDto>
        {
            Records = rows.Select(ToDto).ToList(), ColumnsJson = config?.ColumnsJson,
            ActionsJson = config?.ActionsJson, TotalCount = total, PageNumber = page, PageSize = size,
        });
    }

    public async Task<ServiceResult<LandingFeatureDto>> Handle(GetLandingFeatureByIdQuery request, CancellationToken ct)
    {
        var row = await repo.GetByIdAsync(request.Id);
        return row is null ? ServiceResult<LandingFeatureDto>.Failed("Feature not found")
            : ServiceResult<LandingFeatureDto>.Ok(ToDto(row));
    }

    public async Task<ServiceResult<List<LandingFeatureDto>>> Handle(GetPublicLandingFeaturesQuery request, CancellationToken ct)
    {
        var rows = await repo.Query(f => f.IsActive).OrderBy(f => f.DisplayOrder).ThenBy(f => f.Id)
            .AsNoTracking().ToListAsync(ct);
        return ServiceResult<List<LandingFeatureDto>>.Ok(rows.Select(ToDto).ToList());
    }
}
