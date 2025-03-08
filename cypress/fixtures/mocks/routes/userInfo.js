const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");

router.get("/:userId", (request, response) => {
  // Check authorization header
  /**
   * Extracts the authorization header from the request headers.
   *
   * @constant {string} authHeader - The authorization header from the request.
   */
  const authHeader = request.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({
      error: "Unauthorized - Authentication required",
    });
  }

  // Validate userId parameter
  const { userId } = request.params;
  if (!userId) {
    return response.status(400).json({
      error: "UserId is required",
    });
  }

  const NAME = faker.person.fullName();

  // Generate and return user info with standard response format
  response.status(200).json({
    status: "success",
    data: {
      walletId: faker.string.uuid(),
      name: NAME,
      locale: "en-US",
      region: faker.location.countryCode(),
      timezone: faker.location.timeZone(),
      email: faker.internet.email({ firstName: NAME.split(" ")[0] }),
    },
  });
});

module.exports = router;
