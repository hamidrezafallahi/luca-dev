using Application.Commands;
using Application.Common;
using Application.Common.Interfaces;
using Common;
using MediatR;
using Microsoft.AspNetCore.Http;
using OnlineShop.Domain.Common;
using OnlineShop.Domain.Entities;
using OnlineShop.Domain.Interfaces;
using Services.Services.Uploader.DTO;

namespace Application.Handler.CommandHandler;

public class LandingFeatureCommandHandler(ILandingFeatureRepository repo, IHttpContextAccessor accessor,
    IUploaderService uploader, IUnitOfWork unitOfWork) :
    IRequestHandler<CreateLandingFeatureCommand, ServiceResult<IdDto>>,
    IRequestHandler<UpdateLandingFeatureCommand, ServiceResult<IdDto>>,
    IRequestHandler<ActiveLandingFeatureCommand, ServiceResult<IdDto>>,
    IRequestHandler<DeleteLandingFeatureCommand, ServiceResult<IdDto>>
{
    private int? UserId => accessor.HttpContext.GetUserId();

    private static LandingFeatureText Text(CreateLandingFeatureCommand r) => new(
        r.EyebrowFa, r.EyebrowEn, r.TitleFa, r.TitleEn, r.BodyFa, r.BodyEn,
        r.LinkTextFa, r.LinkTextEn, r.LinkUrl, r.DisplayOrder, r.Reverse);

    private async Task<string?> Upload(IFormFile file, int id)
    {
        var stored = await uploader.UploadAsWebp(new UploadDTO { File = file, Path = UploadPaths.LandingFeatures(id) });
        return UploadPaths.IsStoredPath(stored) ? stored : null;
    }

    public async Task<ServiceResult<IdDto>> Handle(CreateLandingFeatureCommand request, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        LandingFeature feature;
        try { feature = LandingFeature.Create(Text(request), userId); }
        catch (DomainException ex) { return ServiceResult<IdDto>.Failed(ex.Message); }

        await using var transaction = await unitOfWork.BeginTransactionAsync(ct);
        await repo.AddAsync(feature);
        await repo.SaveChangesAsync(ct);
        if (request.ImageUrl is { Length: > 0 })
        {
            var stored = await Upload(request.ImageUrl, feature.Id);
            if (stored is null) return ServiceResult<IdDto>.Failed("Image upload failed");
            feature.SetImage(stored, userId);
            await repo.SaveChangesAsync(ct);
        }
        await transaction.CommitAsync(ct);
        return ServiceResult<IdDto>.Ok(new IdDto { Id = feature.Id });
    }

    public async Task<ServiceResult<IdDto>> Handle(UpdateLandingFeatureCommand request, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        var feature = await repo.GetByIdAsync(request.Id);
        if (feature is null) return ServiceResult<IdDto>.Failed("Feature not found");
        try { feature.Update(Text(request), userId); }
        catch (DomainException ex) { return ServiceResult<IdDto>.Failed(ex.Message); }
        var previous = feature.ImageUrl;
        if (request.ImageUrl is { Length: > 0 })
        {
            var stored = await Upload(request.ImageUrl, feature.Id);
            if (stored is null) return ServiceResult<IdDto>.Failed("Image upload failed");
            feature.SetImage(stored, userId);
        }
        else if (request.RemoveImage) feature.SetImage("", userId);
        await repo.SaveChangesAsync(ct);
        if (previous != feature.ImageUrl && UploadPaths.IsStoredPath(previous))
            await uploader.DeleteStoredFile(previous, UploadPaths.LandingFeatures(feature.Id));
        return ServiceResult<IdDto>.Ok(new IdDto { Id = feature.Id });
    }

    public async Task<ServiceResult<IdDto>> Handle(ActiveLandingFeatureCommand request, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        var feature = await repo.GetByIdAsync(request.Id);
        if (feature is null) return ServiceResult<IdDto>.Failed("Feature not found");
        feature.SetActive(request.IsActive, userId);
        await repo.SaveChangesAsync(ct);
        return ServiceResult<IdDto>.Ok(new IdDto { Id = feature.Id });
    }

    public async Task<ServiceResult<IdDto>> Handle(DeleteLandingFeatureCommand request, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        var feature = await repo.GetByIdAsync(request.Id);
        if (feature is null) return ServiceResult<IdDto>.Failed("Feature not found");
        feature.Delete(userId);
        await repo.SaveChangesAsync(ct);
        if (UploadPaths.IsStoredPath(feature.ImageUrl))
            await uploader.DeleteStoredFile(feature.ImageUrl, UploadPaths.LandingFeatures(feature.Id));
        return ServiceResult<IdDto>.Ok(new IdDto { Id = feature.Id });
    }
}
