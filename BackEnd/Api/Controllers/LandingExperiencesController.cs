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
public sealed class LandingExperiencesController(IMediator mediator) : ControllerBase
{
    private const string AdminRoles = "SuperAdmin,Admin,ContentEditor";

    [HttpGet("public")]
    public async Task<ActionResult<ServiceResult<LandingExperienceDto>>> Public(CancellationToken ct) =>
        Ok(await mediator.Send(new GetPublicLandingExperienceQuery(), ct));

    [HttpGet]
    [Authorize(Roles = AdminRoles)]
    public async Task<IActionResult> Admin([FromQuery] GetLandingExperienceAdminListQuery query, CancellationToken ct) =>
        query.ByConfig == true ? Ok(await mediator.Send(query, ct)) :
            Ok(await mediator.Send(new GetAdminLandingExperienceQuery(), ct));

    [HttpGet("{id:int}")]
    [Authorize(Roles = AdminRoles)]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetLandingExperienceAdminFormQuery(id), ct);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [Consumes("application/json")]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<IdDto>>> Create([FromBody] CreateLandingExperienceCommand command, CancellationToken ct) =>
        Respond(await mediator.Send(command, ct));

    [HttpPut]
    [Consumes("application/json")]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<IdDto>>> Update([FromBody] UpdateLandingExperienceCommand command, CancellationToken ct) =>
        Respond(await mediator.Send(command, ct));

    [HttpPost]
    [Consumes("multipart/form-data")]
    [ApiExplorerSettings(IgnoreApi = true)] // OpenAPI has a single operation per method/path; keep JSON contract documented.
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<IdDto>>> CreateForm([FromForm] SaveLandingExperienceAdminFormCommand command, CancellationToken ct) =>
        Respond(await mediator.Send(command, ct));

    [HttpPut]
    [Consumes("multipart/form-data")]
    [ApiExplorerSettings(IgnoreApi = true)]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<IdDto>>> UpdateForm([FromForm] SaveLandingExperienceAdminFormCommand command, CancellationToken ct) =>
        Respond(await mediator.Send(command, ct));

    [HttpPut("cards/{cardKey}/image")]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<IdDto>>> Image(string cardKey,
        [FromForm] UpdateLandingExperienceImageCommand command, CancellationToken ct)
    {
        command.CardKey = cardKey;
        return Respond(await mediator.Send(command, ct));
    }

    [HttpDelete]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<IdDto>>> Delete(CancellationToken ct) =>
        Respond(await mediator.Send(new DeleteLandingExperienceCommand(), ct));

    [HttpDelete("{id:int}")]
    [Authorize(Roles = AdminRoles)]
    public async Task<ActionResult<ServiceResult<IdDto>>> DeleteById(int id, CancellationToken ct)
    {
        var current = await mediator.Send(new GetLandingExperienceAdminFormQuery(id), ct);
        return current.IsSuccess ? Respond(await mediator.Send(new DeleteLandingExperienceCommand(), ct)) : NotFound(ServiceResult<IdDto>.Failed("Landing experience not found."));
    }

    private ActionResult<ServiceResult<IdDto>> Respond(ServiceResult<IdDto> result) =>
        result.IsUnauthorized ? Unauthorized(result) : result.IsForbidden ? StatusCode(403, result) :
            !result.IsSuccess ? BadRequest(result) : Ok(result);
}
