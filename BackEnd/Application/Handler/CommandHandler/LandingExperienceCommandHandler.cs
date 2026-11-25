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
using Services.Services.Uploader.DTO;

namespace Application.Handler.CommandHandler;

public sealed class LandingExperienceCommandHandler(ILandingExperienceRepository repo,
    IHttpContextAccessor accessor, IUploaderService uploader) :
    IRequestHandler<CreateLandingExperienceCommand, ServiceResult<IdDto>>,
    IRequestHandler<UpdateLandingExperienceCommand, ServiceResult<IdDto>>,
    IRequestHandler<DeleteLandingExperienceCommand, ServiceResult<IdDto>>,
    IRequestHandler<SaveLandingExperienceAdminFormCommand, ServiceResult<IdDto>>,
    IRequestHandler<UpdateLandingExperienceImageCommand, ServiceResult<IdDto>>
{
    private int? UserId => accessor.HttpContext?.GetUserId();

    public async Task<ServiceResult<IdDto>> Handle(SaveLandingExperienceAdminFormCommand r, CancellationToken ct)
    {
        if (UserId is null) return ServiceResult<IdDto>.Unauthorized();
        const long maxImageBytes = 10 * 1024 * 1024;
        if (new[] { r.AppointmentImage, r.AppointmentMobileImage, r.FittingImage, r.FittingMobileImage,
                r.ContactImage, r.ContactMobileImage }.Any(file => file is { Length: > maxImageBytes }))
            return ServiceResult<IdDto>.Failed("Each image must be 10 MB or smaller.");
        if ((r.AppointmentImage is { Length: > 0 } && r.AppointmentRemoveImage) ||
            (r.AppointmentMobileImage is { Length: > 0 } && r.AppointmentRemoveMobileImage) ||
            (r.FittingImage is { Length: > 0 } && r.FittingRemoveImage) ||
            (r.FittingMobileImage is { Length: > 0 } && r.FittingRemoveMobileImage) ||
            (r.ContactImage is { Length: > 0 } && r.ContactRemoveImage) ||
            (r.ContactMobileImage is { Length: > 0 } && r.ContactRemoveMobileImage))
            return ServiceResult<IdDto>.Failed("Cannot replace and remove the same image.");
        var cards = new List<ExperienceCardInput>
        {
            new ExperienceCardInput { CardKey = "appointment", TitleFa = r.AppointmentTitleFa, TitleEn = r.AppointmentTitleEn, BodyFa = r.AppointmentBodyFa, BodyEn = r.AppointmentBodyEn, CtaTextFa = r.AppointmentCtaTextFa, CtaTextEn = r.AppointmentCtaTextEn, CtaLink = r.AppointmentCtaLink, ImageAltFa = r.AppointmentImageAltFa, ImageAltEn = r.AppointmentImageAltEn },
            new ExperienceCardInput { CardKey = "fitting", TitleFa = r.FittingTitleFa, TitleEn = r.FittingTitleEn, BodyFa = r.FittingBodyFa, BodyEn = r.FittingBodyEn, CtaTextFa = r.FittingCtaTextFa, CtaTextEn = r.FittingCtaTextEn, CtaLink = r.FittingCtaLink, ImageAltFa = r.FittingImageAltFa, ImageAltEn = r.FittingImageAltEn },
            new ExperienceCardInput { CardKey = "contact", TitleFa = r.ContactTitleFa, TitleEn = r.ContactTitleEn, BodyFa = r.ContactBodyFa, BodyEn = r.ContactBodyEn, CtaTextFa = r.ContactCtaTextFa, CtaTextEn = r.ContactCtaTextEn, CtaLink = r.ContactCtaLink, ImageAltFa = r.ContactImageAltFa, ImageAltEn = r.ContactImageAltEn },
        };
        if (r.Id is > 0)
        {
            var currentId = await repo.Query(e => e.SiteKey == "home" && !e.IsDeleted)
                .Select(e => (int?)e.Id).FirstOrDefaultAsync(ct);
            if (currentId != r.Id) return ServiceResult<IdDto>.Failed("Landing experience not found.");
        }
        var saved = r.Id is > 0
            ? await Handle(new UpdateLandingExperienceCommand { TitleFa = r.TitleFa, TitleEn = r.TitleEn, Cards = cards }, ct)
            : await Handle(new CreateLandingExperienceCommand { TitleFa = r.TitleFa, TitleEn = r.TitleEn, Cards = cards }, ct);
        if (!saved.IsSuccess) return saved;
        if (r.AppointmentImage is not null || r.AppointmentMobileImage is not null || r.AppointmentRemoveImage || r.AppointmentRemoveMobileImage)
        {
            var uploaded = await Handle(new UpdateLandingExperienceImageCommand
            {
                CardKey = "appointment", Image = r.AppointmentImage, MobileImage = r.AppointmentMobileImage,
                RemoveImage = r.AppointmentRemoveImage, RemoveMobileImage = r.AppointmentRemoveMobileImage,
            }, ct);
            if (!uploaded.IsSuccess) return PartialImageFailure(uploaded, saved);
        }
        if (r.FittingImage is not null || r.FittingMobileImage is not null || r.FittingRemoveImage || r.FittingRemoveMobileImage)
        {
            var uploaded = await Handle(new UpdateLandingExperienceImageCommand
            {
                CardKey = "fitting", Image = r.FittingImage, MobileImage = r.FittingMobileImage,
                RemoveImage = r.FittingRemoveImage, RemoveMobileImage = r.FittingRemoveMobileImage,
            }, ct);
            if (!uploaded.IsSuccess) return PartialImageFailure(uploaded, saved);
        }
        if (r.ContactImage is not null || r.ContactMobileImage is not null || r.ContactRemoveImage || r.ContactRemoveMobileImage)
        {
            var uploaded = await Handle(new UpdateLandingExperienceImageCommand
            {
                CardKey = "contact", Image = r.ContactImage, MobileImage = r.ContactMobileImage,
                RemoveImage = r.ContactRemoveImage, RemoveMobileImage = r.ContactRemoveMobileImage,
            }, ct);
            if (!uploaded.IsSuccess) return PartialImageFailure(uploaded, saved);
        }
        return saved;
    }

    private static ServiceResult<IdDto> PartialImageFailure(ServiceResult<IdDto> failure, ServiceResult<IdDto> saved) =>
        new() { IsSuccess = false, Error = $"Text saved, but an image could not be updated: {failure.Error}",
            ErrorCode = ErrorCodes.PartialSave, Data = saved.Data };

    private static LandingExperienceCardText Text(ExperienceCardInput c) => new(c.TitleFa, c.TitleEn,
        c.BodyFa, c.BodyEn, c.CtaTextFa, c.CtaTextEn, c.CtaLink, c.ImageAltFa, c.ImageAltEn);

    private static void ApplyCards(LandingExperience section, List<ExperienceCardInput>? inputs, int userId)
    {
        if (inputs is null) return;
        if (inputs.GroupBy(c => c.CardKey, StringComparer.Ordinal).Any(g => g.Count() > 1) ||
            inputs.Any(c => !LandingExperienceCard.Keys.Contains(c.CardKey, StringComparer.Ordinal)))
            throw new DomainException("Invalid or duplicate experience card.");
        foreach (var input in inputs)
        {
            var card = section.Cards.FirstOrDefault(c => c.CardKey == input.CardKey && !c.IsDeleted);
            if (card is null) section.Cards.Add(LandingExperienceCard.Create(input.CardKey, Text(input), userId));
            else card.Update(Text(input), userId);
        }
    }

    public async Task<ServiceResult<IdDto>> Handle(CreateLandingExperienceCommand r, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        if (await repo.Query(e => e.SiteKey == "home" && !e.IsDeleted).AnyAsync(ct))
            return ServiceResult<IdDto>.Failed("Landing experience already exists.");
        try
        {
            var section = LandingExperience.Create(r.TitleFa ?? "", r.TitleEn ?? "", userId);
            ApplyCards(section, r.Cards ?? LandingExperienceCard.Keys.Select(k => new ExperienceCardInput { CardKey = k }).ToList(), userId);
            await repo.AddAsync(section);
            await repo.SaveChangesAsync(ct);
            return ServiceResult<IdDto>.Ok(new IdDto { Id = section.Id });
        }
        catch (DomainException ex) { return ServiceResult<IdDto>.Failed(ex.Message); }
    }

    public async Task<ServiceResult<IdDto>> Handle(UpdateLandingExperienceCommand r, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        var section = await repo.Query(e => e.SiteKey == "home" && !e.IsDeleted).Include(e => e.Cards).FirstOrDefaultAsync(ct);
        if (section is null) return ServiceResult<IdDto>.Failed("Landing experience not found.");
        try
        {
            section.Update(r.TitleFa, r.TitleEn, userId);
            ApplyCards(section, r.Cards, userId);
            await repo.SaveChangesAsync(ct);
            return ServiceResult<IdDto>.Ok(new IdDto { Id = section.Id });
        }
        catch (DomainException ex) { return ServiceResult<IdDto>.Failed(ex.Message); }
    }

    public async Task<ServiceResult<IdDto>> Handle(DeleteLandingExperienceCommand r, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        var section = await repo.Query(e => e.SiteKey == "home" && !e.IsDeleted)
            .Include(e => e.Cards).FirstOrDefaultAsync(ct);
        if (section is null) return ServiceResult<IdDto>.Failed("Landing experience not found.");
        var storedImages = section.Cards
            .SelectMany(c => new[] { c.ImageUrl, c.MobileImageUrl })
            .Where(UploadPaths.IsStoredPath).Distinct(StringComparer.Ordinal).ToList();
        section.Delete(userId);
        await repo.SaveChangesAsync(ct);
        foreach (var path in storedImages)
            await uploader.DeleteStoredFile(path, UploadPaths.LandingExperience(section.Id));
        return ServiceResult<IdDto>.Ok(new IdDto { Id = section.Id });
    }

    public async Task<ServiceResult<IdDto>> Handle(UpdateLandingExperienceImageCommand r, CancellationToken ct)
    {
        if (UserId is not int userId) return ServiceResult<IdDto>.Unauthorized();
        const long maxImageBytes = 10 * 1024 * 1024;
        if (new[] { r.Image, r.MobileImage }.Any(file => file is { Length: > maxImageBytes }))
            return ServiceResult<IdDto>.Failed("Each image must be 10 MB or smaller.");
        if (!LandingExperienceCard.Keys.Contains(r.CardKey, StringComparer.Ordinal))
            return ServiceResult<IdDto>.Failed("Unsupported experience card.");
        if ((r.Image is { Length: > 0 } && r.RemoveImage) || (r.MobileImage is { Length: > 0 } && r.RemoveMobileImage))
            return ServiceResult<IdDto>.Failed("Cannot replace and remove the same image.");
        var section = await repo.Query(e => e.SiteKey == "home" && !e.IsDeleted).Include(e => e.Cards).FirstOrDefaultAsync(ct);
        var card = section?.Cards.FirstOrDefault(c => c.CardKey == r.CardKey && !c.IsDeleted);
        if (card is null) return ServiceResult<IdDto>.Failed("Experience card not found.");
        var directory = UploadPaths.LandingExperience(section!.Id);
        var uploaded = new List<string>();
        async Task<string?> Upload(IFormFile file)
        {
            var stored = await uploader.UploadAsWebp(new UploadDTO { File = file, Path = directory });
            if (!UploadPaths.IsStoredPath(stored)) return null;
            uploaded.Add(stored!);
            return stored;
        }
        var main = r.Image is { Length: > 0 } ? await Upload(r.Image) : null;
        if (r.Image is { Length: > 0 } && main is null) return ServiceResult<IdDto>.Failed("Image upload failed.");
        var mobile = r.MobileImage is { Length: > 0 } ? await Upload(r.MobileImage) : null;
        if (r.MobileImage is { Length: > 0 } && mobile is null)
        {
            foreach (var path in uploaded) await uploader.DeleteStoredFile(path, directory);
            return ServiceResult<IdDto>.Failed("Mobile image upload failed.");
        }
        var previousMain = card.ImageUrl;
        var previousMobile = card.MobileImageUrl;
        if (main is not null || r.RemoveImage) card.SetImage(main ?? "", false, userId);
        if (mobile is not null || r.RemoveMobileImage) card.SetImage(mobile ?? "", true, userId);
        try { await repo.SaveChangesAsync(ct); }
        catch
        {
            foreach (var path in uploaded) await uploader.DeleteStoredFile(path, directory);
            throw;
        }
        if (previousMain != card.ImageUrl && previousMain != card.MobileImageUrl && UploadPaths.IsStoredPath(previousMain))
            await uploader.DeleteStoredFile(previousMain, directory);
        if (previousMobile != card.MobileImageUrl && previousMobile != card.ImageUrl &&
            UploadPaths.IsStoredPath(previousMobile) && previousMobile != previousMain)
            await uploader.DeleteStoredFile(previousMobile, directory);
        return ServiceResult<IdDto>.Ok(new IdDto { Id = section.Id });
    }
}
