namespace Application.Dtos;

public class LandingFeatureDto
{
    public int Id { get; set; }
    public bool IsActive { get; set; }
    public string ImageUrl { get; set; } = "";
    public string EyebrowFa { get; set; } = "";
    public string EyebrowEn { get; set; } = "";
    public string TitleFa { get; set; } = "";
    public string TitleEn { get; set; } = "";
    public string BodyFa { get; set; } = "";
    public string BodyEn { get; set; } = "";
    public string LinkTextFa { get; set; } = "";
    public string LinkTextEn { get; set; } = "";
    public string LinkUrl { get; set; } = "";
    public int DisplayOrder { get; set; }
    public bool Reverse { get; set; }
}
