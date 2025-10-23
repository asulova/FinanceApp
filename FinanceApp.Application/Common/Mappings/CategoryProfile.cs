using AutoMapper;
using FinanceApp.Application.DTOs;
using FinanceApp.Domain.Entities;

namespace FinanceApp.Application.Common.Mappings;

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        CreateMap<Category, CategoryDto>();
    }
}
