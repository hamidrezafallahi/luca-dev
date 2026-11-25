using Common;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Commands;

public sealed class ExperienceCardInput
{
    public string CardKey { get; set; } = "";
    public string? TitleFa { get; set; }
    public string? TitleEn { get; set; }
    public string? BodyFa { get; set; }
    public string? BodyEn { get; set; }
    public string? CtaTextFa { get; set; }
    public string? CtaTextEn { get; set; }
    public string? CtaLink { get; set; }
    public string? ImageAltFa { get; set; }
    public string? ImageAltEn { get; set; }
}

public sealed class CreateLandingExperienceCommand : IRequest<ServiceResult<IdDto>>
{
    public string? TitleFa { get; set; }
    public string? TitleEn { get; set; }
    public List<ExperienceCardInput>? Cards { get; set; }
}

public sealed class UpdateLandingExperienceCommand : IRequest<ServiceResult<IdDto>>
{
    public string? TitleFa { get; set; }
    public string? TitleEn { get; set; }
    public List<ExperienceCardInput>? Cards { get; set; }
}

public sealed class DeleteLandingExperienceCommand : IRequest<ServiceResult<IdDto>> { }

public sealed class SaveLandingExperienceAdminFormCommand : IRequest<ServiceResult<IdDto>>
{
    public int? Id { get; set; }
    public string? TitleFa { get; set; }
    public string? TitleEn { get; set; }
    public string? AppointmentTitleFa { get; set; }
    public string? AppointmentTitleEn { get; set; }
    public string? AppointmentBodyFa { get; set; }
    public string? AppointmentBodyEn { get; set; }
    public string? AppointmentCtaTextFa { get; set; }
    public string? AppointmentCtaTextEn { get; set; }
    public string? AppointmentCtaLink { get; set; }
    public string? AppointmentImageAltFa { get; set; }
    public string? AppointmentImageAltEn { get; set; }
    public IFormFile? AppointmentImage { get; set; }
    public IFormFile? AppointmentMobileImage { get; set; }
    public bool AppointmentRemoveImage { get; set; }
    public bool AppointmentRemoveMobileImage { get; set; }
    public string? FittingTitleFa { get; set; }
    public string? FittingTitleEn { get; set; }
    public string? FittingBodyFa { get; set; }
    public string? FittingBodyEn { get; set; }
    public string? FittingCtaTextFa { get; set; }
    public string? FittingCtaTextEn { get; set; }
    public string? FittingCtaLink { get; set; }
    public string? FittingImageAltFa { get; set; }
    public string? FittingImageAltEn { get; set; }
    public IFormFile? FittingImage { get; set; }
    public IFormFile? FittingMobileImage { get; set; }
    public bool FittingRemoveImage { get; set; }
    public bool FittingRemoveMobileImage { get; set; }
    public string? ContactTitleFa { get; set; }
    public string? ContactTitleEn { get; set; }
    public string? ContactBodyFa { get; set; }
    public string? ContactBodyEn { get; set; }
    public string? ContactCtaTextFa { get; set; }
    public string? ContactCtaTextEn { get; set; }
    public string? ContactCtaLink { get; set; }
    public string? ContactImageAltFa { get; set; }
    public string? ContactImageAltEn { get; set; }
    public IFormFile? ContactImage { get; set; }
    public IFormFile? ContactMobileImage { get; set; }
    public bool ContactRemoveImage { get; set; }
    public bool ContactRemoveMobileImage { get; set; }
}

public sealed class UpdateLandingExperienceImageCommand : IRequest<ServiceResult<IdDto>>
{
    public string? CardKey { get; set; }
    public IFormFile? Image { get; set; }
    public IFormFile? MobileImage { get; set; }
    public bool RemoveImage { get; set; }
    public bool RemoveMobileImage { get; set; }
}
