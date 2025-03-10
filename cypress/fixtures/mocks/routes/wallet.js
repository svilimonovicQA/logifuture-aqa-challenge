const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");

// Helper function to validate transaction request body
/**
 * Validates the transaction body to ensure it has a valid amount and currency.
 *
 * @param {Object} body - The transaction body to validate.
 * @param {number} body.amount - The amount of the transaction.
 * @param {string} body.currency - The currency of the transaction. Must be one of: EUR, USD, GBP.
 * @returns {Object} An object containing the validation result.
 * @returns {boolean} returns.isValid - Indicates if the transaction body is valid.
 * @returns {string} [returns.error] - The error message if the transaction body is invalid.
 */
const validateTransactionBody = (body) => {
  const { amount, currency } = body;

  if (!amount || typeof amount !== "number") {
    return { isValid: false, error: "Amount must be a number" };
  }

  if (amount <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }

  if (!currency || !["EUR", "USD", "GBP"].includes(currency)) {
    return { isValid: false, error: "Currency must be one of: EUR, USD, GBP" };
  }

  return { isValid: true };
};

// Helper function to generate a currency clip
const generateCurrencyClip = (currency) => {
  return {
    currency,
    balance: parseFloat(faker.finance.amount(0, 10000, 4)),
    lastTransaction: faker.date.recent().toISOString(),
    transactionCount: faker.number.int({ min: 1, max: 100 }),
  };
};

// Helper function to generate an array of currency clips
/**
 * Generates an array of currency clips.
 *
 * This function randomly selects a number of currencies from a predefined list
 * and generates a currency clip for each selected currency.
 *
 * @returns {Array} An array of currency clips.
 */
const generateCurrencyClips = () => {
  const currencies = ["EUR", "USD", "GBP"];
  const numberOfClips = faker.number.int({ min: 0, max: currencies.length });
  const selectedCurrencies = faker.helpers.arrayElements(
    currencies,
    numberOfClips
  );

  return selectedCurrencies.map((currency) => generateCurrencyClip(currency));
};

// GET /wallet/{walletId}
router.get("/:walletId", (request, response) => {
  const { walletId } = request.params;

  // Validate walletId format (basic UUID validation)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(walletId)) {
    return response.status(400).json({
      error: "Invalid wallet ID format",
    });
  }

  // Generate mock wallet data
  const createdAt = faker.date.past().toISOString();
  const updatedAt = faker.date
    .between({
      from: createdAt,
      to: new Date(),
    })
    .toISOString();

  const wallet = {
    walletId,
    currencyClips: generateCurrencyClips(),
    createdAt,
    updatedAt,
  };

  response.json(wallet);
});

// Helper function to generate a transaction
const generateTransaction = (
  createdAt = faker.date.recent().toISOString(),
  shouldDelay = false
) => {
  // If shouldDelay is true, simulate a delayed response (> 1 second)
  const status = shouldDelay ? "pending" : "finished";
  const transaction = {
    transactionId: faker.string.uuid(),
    currency: faker.helpers.arrayElement(["EUR", "USD", "GBP"]),
    amount: parseFloat(faker.finance.amount(1, 10000, 2)),
    type: faker.helpers.arrayElement(["credit", "debit"]),
    status,
    createdAt,
  };

  if (status === "finished") {
    transaction.outcome = faker.helpers.arrayElement(["approved", "denied"]);
    transaction.updatedAt = faker.date
      .between({
        from: transaction.createdAt,
        to: new Date(),
      })
      .toISOString();
  }

  return transaction;
};

// GET /wallet/{walletId}/transaction/{transactionId}
router.get("/:walletId/transaction/:transactionId", (request, response) => {
  const { walletId, transactionId } = request.params;

  // Validate walletId format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(walletId)) {
    return response.status(400).json({
      error: "Invalid wallet ID format",
    });
  }

  // Validate transactionId format (using same UUID format)
  if (!uuidRegex.test(transactionId)) {
    return response.status(400).json({
      error: "Invalid transaction ID format",
    });
  }

  // Generate mock transaction response using the helper function
  const transaction = generateTransaction();
  // Override the generated transactionId with the one from the request
  transaction.transactionId = transactionId;

  response.json(transaction);
});

// GET /wallet/{walletId}/transactions
router.get("/:walletId/transactions", (request, response) => {
  const { walletId } = request.params;
  const { page = 1, startDate, endDate } = request.query;

  // Validate walletId format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(walletId)) {
    return response.status(400).json({
      error: "Invalid wallet ID format",
    });
  }

  // Generate a random total number of transactions
  const totalCount = faker.number.int({ min: 10, max: 100 });
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = Math.min(parseInt(page), totalPages);

  // Generate transactions for the current page
  let transactions = Array.from({ length: pageSize }, () => {
    // Generate a date within the specified range or recent if no range
    let createdAt;
    if (startDate && endDate) {
      createdAt = faker.date
        .between({
          from: new Date(startDate),
          to: new Date(endDate),
        })
        .toISOString();
    } else {
      createdAt = faker.date.recent().toISOString();
    }
    return generateTransaction(createdAt);
  });

  // Sort transactions by createdAt in descending order
  transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Filter transactions by date range if provided
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

// POST /wallet/{walletId}/transaction
router.post("/:walletId/transaction", (request, response) => {
  const { walletId } = request.params;

  // Validate walletId format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(walletId)) {
    return response.status(400).json({
      error: "Invalid wallet ID format",
    });
  }

  // Validate request body
  const validation = validateTransactionBody(request.body);
  if (!validation.isValid) {
    return response.status(400).json({
      error: validation.error,
    });
  }

  const { amount, currency, type } = request.body;

  // Simulate a delayed response (> 1 second) for large amounts
  const shouldDelay = amount > 1000; // Example threshold for demonstration

  // Create transaction response using request body
  const transaction = {
    transactionId: faker.string.uuid(),
    currency,
    amount,
    type,
    status: shouldDelay ? "pending" : "finished",
    createdAt: new Date().toISOString(),
  };

  if (transaction.status === "finished") {
    transaction.outcome = "approved";
    transaction.updatedAt = transaction.createdAt;
  }

  response.status(201).json(transaction);
});

module.exports = router;
