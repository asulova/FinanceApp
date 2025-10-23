using MediatR;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Categories.Commands;

public class DeleteCategoryCommand : IRequest<Result<bool>>
{
    public int CategoryId { get; set; }
    public DeleteCategoryCommand(int categoryId)
    {
        CategoryId = categoryId;
    }
}
