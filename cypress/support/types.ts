export {};
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom Cypress command to authenticate a user.
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
    }
  }
}
