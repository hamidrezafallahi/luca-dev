namespace Application.Dtos;

public sealed class LandingExperienceDto
{
    public int Id { get; set; }
    public string TitleFa { get; set; } = "";
    public string TitleEn { get; set; } = "";
    public List<LandingExperienceCardDto> Cards { get; set; } = [];
}

public sealed class LandingExperienceCardDto
{
    public string CardKey { get; set; } = "";
    public string TitleFa { get; set; } = "";
    public string TitleEn { get; set; } = "";
    public string BodyFa { get; set; } = "";
    public string BodyEn { get; set; } = "";
    public string CtaTextFa { get; set; } = "";
    public string CtaTextEn { get; set; } = "";
    public string CtaLink { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public string MobileImageUrl { get; set; } = "";
    public string ImageAltFa { get; set; } = "";
    public string ImageAltEn { get; set; } = "";
}

public sealed class LandingPageComponentDto
{
    public string ComponentKey { get; set; } = "";
    public int DisplayOrder { get; set; }
    public bool IsEnabled { get; set; }
    public bool IsRequired { get; set; }
}
