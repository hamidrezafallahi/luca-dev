using Application.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using Services.Services.Uploader;
using Services.Services.Uploader.DTO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.PixelFormats;
using Xunit;

namespace Application.Tests;

public class UploaderServiceTests : IDisposable
{
    private readonly string _webRoot = Directory.CreateDirectory(
        Path.Combine(Path.GetTempPath(), $"uploader-tests-{Guid.NewGuid():N}")).FullName;

    [Theory]
    [InlineData("photo.jpg")]
    [InlineData("photo.png")]
    [InlineData("photo.webp")]
    public async Task Accepted_formats_are_stored_as_webp(string fileName)
    {
        var uploader = new UploaderService(new FakeWebHostEnvironment(_webRoot));

        var stored = await uploader.UploadAsWebp(Upload(Encode(fileName), fileName));

        Assert.True(UploadPaths.IsStoredPath(stored));
        Assert.Equal(WebpFormat.Instance, Image.DetectFormat(Path.Combine(_webRoot, stored!)));
    }

    [Fact]
    public async Task Tiff_named_jpg_is_not_decoded()
    {
        // The decoder is picked from the file's bytes, not its name. A malformed BigTIFF can keep the TIFF
        // decoder looping (GHSA-wmxv-xphr-5c9g), so TIFF must not be decodable at all.
        var uploader = new UploaderService(new FakeWebHostEnvironment(_webRoot));
        using var image = new Image<Rgba32>(4, 4);
        using var tiff = new MemoryStream();
        image.SaveAsTiff(tiff);

        await Assert.ThrowsAsync<UnknownImageFormatException>(
            () => uploader.UploadAsWebp(Upload(tiff.ToArray(), "photo.jpg")));
        Assert.Empty(Directory.GetFiles(_webRoot, "*", SearchOption.AllDirectories));
    }

    public void Dispose()
    {
        try { Directory.Delete(_webRoot, recursive: true); }
        catch { /* best-effort cleanup */ }
    }

    private static byte[] Encode(string fileName)
    {
        using var image = new Image<Rgba32>(4, 4);
        using var output = new MemoryStream();
        switch (Path.GetExtension(fileName))
        {
            case ".jpg": image.SaveAsJpeg(output); break;
            case ".png": image.SaveAsPng(output); break;
            case ".webp": image.SaveAsWebp(output); break;
            default: throw new ArgumentOutOfRangeException(nameof(fileName));
        }

        return output.ToArray();
    }

    private static UploadDTO Upload(byte[] bytes, string fileName) => new()
    {
        Path = UploadPaths.Users(1),
        File = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "UserImageFile", fileName),
    };

    private sealed class FakeWebHostEnvironment(string webRoot) : IWebHostEnvironment
    {
        public string WebRootPath { get; set; } = webRoot;
        public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
        public string ApplicationName { get; set; } = "Application.Tests";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
        public string ContentRootPath { get; set; } = webRoot;
        public string EnvironmentName { get; set; } = "Testing";
    }
}
