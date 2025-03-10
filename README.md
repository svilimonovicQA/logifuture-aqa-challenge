# Wallet API Test Automation Suite

## Overview

This project contains an automated test suite for the Wallet API service, implementing comprehensive testing of authentication, user information, and wallet transaction functionality. The suite is built using Cypress with TypeScript and includes a mock server for simulating API responses.

## Project Structure

```
├── AQA_Challenge/                      # Challenge documentation
│   ├── API Testing Challenge.txt       # Requirements specification
│   └── WalletApiSpec/                 # API Swagger documentation
├── cypress/
│   │
│   ├── e2e/
│   │   └── tests/                     # Test implementation files
│   │       ├── auth.cy.ts             # Authentication tests
│   │       ├── userInfo.cy.ts         # User information tests
│   │       └── wallet.cy.ts           # Wallet operation tests
│   │
│   ├── fixtures/
│   │   └── mocks/                     # Mock server implementation
│   │       ├── data/                  # Test data files
│   │       │   ├── transaction.ts     # Transaction data
│   │       │   └── user.ts           # User data
│   │       ├── routes/               # Mock API routes
│   │       │   ├── auth.js          # Auth endpoints
│   │       │   ├── userInfo.js      # User info endpoints
│   │       │   └── wallet.js        # Wallet endpoints
│   │       └── server.js            # Mock server configuration
│   │
│   │
│   └── support/                      # Support files
│       ├── commands.ts               # Custom Cypress commands
│       ├── e2e.ts                   # E2E test configuration
│       └── types.ts                 # TypeScript type definitions
│
├── .gitignore                        # Git ignore configuration
├── cypress.config.ts                 # Cypress configuration
├── mock-server.js                    # Main mock server file
├── package.json                      # Project dependencies
├── README.md
├── TESTPLAN.md                         # Project documentation
└── tsconfig.json                     # TypeScript configuration
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/svilimonovicQA/logifuture-aqa-challenge.git
   cd logifuture-aqa-challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The project uses the following configuration files:

- `cypress.config.ts`: Cypress test runner configuration
- `tsconfig.json`: TypeScript compiler settings
- `mock-server.js`: Mock server setup and configuration

## Running Tests

### Start Mock Server

First, start the mock server:

```bash
npm run start:mock
```

The mock server will run on `http://localhost:3000`.

### Run Tests

Run all tests in headless mode:

```bash
npm test
```

Run tests in Cypress Test Runner:

```bash
npm run cypress:open
```

Run specific test file:

```bash
npx cypress run --spec "cypress/e2e/tests/wallet.cy.ts"
```

## Test Organization

### Authentication Tests (`auth.cy.ts`)

- Login functionality
- Token validation
- Error handling for invalid credentials
- Service ID validation

### User Information Tests (`userInfo.cy.ts`)

- User data retrieval
- Wallet association
- Authentication requirements
- Error scenarios

### Wallet Operation Tests (`wallet.cy.ts`)

- Transaction processing
- Balance management
- Input validation
- Error handling

## Mock Server

The mock server (`mock-server.js`) simulates the Wallet API behavior:

- Authentication endpoints
- User information endpoints
- Wallet transaction endpoints
- Data persistence using in-memory storage
- Configurable response delays and errors

### Mock Data

Test data is maintained in TypeScript files under `cypress/fixtures/mocks/data/`:

- `user.ts`: User authentication and profile data
- `transaction.ts`: Transaction templates and data

## Custom Commands

Custom Cypress commands are defined in `cypress/support/commands.ts`:

```typescript
// Authentication
cy.userAuth(username, password, serviceId);

// User Information
cy.getUserInfo(userId, token);

// Wallet Operations
cy.getWallet(walletId, token);
cy.postTransaction(walletId, transaction, token);
cy.getTransaction(walletId, transactionId, token);
cy.getTransactions(walletId, token, options);
```

## Test Data Strategy

- Dynamic data generation using Faker.js
- Isolated test data for each test
- Consistent data structure through TypeScript interfaces
- No hardcoded test values

## Test Plan

Refer to `cypress/e2e/tests/TESTPLAN.md` for:

- Implemented test cases
- Planned test cases
- Test priorities
- Validation criteria

## Technologies Used

- Cypress: E2E testing framework
- JavaScript and TypeScript: Programming language
- Express.js: Mock server framework
- Faker.js: Test data generation
- JWT: Authentication simulation

## LLM Usage Disclosure

This project was developed with assistance from:

- Model: GitHub Copilot
- Usage: Documentation and API code mock
