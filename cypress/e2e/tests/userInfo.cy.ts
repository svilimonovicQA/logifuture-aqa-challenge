/**
 * @fileoverview Test suite for User Info API endpoints
 * Contains tests for retrieving user information and wallet data,
 * including authentication validation and error scenarios
 */

import { user } from "../../fixtures/mocks/data/user";

/**
 * Test suite for User Info API functionality
 * Verifies user data retrieval and authentication requirements
 */
describe("User Info API tests", () => {
  /**
   * Authentication token received after successful login
   */
  let authToken: string;

  /**
   * User identifier for the authenticated user
   */
  let userId: string;

  /**
   * Before each test:
   * - Authenticates user to obtain valid token and userId
   * - Sets up required authentication context for subsequent requests
   */
  beforeEach(() => {
    cy.userAuth(user.username, user.password, user.serviceId).then(
      (response) => {
        authToken = response.body.data.token;
        userId = response.body.data.userId;
      }
    );
  });

  /**
   * Test case verifying user wallet association
   * Checks that:
   * - User has a wallet property in their info
   * - The wallet is a valid object (single wallet per user)
   * Assertions:
   * - Validates presence of wallet property in response body
   * - Confirms wallet is an object type, ensuring single wallet constraint
   */
  it("user should have only one wallet", () => {
    cy.getUserInfo(userId, authToken).then((response) => {
      expect(response.body).to.have.property("wallet");
      expect(response.body.wallet).to.be.an("object");
    });
  });

  /**
   * Test case for missing authorization
   * Verifies API properly enforces authentication requirements
   * Expected: 401 Unauthorized with appropriate error message
   * Assertions:
   * - Validates 401 status code is returned
   * - Confirms error message matches expected unauthorized message
   */
  it("should return 401 when Authorization header is missing", () => {
    cy.getUserInfo(userId, "").then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property(
        "error",
        "Unauthorized - Authentication required"
      );
    });
  });
});
