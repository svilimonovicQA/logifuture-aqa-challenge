export {};
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * User Authentication
       * @param {string} username - The username to use for authentication.
       * @param {string} password - The password to use for authentication.
       * @param {string} serviceId - The ID of the service to authenticate with.
       * @example cy.userAuth("testuser", "testpass", "serviceId");
       */
      userAuth(
        username: string,
        password: string,
        serviceId: string
      ): Chainable;

      /**
       * Get User Information
       * @param {string} userId - The ID of the user to get information for.
       * @param {string} authToken - The authentication token to use for the request.
       * @example cy.getUserInfo("userId", "authToken");
       */
      getUserInfo(userId: string, authToken: string): Chainable;

      /**
       * Get Wallet Information
       * @param {string} walletId - The ID of the wallet to get information for.
       * @param {string} authToken - The authentication token to use for the request.
       * @example cy.getWallet("walletId", "authToken");
       */
      getWallet(walletId: string, authToken: string): Chainable;
    }
  }
}
