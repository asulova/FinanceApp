using FinanceApp.Application.DTOs;
using MediatR;
using System.Collections.Generic;

namespace FinanceApp.Application.Features.Categories.Queries;

public class GetAllCategoriesQuery : IRequest<List<CategoryDto>>
{
}
