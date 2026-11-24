using Common;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Commands;

public class CreateLandingFeatureCommand : IRequest<ServiceResult<IdDto>>
{
    public IFormFile? ImageUrl { get; set; }
    public string? EyebrowFa { get; set; }
    public string? EyebrowEn { get; set; }
    public string? TitleFa { get; set; }
    public string? TitleEn { get; set; }
    public string? BodyFa { get; set; }
    public string? BodyEn { get; set; }
    public string? LinkTextFa { get; set; }
    public string? LinkTextEn { get; set; }
    public string? LinkUrl { get; set; }
    public int? DisplayOrder { get; set; }
    public bool? Reverse { get; set; }
}

public class UpdateLandingFeatureCommand : CreateLandingFeatureCommand, IRequest<ServiceResult<IdDto>>
{
    public int Id { get; set; }
    public bool RemoveImage { get; set; }
}

public class ActiveLandingFeatureCommand : ActiveCommand, IRequest<ServiceResult<IdDto>> { }
public class DeleteLandingFeatureCommand : IRequest<ServiceResult<IdDto>> { public int Id { get; set; } }
