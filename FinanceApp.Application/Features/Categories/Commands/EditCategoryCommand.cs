using MediatR;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Categories.Commands;

public class EditCategoryCommand : IRequest<Result<bool>>
{
    public int CategoryId { get; set; }
    public string? Description { get; set; }
    public EditCategoryCommand(int categoryId, string? description)
    {
        CategoryId = categoryId;
        Description = description;
    }
}
