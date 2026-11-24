using Api.Controllers;
using Application.Commands;
using Application.Dtos;
using Application.Queries;
using Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LandingFeaturesController(IMediator mediator) : BaseController
{
    private const string AdminRoles = "SuperAdmin,Admin,ContentEditor";

    [HttpGet("public")]
    public async Task<ActionResult<List<LandingFeatureDto>>> GetPublic() =>
        Ok(await mediator.Send(new GetPublicLandingFeaturesQuery()));

    [HttpGet]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ListDto<LandingFeatureDto>>> GetAll([FromQuery] GetAllLandingFeaturesQuery query) =>
        Ok(await mediator.Send(query));

    [HttpGet("{id:int}")]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<LandingFeatureDto>> GetById(int id) =>
        Ok(await mediator.Send(new GetLandingFeatureByIdQuery { Id = id }));

    [HttpPost]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<IdDto>> Create([FromForm] CreateLandingFeatureCommand command) =>
        Respond(await mediator.Send(command));

    [HttpPut]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<IdDto>> Update([FromForm] UpdateLandingFeatureCommand command) =>
        Respond(await mediator.Send(command));

    [HttpPut("active")]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<IdDto>> Active([FromBody] ActiveLandingFeatureCommand command) =>
        Respond(await mediator.Send(command));

    [HttpDelete("{id:int}")]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<IdDto>> Delete(int id) =>
        Respond(await mediator.Send(new DeleteLandingFeatureCommand { Id = id }));

    private ActionResult<IdDto> Respond(ServiceResult<IdDto> result) =>
        result.IsUnauthorized ? Unauthorized(result) : !result.IsSuccess ? BadRequest(result) : Ok(result);
}
