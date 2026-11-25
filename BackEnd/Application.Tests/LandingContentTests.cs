using System.Security.Claims;
using Application.Commands;
using Application.Handler.CommandHandler;
using Microsoft.AspNetCore.Http;
using OnlineShop.Domain.Common;
using OnlineShop.Domain.Entities;
using Xunit;

namespace Application.Tests;

public sealed class LandingContentTests
{
    private static LandingExperienceCardText Text(string? link) => new(
        "عنوان", "Title", "متن", "Body", "بیشتر", "More", link, "تصویر", "Image");

    [Theory]
    [InlineData("javascript:alert(1)")]
    [InlineData("data:text/html,hello")]
    [InlineData("//evil.example/path")]
    [InlineData("http://example.com")]
    [InlineData("/foo\\bar")]
    public void Experience_card_rejects_unsafe_cta_destinations(string link)
    {
        Assert.Throws<DomainException>(() => LandingExperienceCard.Create("appointment", Text(link), 1));
    }

    [Theory]
    [InlineData("/cooperation")]
    [InlineData("https://example.com/contact")]
    public void Experience_card_accepts_local_or_https_cta(string link)
    {
        var card = LandingExperienceCard.Create("appointment", Text(link), 1);
        Assert.Equal(link, card.CtaLink);
    }

    [Fact]
    public void Experience_card_rejects_unknown_slot()
    {
        Assert.Throws<DomainException>(() => LandingExperienceCard.Create("arbitrary", Text("/faq"), 1));
    }

    [Fact]
    public void Experience_card_partial_update_preserves_other_content()
    {
        var card = LandingExperienceCard.Create("appointment", Text("/faq"), 1);
        card.Update(new LandingExperienceCardText(null, null, null, null, null, null,
            "/cooperation", null, null), 2);

        Assert.Equal("Title", card.TitleEn);
        Assert.Equal("Body", card.BodyEn);
        Assert.Equal("/cooperation", card.CtaLink);
        Assert.Equal("Image", card.ImageAltEn);
    }

    [Fact]
    public void Required_hero_cannot_be_disabled()
    {
        var hero = LandingPageComponent.Create("hero", 0, 1);
        Assert.Throws<DomainException>(() => hero.SetEnabled(false, 1));
        Assert.True(hero.IsEnabled);
    }

    [Theory]
    [InlineData("hero", "products", "products")]
    [InlineData("products", "hero", "features")]
    [InlineData("hero", "products", "unsupported")]
    public async Task Invalid_layout_is_rejected_before_transaction_or_write(
        string first, string second, string third)
    {
        var context = new DefaultHttpContext();
        context.User = new ClaimsPrincipal(new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, "7")], "test"));
        var handler = new LandingPageComponentCommandHandler(null!,
            new HttpContextAccessor { HttpContext = context }, null!);
        var keys = LandingPageComponent.Keys.ToList();
        keys[0] = first;
        keys[1] = second;
        keys[2] = third;

        var result = await handler.Handle(new ReorderLandingPageComponentsCommand { Keys = keys }, default);

        Assert.False(result.IsSuccess);
        Assert.Contains("Order", result.Error);
    }

    [Fact]
    public async Task Required_hero_cannot_be_hidden_by_bulk_update()
    {
        var context = new DefaultHttpContext();
        context.User = new ClaimsPrincipal(new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, "7")], "test"));
        var handler = new LandingPageComponentCommandHandler(null!,
            new HttpContextAccessor { HttpContext = context }, null!);

        var result = await handler.Handle(new ReorderLandingPageComponentsCommand
        {
            Keys = LandingPageComponent.Keys.ToList(),
            Visibility = new Dictionary<string, bool> { ["hero"] = false },
        }, default);

        Assert.False(result.IsSuccess);
        Assert.Contains("hero", result.Error);
    }
}
