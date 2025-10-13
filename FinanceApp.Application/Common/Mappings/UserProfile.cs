using AutoMapper;
using FinanceApp.Application.Features.Dtos;
using FinanceApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceApp.Application.Common.Mappings
{
    public class UserProfile : Profile 
    {
        public UserProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}
