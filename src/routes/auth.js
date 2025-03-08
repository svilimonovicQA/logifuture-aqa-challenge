const express = require("express");
const router = express.Router();
import { faker } from "@faker-js/faker";

router.post("/login", (request, response) => {
  // Check for X-Service-Id header
  /**
   * Extracts the service ID from the request headers.
   *
   * @constant {string} serviceId - The service ID obtained from the "x-service-id" header in the request.
   */
  const serviceId = request.headers["x-service-id"];
  if (!serviceId) {
    return response.status(400).json({
      error: "Missing required X-Service-Id header",
    });
  }

  // Validate request body
  const { username, password } = request.body;
  if (!username || !password) {
    return response.status(400).json({
      error: "Username and password are required",
    });
  }

  // For mock purposes, any non-empty username/password is considered valid
  if (typeof username !== "string" || typeof password !== "string") {
    return response.status(400).json({
      error: "Username and password must be strings",
    });
  }

  // Generate and return Bearer token with standard response format
  response.status(200).json({
    status: "success",
    data: {
      token: faker.internet.jwt(),
      refreshToken: faker.internet.jwt(),
      expiry: faker.date.future(),
      userId: faker.string.uuid(),
    },
  });
});

module.exports = router;
