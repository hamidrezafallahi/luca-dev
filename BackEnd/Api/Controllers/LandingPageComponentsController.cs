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
public sealed class LandingPageComponentsController(IMediator mediator) : ControllerBase
{
    private const string AdminRoles = "SuperAdmin,Admin,ContentEditor";

    [HttpGet("public")]
    public async Task<ActionResult<ServiceResult<List<LandingPageComponentDto>>>> Public(CancellationToken ct) =>
        Ok(await mediator.Send(new GetPublicLandingPageComponentsQuery(), ct));

    [HttpGet]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<List<LandingPageComponentDto>>>> Admin(CancellationToken ct) =>
        Ok(await mediator.Send(new GetAdminLandingPageComponentsQuery(), ct));

    [HttpPut("order")]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<IdDto>>> Reorder([FromBody] ReorderLandingPageComponentsCommand command, CancellationToken ct) =>
        Respond(await mediator.Send(command, ct));

    [HttpPut("{key}/visibility")]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<IdDto>>> Visibility(string key,
        [FromBody] UpdateLandingPageComponentVisibilityCommand command, CancellationToken ct)
    {
        command.ComponentKey = key;
        return Respond(await mediator.Send(command, ct));
    }

    private ActionResult<ServiceResult<IdDto>> Respond(ServiceResult<IdDto> result) =>
        result.IsUnauthorized ? Unauthorized(result) : result.IsForbidden ? StatusCode(403, result) :
            !result.IsSuccess ? BadRequest(result) : Ok(result);
}
