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

public sealed class UpdateLandingExperienceImageCommand : IRequest<ServiceResult<IdDto>>
{
    public string? CardKey { get; set; }
    public IFormFile? Image { get; set; }
    public IFormFile? MobileImage { get; set; }
    public bool RemoveImage { get; set; }
    public bool RemoveMobileImage { get; set; }
}
