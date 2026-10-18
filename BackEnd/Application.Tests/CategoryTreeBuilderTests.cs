using Application.Dtos;
using Xunit;

namespace Application.Tests;

public class CategoryTreeBuilderTests
{
    private static CategoryDto Cat(int id, int? parentId) => new() { Id = id, ParentCategoryId = parentId };

    [Fact]
    public void BuildForest_TreatsCategoriesWithMissingParentAsRoots()
    {
        // Parent 1 was deleted, so it is not in the list.
        var categories = new List<CategoryDto> { Cat(2, 1), Cat(3, 1), Cat(4, 2) };

        var forest = CategoryTreeBuilder.BuildForest(categories);

        Assert.Equal(new[] { 2, 3 }, forest.Select(c => c.Id));
        Assert.Equal(4, Assert.Single(forest[0].SubCategories).Id);
    }

    [Fact]
    public void BuildForest_KeepsChildrenUnderTheirParent()
    {
        var categories = new List<CategoryDto> { Cat(1, null), Cat(2, 1), Cat(3, null) };

        var forest = CategoryTreeBuilder.BuildForest(categories);

        Assert.Equal(new[] { 1, 3 }, forest.Select(c => c.Id));
        Assert.Equal(2, Assert.Single(forest[0].SubCategories).Id);
    }
}
