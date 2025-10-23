using System;

namespace FinanceApp.Application.Common.Interfaces
{
    public interface ICurrentUserService
    {
        Guid? UserId { get; }
    }
}
