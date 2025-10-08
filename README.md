# FinanceApp – Personal Budgeting App

FinanceApp is a personal finance application to track income and expenses, built with a .NET Core Web API backend and a React frontend.  
The project demonstrates the use of CQRS, the Mediator pattern (MediatR), SOLID principles, and unit testing.  

---

## Tech Stack

**Backend (API):**  
- .NET 8 Web API  
- CQRS + MediatR  
- Entity Framework Core (with migrations)  
- FluentValidation (for request validation)  
- xUnit / NUnit (unit tests)  

**Frontend (UI):**  
- React (Vite or Create React App)  
- React Router  
- Axios (API calls)  
- TailwindCSS or Material UI (for styling)  
- Jest / React Testing Library (unit tests)  
- FinanceApp.UI/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route components
│   ├── layouts/       # Layout wrappers
│   ├── hooks/         # Custom hooks
│   ├── services/      # API integration
│   ├── stores/        # State management
│   ├── utils/         # Helper functions
│   ├── types/         # TypeScript definitions
│   └── test/          # Test setup
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Custom design system
└── tsconfig.json      # TypeScript config

**Database:**  
- SQL Server (default)  
- PostgreSQL / SQLite (optional, can be configured)  

> By default, FinanceApp uses SQL Server. To use another database, update the connection string in the backend configuration.

---

## Features (Step-by-Step UI + API)  

1. **Authentication**  
   - React: Login & Register pages  
   - Backend: JWT authentication, users table  

2. **Dashboard**  
   - Shows total balance, income vs expenses  
   - React: basic charts (Recharts or Chart.js)  
   - Backend: aggregates transactions  

3. **Transactions (CQRS in action)**  
   - Create Transaction (Income / Expense)  
   - List Transactions (by month, category)  
   - Update Transaction  
   - Delete Transaction  

4. **Categories**  
   - Add, Edit, Delete categories  
   - Assign category to transaction  

5. **Reports**  
   - Monthly income vs expenses chart  
   - Top 5 categories spending  

---

## Project Structure  

### Backend (`/FinanceApp.Api`)
```
FinanceApp.Api/
│── Controllers/
│── Commands/ (CQRS - Write)
│── Queries/  (CQRS - Read)
│── Domain/   (Entities, Value Objects)
│── Infrastructure/ (EF Core, DB Config)
│── Application/ (MediatR Handlers, Validators)
│── Tests/
```

### Frontend (`/finance-app-ui`)
```
finance-app-ui/
│── src/
│   ├── components/
│   ├── pages/
│   ├── services/ (API calls)
│   ├── context/ (Auth, State)
│   ├── App.jsx
│── tests/
```

---

## Learning Goals

**Backend:**  
- Implement CQRS + MediatR in .NET Core  
- Apply SOLID design principles  
- Write unit and integration tests  

**Frontend:**  
- Build a step-by-step React UI (start small, expand features)  
- Connect React with .NET API using Axios  
- Test UI components with Jest and React Testing Library  
