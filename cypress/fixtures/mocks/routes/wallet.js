const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");

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

module.exports = router;
