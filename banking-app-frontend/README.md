# Banking Application

This is a banking application that allows users to manage their accounts, perform transactions, and view transaction history.

## Features

- **Dashboard**: Users can view their accounts and total balance.
- **Deposit/Withdraw**: Users can deposit or withdraw funds from their accounts.
- **Transfer Money**: Users can transfer money between accounts.
- **Transaction History**: Users can view the transaction history for their accounts.
- **Transaction Details**: Users can view detailed information about specific transactions.

## Project Structure

```
banking-app-frontend
├── src
│   ├── app
│   │   ├── page.tsx                  # Main dashboard page
│   │   ├── transaction-history
│   │   │   └── page.tsx              # Transaction history page
│   │   └── transaction-details
│   │       └── [transactionId]
│   │           └── page.tsx          # Transaction details page
├── package.json                       # NPM configuration file
├── tsconfig.json                      # TypeScript configuration file
└── README.md                          # Project documentation
```

## API Endpoints

- **Fetch Accounts**: `GET /api/bank/show_accounts`
- **Fetch Total Balance**: `GET /api/bank/account/view_total_balance`
- **Deposit Funds**: `POST /api/bank/account/deposit`
- **Withdraw Funds**: `POST /api/bank/account/withdraw`
- **Transfer Funds**: `POST /api/bank/transaction/transfer`
- **Transaction History**: `GET /api/bank/transaction/transaction_history?bankAccountNumber={{currentAccountNumber}}`
- **Transaction Details**: `GET /api/bank/transaction/transaction_detail?transactionId={{transactionId}}`

## Getting Started

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Start the application using `npm start`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.