using Application.Dtos;

public static class CategoryTreeBuilder
{
    /// <summary>
    /// Builds the full tree, treating a category whose parent is not in the list
    /// (deleted, inactive or filtered out) as a root so it is never dropped.
    /// </summary>
    public static List<CategoryDto> BuildForest(List<CategoryDto> allCategories)
    {
        var ids = allCategories.Select(c => c.Id).ToHashSet();
        return allCategories
            .Where(c => c.ParentCategoryId == null || !ids.Contains(c.ParentCategoryId.Value))
            .Select(c => CloneWithChildren(c, BuildTree(allCategories, c.Id)))
            .ToList();
    }

    private static CategoryDto CloneWithChildren(CategoryDto c, List<CategoryDto> children) => new()
    {
        Id = c.Id,
        IsActive = c.IsActive,
        CategoryCover = c.CategoryCover,
        EnglishName = c.EnglishName,
        IsShowInLanding = c.IsShowInLanding,
        PersianName = c.PersianName,
        CategoryEnglishDesc = c.CategoryEnglishDesc,
        CategoryPersianDesc = c.CategoryPersianDesc,
        ParentCategoryId = c.ParentCategoryId,
        Slug = c.Slug,
        SeoTitleFa = c.SeoTitleFa,
        SeoTitleEn = c.SeoTitleEn,
        MetaDescriptionFa = c.MetaDescriptionFa,
        MetaDescriptionEn = c.MetaDescriptionEn,
        FaqJson = c.FaqJson,
        SubCategories = children,
    };

    public static List<CategoryDto> BuildTree(List<CategoryDto> allCategories, int? parentId = null)
    {
        return allCategories
.Where(c => parentId == null ? c.ParentCategoryId == null : c.ParentCategoryId == parentId)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                IsActive=c.IsActive,
                CategoryCover = c.CategoryCover,
                EnglishName=c.EnglishName,
                IsShowInLanding = c.IsShowInLanding,
                PersianName=c.PersianName,
                CategoryEnglishDesc=c.CategoryEnglishDesc,
                CategoryPersianDesc=c.CategoryPersianDesc,
                ParentCategoryId = c.ParentCategoryId,
                Slug = c.Slug,
                SeoTitleFa = c.SeoTitleFa,
                SeoTitleEn = c.SeoTitleEn,
                MetaDescriptionFa = c.MetaDescriptionFa,
                MetaDescriptionEn = c.MetaDescriptionEn,
                FaqJson = c.FaqJson,
                SubCategories = BuildTree(allCategories, c.Id)
            })
            .ToList();
    }
}
