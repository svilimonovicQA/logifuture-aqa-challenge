const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");

/**
 * Wallet Service Mock
 *
 * This module provides mock endpoints for wallet operations including:
 * - Wallet information retrieval
 * - Transaction creation and management
 * - Balance tracking across multiple currencies
 */

// Constants
const SUPPORTED_CURRENCIES = ["EUR", "USD", "GBP"];
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TRANSACTION_TYPES = ["credit", "debit"];
const TRANSACTION_STATUSES = ["pending", "finished"];
const TRANSACTION_OUTCOMES = ["approved", "denied"];
const LARGE_TRANSACTION_THRESHOLD = 1000;

/**
 * Validates a UUID string
 *
 * @param {string} uuid - The UUID to validate
 * @returns {boolean} Whether the UUID is valid
 */
const isValidUUID = (uuid) => UUID_REGEX.test(uuid);

/**
 * Validates the transaction request body
 *
 * @param {Object} body - The transaction body to validate
 * @param {number} body.amount - The transaction amount
 * @param {string} body.currency - The transaction currency
 * @param {string} body.type - The transaction type (credit/debit)
 * @returns {Object} Validation result with isValid flag and optional error message
 */
const validateTransactionBody = (body) => {
  const { amount, currency, type } = body;

  if (typeof amount !== "number") {
    return { isValid: false, error: "Amount must be a number" };
  }

  if (amount <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }

  if (!currency || !SUPPORTED_CURRENCIES.includes(currency)) {
    return {
      isValid: false,
      error: `Currency must be one of: ${SUPPORTED_CURRENCIES.join(", ")}`,
    };
  }

  if (!type || !TRANSACTION_TYPES.includes(type)) {
    return {
      isValid: false,
      error: `Transaction type must be one of: ${TRANSACTION_TYPES.join(", ")}`,
    };
  }

  return { isValid: true };
};

// Wallet balance management
const walletBalances = new Map();

/**
 * Generates or retrieves a currency clip for a wallet
 *
 * @param {string} currency - The currency code
 * @param {string} walletId - The wallet identifier
 * @returns {Object} Currency clip with balance and transaction info
 */
const generateCurrencyClip = (currency, walletId) => {
  const key = `${walletId}-${currency}`;
  if (!walletBalances.has(key)) {
    walletBalances.set(key, 0);
  }

  return {
    currency,
    balance: walletBalances.get(key),
    lastTransaction: faker.date.recent().toISOString(),
    transactionCount: faker.number.int({ min: 1, max: 100 }),
  };
};

/**
 * Updates a wallet's balance for a given currency
 *
 * @param {string} walletId - The wallet identifier
 * @param {string} currency - The currency code
 * @param {number} amount - The transaction amount
 * @param {string} type - The transaction type (credit/debit)
 */
const updateWalletBalance = (walletId, currency, amount, type) => {
  const key = `${walletId}-${currency}`;
  const currentBalance = walletBalances.get(key) || 0;
  const newBalance =
    type === "credit" ? currentBalance + amount : currentBalance - amount;
  walletBalances.set(key, newBalance);
};

/**
 * Generates currency clips for all supported currencies
 *
 * @param {string} walletId - The wallet identifier
 * @returns {Array<Object>} Array of currency clips
 */
const generateCurrencyClips = (walletId) =>
  SUPPORTED_CURRENCIES.map((currency) =>
    generateCurrencyClip(currency, walletId)
  );

/**
 * Generates a transaction with specified parameters
 *
 * @param {Object} options - Transaction generation options
 * @param {string} [options.createdAt] - Transaction creation timestamp
 * @param {boolean} [options.shouldDelay] - Whether to mark as pending
 * @param {Object} [options.override] - Properties to override in generated transaction
 * @returns {Object} Generated transaction object
 */
const generateTransaction = ({
  createdAt = faker.date.recent().toISOString(),
  shouldDelay = false,
  override = {},
} = {}) => {
  const status = shouldDelay ? "pending" : "finished";
  const transaction = {
    transactionId: faker.string.uuid(),
    currency: faker.helpers.arrayElement(SUPPORTED_CURRENCIES),
    amount: parseFloat(faker.finance.amount(1, 10000, 2)),
    type: faker.helpers.arrayElement(TRANSACTION_TYPES),
    status,
    createdAt,
    ...override,
  };

  if (status === "finished") {
    transaction.outcome = faker.helpers.arrayElement(TRANSACTION_OUTCOMES);
    transaction.updatedAt = faker.date
      .between({
        from: transaction.createdAt,
        to: new Date(),
      })
      .toISOString();
  }

  return transaction;
};

