using OnlineShop.Domain.Common;
using Application.Commands;
using Application.Common;
using Application.Common.Interfaces;
using Application.Dtos;
using Common;
using MediatR;
using Microsoft.AspNetCore.Http;
using OnlineShop.Domain.Entities;
using OnlineShop.Domain.Interfaces;
using Services.Services.Uploader.DTO;

namespace Application.Handler.CommandHandler
{
    public class CreateCatalogItemCommandHandler(
        IProductRepository productRepository,
        IProductOfferRepository offerRepository,
        IProductImageRepository imageRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor accessor,
        IUploaderService uploaderService)
        : IRequestHandler<CreateCatalogItemCommand, ServiceResult<CatalogItemIdsDto>>
    {
        public async Task<ServiceResult<CatalogItemIdsDto>> Handle(
            CreateCatalogItemCommand request,
            CancellationToken cancellationToken)
        {
            var userId = accessor.HttpContext?.GetUserId();
            if (userId == null)
                return ServiceResult<CatalogItemIdsDto>.Unauthorized();

            var validationError = Validate(request);
            if (validationError != null)
                return ServiceResult<CatalogItemIdsDto>.Failed(validationError);

            if (await productRepository.ExistsByNameAndBrandAsync(request.Name, request.BrandId))
                return ServiceResult<CatalogItemIdsDto>.Failed("محصولی با همین نام و برند از قبل وجود دارد.");

            await using var transaction = await unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                var product = Product.Create(
                    name: request.Name,
                    description: request.Description,
                    categoryId: request.CategoryId,
                    brandId: request.BrandId,
                    currentUserId: userId.Value,
                    slug: request.Slug,
                    seoTitleFa: request.SeoTitleFa,
                    seoTitleEn: request.SeoTitleEn,
                    metaDescriptionFa: request.MetaDescriptionFa,
                    metaDescriptionEn: request.MetaDescriptionEn);
                product.SetActive(false, userId.Value);

                await productRepository.AddAsync(product);
                await productRepository.SaveChangesAsync(cancellationToken);

                var baseSlug = string.IsNullOrWhiteSpace(request.Slug)
                    ? OnlineShop.Domain.Common.SlugHelper.Generate(request.Name, product.Id)
                    : OnlineShop.Domain.Common.SlugHelper.Generate(request.Slug, product.Id);
                if (!string.Equals(product.Slug, baseSlug, StringComparison.OrdinalIgnoreCase)
                    || await productRepository.ExistsBySlugAsync(product.Slug, product.Id))
                {
                    product.EnsureSlug(product.Id);
                    await productRepository.SaveChangesAsync(cancellationToken);
                }

                ApplyLoupeSpecifications(product, request);

                ProductImage? image = null;
                var storedImageUrl = await ResolveImageUrl(request, product.Id);
                if (!string.IsNullOrWhiteSpace(storedImageUrl))
                {
                    image = ProductImage.Create(
                        productId: product.Id,
                        imageUrl: storedImageUrl,
                        isMain: request.ImageIsMain,
                        currentUserId: userId.Value);
                    image.SetActive(false, userId.Value);
                    await imageRepository.AddAsync(image);
                }

                var offer = ProductOffers.Create(
                    productId: product.Id,
                    supplierId: userId.Value,
                    basePrice: request.BasePrice,
                    inventory: request.Inventory,
                    currentUserId: userId.Value);
                offer.SetActive(false, userId.Value);

                await offerRepository.AddAsync(offer);
                await offerRepository.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                return ServiceResult<CatalogItemIdsDto>.Ok(new CatalogItemIdsDto
                {
                    ProductId = product.Id,
                    OfferId = offer.Id,
                    ImageId = image?.Id
                });
            }
            catch (DomainException ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return ServiceResult<CatalogItemIdsDto>.Failed(ex.Message, ex.Code);
            }
            catch
            {
                // Nothing was kept; the error middleware reports what happened.
                await transaction.RollbackAsync(CancellationToken.None);
                throw;
            }
        }

        private static string? Validate(CreateCatalogItemCommand request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return "نام محصول نمی‌تواند خالی باشد.";
            if (request.CategoryId <= 0)
                return "انتخاب دسته‌بندی الزامی است.";
            if (request.BrandId <= 0)
                return "انتخاب برند الزامی است.";
            if (request.BasePrice <= 0)
                return "قیمت پایهٔ پیشنهاد باید بیشتر از صفر باشد.";
            if (request.Inventory < 0)
                return "موجودی پیشنهاد نمی‌تواند منفی باشد.";
            if (request.Magnification is < 0)
                return "بزرگ‌نمایی نمی‌تواند منفی باشد.";
            if (request.WorkingDistance is < 0)
                return "فاصلهٔ کاری نمی‌تواند منفی باشد.";
            if (request.FieldOfView is < 0)
                return "میدان دید نمی‌تواند منفی باشد.";
            return null;
        }

        private static void ApplyLoupeSpecifications(Product product, CreateCatalogItemCommand request)
        {
            if (request.Magnification is > 0)
                product.AddSpecification(LoupeCatalogSpecs.MagnificationKey, LoupeCatalogSpecs.FormatMagnification(request.Magnification.Value));

            if (request.WorkingDistance is > 0)
                product.AddSpecification(LoupeCatalogSpecs.WorkingDistanceKey, LoupeCatalogSpecs.FormatCm(request.WorkingDistance.Value));

            if (request.FieldOfView is > 0)
                product.AddSpecification(LoupeCatalogSpecs.FieldOfViewKey, LoupeCatalogSpecs.FormatMm(request.FieldOfView.Value));
        }

        private async Task<string?> ResolveImageUrl(CreateCatalogItemCommand request, int productId)
        {
            if (request.ImageFile is { Length: > 0 })
            {
                var uploaded = await uploaderService.UploadAsWebp(new UploadDTO
                {
                    File = request.ImageFile,
                    Path = UploadPaths.Products(productId)
                });
                if (!UploadPaths.IsStoredPath(uploaded))
                    throw new FileUploadException("آپلود تصویر محصول انجام نشد.");

                return UploadPaths.Normalize(uploaded);
            }

            return string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl.Trim();
        }
    }
}
