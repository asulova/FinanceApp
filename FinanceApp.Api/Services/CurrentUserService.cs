using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

using FinanceApp.Application.Common.Interfaces;

namespace FinanceApp.Api.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? UserId
        {
            get
            {
                var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                return Guid.TryParse(userId, out var guid) ? guid : (Guid?)null;
            }
        }
    }
}
