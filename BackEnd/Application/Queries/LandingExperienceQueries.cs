using Application.Dtos;
using Common;
using MediatR;

namespace Application.Queries;

public sealed record GetPublicLandingExperienceQuery : IRequest<ServiceResult<LandingExperienceDto>>;
public sealed record GetAdminLandingExperienceQuery : IRequest<ServiceResult<LandingExperienceDto>>;
public sealed class GetLandingExperienceAdminListQuery : BaseListDto, IRequest<ServiceResult<ListDto<Dictionary<string, object?>>>> { }
public sealed record GetLandingExperienceAdminFormQuery(int Id) : IRequest<ServiceResult<Dictionary<string, object?>>>;
public sealed record GetPublicLandingPageComponentsQuery : IRequest<ServiceResult<List<LandingPageComponentDto>>>;
public sealed record GetAdminLandingPageComponentsQuery : IRequest<ServiceResult<List<LandingPageComponentDto>>>;
