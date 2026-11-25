using Application.Commands;
using Application.Common;
using Application.Common.Interfaces;
using Common;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using OnlineShop.Domain.Common;
using OnlineShop.Domain.Entities;
using OnlineShop.Domain.Interfaces;

namespace Application.Handler.CommandHandler;

public sealed class LandingPageComponentCommandHandler(ILandingPageComponentRepository repo,
    IHttpContextAccessor accessor, IUnitOfWork unitOfWork) :
    IRequestHandler<ReorderLandingPageComponentsCommand, ServiceResult<IdDto>>,
    IRequestHandler<UpdateLandingPageComponentVisibilityCommand, ServiceResult<IdDto>>
{
    private int? UserId => accessor.HttpContext?.GetUserId();

    public async Task<ServiceResult<IdDto>> Handle(ReorderLandingPageComponentsCommand r, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        if (r.Keys is null || r.Keys.Count != LandingPageComponent.Keys.Length ||
            r.Keys.Distinct(StringComparer.Ordinal).Count() != r.Keys.Count ||
            r.Keys.Any(k => !LandingPageComponent.Keys.Contains(k, StringComparer.Ordinal)) || r.Keys[0] != "hero" ||
            (r.Visibility is not null && (r.Visibility.Keys.Any(k => !r.Keys.Contains(k, StringComparer.Ordinal)) ||
                (r.Visibility.TryGetValue("hero", out var heroEnabled) && !heroEnabled))))
            return ServiceResult<IdDto>.Failed("Order must contain each supported component exactly once, with hero first.");
        await using var transaction = await unitOfWork.BeginTransactionAsync(ct);
        var rows = (await repo.Query(c => !c.IsDeleted).ToListAsync(ct))
            .Where(c => LandingPageComponent.Keys.Contains(c.ComponentKey, StringComparer.Ordinal)).ToList();
        if (rows.Count != r.Keys.Count || rows.Any(c => !r.Keys.Contains(c.ComponentKey, StringComparer.Ordinal)))
            return ServiceResult<IdDto>.Failed("Component configuration is incomplete.");
        foreach (var row in rows)
        {
            row.Reorder(r.Keys.IndexOf(row.ComponentKey), userId);
            if (r.Visibility?.TryGetValue(row.ComponentKey, out var enabled) == true) row.SetEnabled(enabled, userId);
        }
        await repo.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);
        return ServiceResult<IdDto>.Ok(new IdDto());
    }

    public async Task<ServiceResult<IdDto>> Handle(UpdateLandingPageComponentVisibilityCommand r, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        if (!LandingPageComponent.Keys.Contains(r.ComponentKey, StringComparer.Ordinal))
            return ServiceResult<IdDto>.Failed("Unsupported landing component.");
        var row = await repo.Query(c => c.ComponentKey == r.ComponentKey && !c.IsDeleted).FirstOrDefaultAsync(ct);
        if (row is null) return ServiceResult<IdDto>.Failed("Component configuration not found.");
        try { row.SetEnabled(r.IsEnabled, userId); }
        catch (DomainException ex) { return ServiceResult<IdDto>.Failed(ex.Message); }
        await repo.SaveChangesAsync(ct);
        return ServiceResult<IdDto>.Ok(new IdDto { Id = row.Id });
    }
}
