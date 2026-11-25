using Common;
using MediatR;

namespace Application.Commands;

public sealed class ReorderLandingPageComponentsCommand : IRequest<ServiceResult<IdDto>>
{
    public List<string> Keys { get; set; } = [];
    public Dictionary<string, bool>? Visibility { get; set; }
}

public sealed class UpdateLandingPageComponentVisibilityCommand : IRequest<ServiceResult<IdDto>>
{
    public string? ComponentKey { get; set; }
    public bool IsEnabled { get; set; }
}
