/**
 * @fileoverview Test suite for authentication API endpoints
 * Contains tests for login functionality, including successful authentication
 * and various error scenarios for invalid inputs
 */

import { user } from "../../fixtures/mocks/data/user";

/**
 * Test suite for Login API functionality
 * Verifies authentication flows and error handling
 */
describe("Login API tests", () => {
  /**
   * Test case for successful login
   * Verifies:
   * - Response status is 200
   * - JWT token format is valid
   * - Response contains all required authentication fields
   */
  it("should return a valid JWT token on successful login", () => {
    cy.userAuth(user.username, user.password, user.serviceId).then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.token).to.match(/^eyJ/); // JWT tokens typically start with 'eyJ'
        expect(response.body.data).to.have.all.keys([
          "token",
          "refreshToken",
          "expiry",
          "userId",
        ]);
      }
    );
  });

  /**
   * Test case for missing service ID header
   * Verifies API properly handles missing required header
   * Expected: 400 Bad Request with appropriate error message
   */
  it("should return 400 when X-Service-Id header is missing", () => {
    cy.userAuth(user.username, user.password, "").then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Missing required X-Service-Id header");
    });
  });

  /**
   * Test case for missing credentials
   * Uses data-driven testing approach to verify handling of missing username/password
   * Expected: 400 Bad Request for each invalid credential combination
   */
  it("should return 400 when credentials are missing", () => {
    // Test cases for different missing credential scenarios
    // Each case tests a specific required field being empty while others are valid
    const testCases = [
      {
        username: "",
        password: user.password,
        description: "missing username",
      },
      {
        username: user.username,
        password: "",
        description: "missing password",
      },
    ];

    testCases.forEach(({ username, password, description }) => {
      cy.userAuth(username, password, user.serviceId).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Username and password are required");
      });
    });
  });
});
