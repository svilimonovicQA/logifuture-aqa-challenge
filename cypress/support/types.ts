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

      /**
       * Create a new transaction
       * @param {string} walletId - The ID of the wallet to create the transaction for
       * @param {object} transaction - The transaction details
       * @param {string} authToken - The authentication token to use for the request
       * @example cy.postTransaction("walletId", { currency: "EUR", amount: 100, type: "credit" }, "authToken");
       */
      postTransaction(
        walletId: string,
        transaction: {
          currency: string;
          amount: number;
          type: "credit" | "debit";
        },
        authToken: string
      ): Chainable;

      /**
       * Get Transaction Details
       * @param {string} walletId - The ID of the wallet
       * @param {string} transactionId - The ID of the transaction
       * @param {string} authToken - The authentication token to use for the request
       * @example cy.getTransaction("walletId", "transactionId", "authToken");
       */
      getTransaction(
        walletId: string,
        transactionId: string,
        authToken: string
      ): Chainable;

      /**
       * Get Transaction History
       * @param {string} walletId - The ID of the wallet
       * @param {object} params - Query parameters for pagination and filtering
       * @param {string} authToken - The authentication token to use for the request
       * @example cy.getTransactions("walletId", { page: 1 }, "authToken");
       */
      getTransactions(
        walletId: string,
        params: {
          page?: number;
          startDate?: string;
          endDate?: string;
        },
        authToken: string
      ): Chainable;
    }
  }
}
