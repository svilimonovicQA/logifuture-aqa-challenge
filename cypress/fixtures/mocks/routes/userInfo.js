const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");

/**
 * User Information Service Mock
 *
 * This module provides mock endpoints for retrieving user information.
 * It simulates a user profile service with wallet integration.
 */

/**
 * Validates the authorization header
 *
 * @param {string} authHeader - The authorization header to validate
 * @returns {Object} Validation result
 * @returns {boolean} result.isValid - Whether the header is valid
 * @returns {string} [result.error] - Error message if validation fails
 */
const validateAuth = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      isValid: false,
      error: "Unauthorized - Authentication required",
    };
  }
  return { isValid: true };
};

/**
 * Validates the user ID parameter
 *
 * @param {string} userId - The user ID to validate
 * @returns {Object} Validation result
 * @returns {boolean} result.isValid - Whether the ID is valid
 * @returns {string} [result.error] - Error message if validation fails
 */
const validateUserId = (userId) => {
  if (!userId) {
    return {
      isValid: false,
      error: "UserId is required",
    };
  }
  return { isValid: true };
};

/**
 * Generates mock user profile data
 *
 * @param {string} fullName - The user's full name to base the profile on
 * @returns {Object} User profile data including wallet information
 */
const generateUserProfile = (fullName) => {
  const firstName = fullName.split(" ")[0];

  return {
    walletId: faker.string.uuid(),
    name: fullName,
    locale: "en-US",
    region: faker.location.countryCode(),
    timezone: faker.location.timeZone(),
    email: faker.internet.email({ firstName }),
  };
};

/**
 * GET /:userId
 *
 * Retrieves user information including wallet details
 *
 * @route GET /:userId
 * @param {string} headers.authorization - Bearer token for authentication
 * @param {string} params.userId - The ID of the user to retrieve
 * @returns {Object} 200 - Success response with user profile data
 * @returns {Object} 401 - Unauthorized error response
 * @returns {Object} 400 - Bad request error response
 */
router.get("/:userId", (request, response) => {
  // Validate authorization
  const authValidation = validateAuth(request.headers["authorization"]);
  if (!authValidation.isValid) {
    return response.status(401).json({
      error: authValidation.error,
    });
  }

  // Validate user ID
  const userIdValidation = validateUserId(request.params.userId);
  if (!userIdValidation.isValid) {
    return response.status(400).json({
      error: userIdValidation.error,
    });
  }

  // Generate user profile
  const fullName = faker.person.fullName();
  const userProfile = generateUserProfile(fullName);

  // Return success response
  response.status(200).json({
    status: "success",
    wallet: userProfile,
  });
});

module.exports = router;
