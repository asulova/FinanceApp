using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using FinanceApp.Application.DTOs;
using FinanceApp.Application.Common.Models;
using FinanceApp.Domain.Interfaces;

namespace FinanceApp.Application.Features.Transactions.Queries
{
    public class GetTransactionsPagedQueryHandler : IRequestHandler<GetTransactionsPagedQuery, PagedResult<TransactionDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetTransactionsPagedQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<PagedResult<TransactionDto>> Handle(GetTransactionsPagedQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _unitOfWork.Transactions.GetPagedSortedAsync(request.UserId, request.PageNumber, request.PageSize, cancellationToken);
            var totalCount = await _unitOfWork.Transactions.CountByUserAsync(request.UserId, cancellationToken);

            var items = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Date = t.Date,
                Description = t.Description,
                CategoryId = t.CategoryId,
                CategoryName = t.Category != null ? t.Category.Name : string.Empty,
                Type = t.Type
            }).ToList();

            return new PagedResult<TransactionDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }
}
