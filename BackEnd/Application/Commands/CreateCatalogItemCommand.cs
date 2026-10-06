using Application.Dtos;
using Common;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Text.Json.Serialization;

namespace Application.Commands
{
    public class CreateCatalogItemCommand : ProductDimensionsDto, IRequest<ServiceResult<CatalogItemIdsDto>>
    {
        public string Name { get; set; } = default!;
        public string? Slug { get; set; }
        public string Description { get; set; } = default!;
        public string? SeoTitleFa { get; set; }
        public string? SeoTitleEn { get; set; }
        public string? MetaDescriptionFa { get; set; }
        public string? MetaDescriptionEn { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }

        public decimal BasePrice { get; set; }
        public int Inventory { get; set; }

        /// <summary>Loupe magnification (e.g. 3.5) → ProductSpecification «بزرگ‌نمایی».</summary>
        public decimal? Magnification { get; set; }

        /// <summary>Working distance in cm → ProductSpecification «فاصله کاری».</summary>
        public decimal? WorkingDistance { get; set; }

        /// <summary>Field of view in mm → ProductSpecification «میدان دید».</summary>
        public decimal? FieldOfView { get; set; }

        public string? ImageUrl { get; set; }
        public bool ImageIsMain { get; set; } = true;

        [JsonIgnore]
        public IFormFile? ImageFile { get; set; }
    }
}
