describe("Wallet API tests", () => {
  let authToken: string;
  let walletId: string;
  let userId: string;

  beforeEach(() => {
    // Login to get the auth token
    cy.userAuth("testUser", "testPass", "serviceID").then((response) => {
      authToken = response.body.token;
      userId = response.body.userId;

      // Get user info to get the walletId
      cy.getUserInfo(userId, authToken).then((userResponse) => {
        walletId = userResponse.body.wallet.walletId;
      });
    });
  });

  it("should return wallet information when making a GET request to /wallet/:walletId", () => {
    cy.getWallet(walletId, authToken).then((response) => {
      // Verify response status
      expect(response.status).to.eq(200);

      // Verify essential wallet properties
      expect(response.body).to.have.property("walletId").and.eq(walletId);
      expect(response.body)
        .to.have.property("currencyClips")
        .and.to.be.an("array");

      // If currencyClips exist, verify essential clip properties
      if (response.body.currencyClips.length > 0) {
        const clip = response.body.currencyClips[0];
        expect(clip).to.have.all.keys([
          "currency",
          "balance",
          "lastTransaction",
          "transactionCount",
        ]);
      }
    });
  });
});
