const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");

/**
 * Authentication Service Mock
 *
 * This module provides mock authentication endpoints for testing purposes.
 * It simulates a basic authentication flow with token generation.
 */

/**
 * Validates the login request data
 *
 * @param {Object} body - The request body
 * @param {string} body.username - The username to validate
 * @param {string} body.password - The password to validate
 * @returns {Object} Validation result
 * @returns {boolean} result.isValid - Whether the request is valid
 * @returns {string} [result.error] - Error message if validation fails
 */
const validateLoginRequest = (body) => {
  const { username, password } = body;

  if (!username || !password) {
    return { isValid: false, error: "Username and password are required" };
  }

  if (typeof username !== "string" || typeof password !== "string") {
    return { isValid: false, error: "Username and password must be strings" };
  }

  return { isValid: true };
};

/**
 * Generates authentication tokens and user data
 *
 * @returns {Object} Authentication data
 * @returns {string} data.token - JWT access token
 * @returns {string} data.refreshToken - JWT refresh token
 * @returns {string} data.expiry - Token expiration date
 * @returns {string} data.userId - Unique user identifier
 */
const generateAuthData = () => ({
  token: faker.internet.jwt(),
  refreshToken: faker.internet.jwt(),
  expiry: faker.date.future(),
  userId: faker.string.uuid(),
});

/**
 * POST /login
 *
 * Handles user authentication and returns access tokens
 *
 * @route POST /login
 * @param {string} headers.x-service-id - Required service identifier
 * @param {Object} body - Request body
 * @param {string} body.username - User's username
 * @param {string} body.password - User's password
 * @returns {Object} 200 - Success response with authentication data
 * @returns {Object} 400 - Error response for invalid requests
 */
router.post("/login", (request, response) => {
  // Validate service ID header
  const serviceId = request.headers["x-service-id"];
  if (!serviceId) {
    return response.status(400).json({
      error: "Missing required X-Service-Id header",
    });
  }

  // Validate request body
  const validation = validateLoginRequest(request.body);
  if (!validation.isValid) {
    return response.status(400).json({
      error: validation.error,
    });
  }

  // Generate and return authentication data
  response.status(200).json({
    status: "success",
    data: generateAuthData(),
  });
});

module.exports = router;
