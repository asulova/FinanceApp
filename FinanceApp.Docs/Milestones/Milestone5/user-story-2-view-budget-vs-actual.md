# User Story 2: View Budget vs Actual

**As a** user,
**I want to** view my budget vs actual spending for each category,
**so that** I can track my progress.

## Acceptance Criteria
- User can see budgeted amount and actual spending for each category
- Visual indicators for over/under budget
- Data updates in real time or on refresh
- Budget vs Actual is accessible by clicking on a budget in the Budgets list (not from main menu)
- Period dates are derived from the selected budget and are not user-editable

## Notes

### Design Approach
The budget represents the **overall total spending limit** for a period (e.g., monthly budget of $2,000). The actual spending is then **grouped by category** to show how the total budget is being consumed across different spending categories.

### Navigation Pattern
Budget vs Actual is accessed directly from the Budgets list:
- **No Main Menu Link**: Budget vs Actual is not accessible from the main navigation menu
- **Accessible from Budgets List**: Users click on a budget row in the budgets list to view its vs actual comparison
- **No Intermediate Details Page**: Budget details page has been removed as redundant
- **Context-Aware**: The period dates are automatically derived from the selected budget's `periodStart` and `periodEnd`
- **Non-Editable Dates**: Users cannot modify the period dates; they are fixed to the budget's period

### Key Concepts
- **One Budget Per Period**: A single budget amount covers all spending for the specified time period
- **Category Breakdown**: Actual spending is grouped by category to show distribution
- **Total Comparison**: Sum of all category spending is compared against the overall budget
- **Budget-Specific View**: Each budget has its own vs actual view tied to its specific period

### Data Model
- Budget: Contains UserId, Amount, PeriodStart, PeriodEnd (no CategoryId)
- Transactions: Filtered by Type = "EXPENSE", grouped by CategoryId, summed by Amount

### Calculation Logic
1. Retrieve the user's budget by ID (from route parameter)
2. Get all EXPENSE transactions for the budget's period (using budget.periodStart and budget.periodEnd)
3. Group transactions by CategoryId and calculate sum for each category
4. Calculate total spending across all categories
5. Compute variance: `BudgetAmount - TotalSpending`
6. Compute percentage used: `(TotalSpending / BudgetAmount) * 100`
7. Determine budget status based on percentage used

### Visual Indicators (Status)
- ? **Under Budget**: < 90% used (Green)
- ?? **Approaching Budget**: 90-100% used (Yellow/Warning)
- ? **Over Budget**: > 100% used (Red/Danger)

### Backend Implementation

#### New DTOs
- `CategorySpendingDto`: CategoryId, CategoryName, Amount, PercentageOfTotal
- `BudgetVsActualDto`: BudgetId, BudgetAmount, TotalSpending, Variance, PercentageUsed, Status, PeriodStart, PeriodEnd, CategoryBreakdown

#### New Query
- `GetBudgetVsActualQuery`: Accepts BudgetId (period dates derived from budget)
- `GetBudgetVsActualQueryHandler`: Retrieves budget and spending data, performs calculations

#### Repository Methods
- `IBudgetRepository.GetByIdAsync()`: Get budget by ID (includes period dates)
- `ITransactionRepository.GetSpendingByCategoryAsync()`: Get spending grouped by category for a period

#### API Endpoint
- `GET /api/budgets/{id}/vs-actual` (RESTful pattern - vs actual as a sub-resource of a specific budget)
- Returns: `Result<BudgetVsActualDto>`
- Period dates are extracted from the budget entity, not from query parameters

### Frontend Implementation

#### Navigation Flow
1. User visits Budgets List page (`/budgets`)
2. User clicks on a budget row in the table
3. User is taken directly to Budget vs Actual page (`/budgets/{id}/vs-actual`)
4. Page displays comparison using the budget's fixed period dates
5. User can click "Back to Budgets" to return to the list

#### Modified Components
- **BudgetsListPage**: Budget rows are clickable and navigate to `/budgets/{id}/vs-actual`

#### Removed Components
- **BudgetDetailsPage**: Removed as redundant (budget information is shown in vs-actual page)

#### New Components
- **BudgetSummaryCard**: Displays overall budget status with progress bar
  - Shows budget amount, total spending, remaining/overspent amount
  - Color-coded progress bar based on percentage used
  - Status badge (Under/Approaching/Over Budget)
  - **Displays period dates (read-only)**

- **CategorySpendingList**: Displays category-wise spending breakdown
  - Table/list showing each category with amount spent
  - Percentage of total spending for each category
  - Sorted by amount (highest to lowest)
  - Visual indicators (bars or charts)

- **BudgetVsActualPage**: Main page combining summary and breakdown
- **No date range selector** (dates are derived from budget)
- Displays period information prominently (read-only)
- Displays BudgetSummaryCard
- Displays CategorySpendingList
- Back button to return to Budgets List
- Manual refresh button to update data

#### API Integration
- New function: `getBudgetVsActualById(budgetId, token)`
- Uses existing authentication and error handling patterns
- Period dates are not passed as parameters

### Example UI Layout
```
???????????????????????????????????????????????
?  [? Back to Budgets]                        ?
?  Budget vs Actual                           ?
?  Period: Jan 1, 2024 - Jan 31, 2024        ?
???????????????????????????????????????????????
?  Budget Summary                       [?]   ?
?  ????????????????????????????????????????? ?
?  ? Budget: $2,000.00                     ? ?
?  ? Spent:  $1,750.00                     ? ?
?  ? Remaining: $250.00                    ? ?
?  ? [??????????????????] 87.5% Used      ? ?
?  ? Status: ?? Approaching Budget         ? ?
?  ????????????????????????????????????????? ?
?                                             ?
?  Spending by Category                       ?
?  ????????????????????????????????????????? ?
?  ? Groceries        $800.00  (45.7%)     ? ?
?  ? Utilities        $400.00  (22.9%)     ? ?
?  ? Entertainment    $300.00  (17.1%)     ? ?
?  ? Transportation   $250.00  (14.3%)     ? ?
?  ????????????????????????????????????????? ?
???????????????????????????????????????????????
```

### Technical Considerations
- Period dates are extracted from the budget entity (not user input)
- Handle case when budget exists but no transactions (0% used)
- Ensure only EXPENSE transactions are counted (not INCOME)
- Category names should be fetched via join/include in the query
- Frontend should provide manual refresh option
- Use consistent date formatting across frontend and backend
- Route pattern: `/budgets/{id}/vs-actual` (RESTful sub-resource)
- Budget ID is used to fetch both budget details and related transactions

### Testing Requirements
- Unit tests for GetBudgetVsActualQueryHandler
- Test scenarios: valid budget ID, no transactions, over budget, under budget, invalid budget ID
- Integration tests for the API endpoint
- Frontend component tests for visual indicators
- End-to-end test for complete user flow (budgets list ? vs actual)