// Route Handlers

/**
 * GET /wallet/{walletId}
 * Retrieves wallet information including currency clips
 */
router.get("/:walletId", (request, response) => {
  const { walletId } = request.params;

  if (!isValidUUID(walletId)) {
    return response.status(400).json({
      error: "Invalid wallet ID format",
    });
  }

  const createdAt = faker.date.past().toISOString();
  const updatedAt = faker.date
    .between({
      from: createdAt,
      to: new Date(),
    })
    .toISOString();

  response.json({
    walletId,
    currencyClips: generateCurrencyClips(walletId),
    createdAt,
    updatedAt,
  });
});

/**
 * GET /wallet/{walletId}/transaction/{transactionId}
 * Retrieves information about a specific transaction
 */
router.get("/:walletId/transaction/:transactionId", (request, response) => {
  const { walletId, transactionId } = request.params;

  if (!isValidUUID(walletId)) {
    return response.status(400).json({
      error: "Invalid wallet ID format",
    });
  }

  if (!isValidUUID(transactionId)) {
    return response.status(400).json({
      error: "Invalid transaction ID format",
    });
  }

  const transaction = generateTransaction({
    override: { transactionId },
  });

  response.json(transaction);
});

/**
 * GET /wallet/{walletId}/transactions
 * Retrieves paginated transaction history with optional date filtering
 */
router.get("/:walletId/transactions", (request, response) => {
  const { walletId } = request.params;
  const { page = 1, startDate, endDate } = request.query;

  if (!isValidUUID(walletId)) {
    return response.status(400).json({
      error: "Invalid wallet ID format",
    });
  }

  const totalCount = faker.number.int({ min: 10, max: 100 });
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = Math.min(parseInt(page), totalPages);

  let transactions = Array.from({ length: pageSize }, () => {
    const createdAt =
      startDate && endDate
        ? faker.date
            .between({
              from: new Date(startDate),
              to: new Date(endDate),
            })
            .toISOString()
        : faker.date.recent().toISOString();

    return generateTransaction({ createdAt });
  });

  transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (startDate && endDate) {
    transactions = transactions.filter(
      (t) =>
        new Date(t.createdAt) >= new Date(startDate) &&
        new Date(t.createdAt) <= new Date(endDate)
    );
  }

  response.json({
    transactions,
    totalCount,
    currentPage,
    totalPages,
  });
});

/**
 * POST /wallet/{walletId}/transaction
 * Creates a new transaction and updates wallet balance
 */
router.post("/:walletId/transaction", (request, response) => {
  const { walletId } = request.params;

  if (!isValidUUID(walletId)) {
    return response.status(400).json({
      error: "Invalid wallet ID format",
    });
  }

  const validation = validateTransactionBody(request.body);
  if (!validation.isValid) {
    return response.status(400).json({
      error: validation.error,
    });
  }

  const { amount, currency, type } = request.body;
  let status = "finished";
  let outcome = "approved";
  const createdAt = new Date().toISOString();

  if (type === "credit") {
    if (amount > 1000) {
      status = "pending";
      outcome = "approved";
    } else if (amount >= 100 && amount <= 1000) {
      status = "finished";
      outcome = "approved";
    } else {
      status = "finished";
      outcome = faker.helpers.arrayElement(TRANSACTION_OUTCOMES);
    }
  } else {
    // For debit transactions, use original large transaction threshold logic
    const shouldDelay = amount > LARGE_TRANSACTION_THRESHOLD;
    status = shouldDelay ? "pending" : "finished";
    outcome =
      status === "finished"
        ? faker.helpers.arrayElement(TRANSACTION_OUTCOMES)
        : undefined;
  }

  // Create transaction directly instead of using generateTransaction to preserve our outcome
  const transaction = {
    transactionId: faker.string.uuid(),
    currency,
    amount,
    type,
    status,
    createdAt,
    outcome,
    ...(status === "finished" ? { updatedAt: createdAt } : {}),
  };

  if (status === "finished") {
    updateWalletBalance(walletId, currency, amount, type);
  }

  response.status(201).json(transaction);
});

module.exports = router;
