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

  const { amount, currency } = request.body;

  // Generate mock transaction response
  const transaction = {
    transactionId: faker.string.uuid(),
    walletId,
    amount,
    currency,
    timestamp: new Date().toISOString(),
    status: faker.helpers.arrayElement(["completed", "pending", "failed"]),
    type: faker.helpers.arrayElement(["credit", "debit"]),
    balance: parseFloat(faker.finance.amount(Math.abs(amount), 10000, 2)),
  };

  response.status(201).json(transaction);
});

module.exports = router;
