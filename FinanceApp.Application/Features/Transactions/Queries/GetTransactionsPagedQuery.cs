using MediatR;
using FinanceApp.Application.DTOs;
using System;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Transactions.Queries
{
    public class GetTransactionsPagedQuery : IRequest<PagedResult<TransactionDto>>
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public GetTransactionsPagedQuery(Guid userId, int pageNumber, int pageSize)
        {
            UserId = userId;
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
    }
}
