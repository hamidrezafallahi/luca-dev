using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Application.Dtos;
using Application.Queries;
using Common;
using Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using WebApi.Controllers;
using Xunit;

namespace Application.Tests;

/// <summary>
/// The contact inbox holds visitors' names, phone numbers, addresses and messages, so only
/// staff may list it. Runs the real controller behind the same JWT checks as Program.cs,
/// with tokens signed by JwtService as the login handler does.
/// </summary>
public class ContactRequestsAuthorizationTests
{
    // What the admin list page (app/[locale]/admin/[field]) requests.
    private const string ListUrl = "/api/contactRequests?page=1&pageSize=10&byConfig=true&onlyActives=false";
    private const string JwtKey = "contact-requests-tests-signing-key-long-enough-for-hmac-sha-512!!";
    private const string JwtIssuer = "luca-tests";
    private const string JwtAudience = "luca-tests";

    [Fact]
    public async Task Anonymous_list_call_gets_401_and_reads_nothing()
    {
        var mediator = new FakeMediator();
        await using var app = await StartApiAsync(mediator);

        var response = await app.GetTestClient().GetAsync(ListUrl);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Empty(mediator.Sent);
    }

    [Theory]
    [InlineData("SuperAdmin")]
    [InlineData("Admin")]
    [InlineData("Support")]
    public async Task Staff_list_call_gets_200(string role)
    {
        var mediator = new FakeMediator();
        await using var app = await StartApiAsync(mediator);

        var response = await GetListAsAsync(app, role);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.IsType<GetAllContactRequestsQuery>(Assert.Single(mediator.Sent));
    }

    [Fact]
    public async Task Logged_in_customer_gets_403_and_reads_nothing()
    {
        var mediator = new FakeMediator();
        await using var app = await StartApiAsync(mediator);

        var response = await GetListAsAsync(app, "Customer");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.Empty(mediator.Sent);
    }

    private static async Task<WebApplication> StartApiAsync(IMediator mediator)
    {
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Services.AddControllers().AddApplicationPart(typeof(ContactRequestsController).Assembly);
        builder.Services.AddSingleton<IMediator>(mediator);
        builder.Services.AddAuthentication("Bearer")
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = JwtIssuer,
                    ValidAudience = JwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey))
                };
            });
        builder.Services.AddAuthorization();

        var app = builder.Build();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        await app.StartAsync();
        return app;
    }

    private static Task<HttpResponseMessage> GetListAsAsync(WebApplication app, string role)
    {
        var jwtConfig = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = JwtKey,
                ["Jwt:Issuer"] = JwtIssuer,
                ["Jwt:Audience"] = JwtAudience,
            })
            .Build();

        // The claims the login handler puts in an access token.
        var token = new JwtService(jwtConfig).GenerateToken(
        [
            new Claim(ClaimTypes.NameIdentifier, "7"),
            new Claim(ClaimTypes.Name, "Test User"),
            new Claim(ClaimTypes.Email, "user@example.com"),
            new Claim(ClaimTypes.Role, role)
        ]);

        var request = new HttpRequestMessage(HttpMethod.Get, ListUrl);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return app.GetTestClient().SendAsync(request);
    }

    private sealed class FakeMediator : IMediator
    {
        public List<object> Sent { get; } = [];

        public Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default)
        {
            Sent.Add(request);
            object result = ServiceResult<ListDto<ContactRequestDto>>.Ok(
                new ListDto<ContactRequestDto> { PageNumber = 1, PageSize = 10 });
            return Task.FromResult((TResponse)result);
        }

        public Task Send<TRequest>(TRequest request, CancellationToken cancellationToken = default) where TRequest : IRequest
            => throw new NotSupportedException();

        public Task<object?> Send(object request, CancellationToken cancellationToken = default)
            => throw new NotSupportedException();

        public IAsyncEnumerable<TResponse> CreateStream<TResponse>(IStreamRequest<TResponse> request, CancellationToken cancellationToken = default)
            => throw new NotSupportedException();

        public IAsyncEnumerable<object?> CreateStream(object request, CancellationToken cancellationToken = default)
            => throw new NotSupportedException();

        public Task Publish(object notification, CancellationToken cancellationToken = default)
            => throw new NotSupportedException();

        public Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default) where TNotification : INotification
            => throw new NotSupportedException();
    }
}
