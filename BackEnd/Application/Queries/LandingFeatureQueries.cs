using Application.Dtos;
using Common;
using MediatR;

namespace Application.Queries;

public class GetAllLandingFeaturesQuery : BaseListDto, IRequest<ServiceResult<ListDto<LandingFeatureDto>>> { }
public class GetLandingFeatureByIdQuery : IRequest<ServiceResult<LandingFeatureDto>> { public int Id { get; set; } }
public class GetPublicLandingFeaturesQuery : IRequest<ServiceResult<List<LandingFeatureDto>>> { }
