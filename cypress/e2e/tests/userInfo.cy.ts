describe("User Info API tests", () => {
  let authToken: string;
  let userId: string;

  beforeEach(() => {
    // Login to get the auth token and userId
    cy.userAuth("testUser", "testPass", "serviceID").then((response) => {
      authToken = response.body.data.token;
      userId = response.body.data.userId;
    });
  });

  it("should return user information when making a GET request to /user/info/:userId", () => {
    cy.getUserInfo(userId, authToken).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq("success");
      expect(response.body.wallet).to.have.property("walletId").and.not.be
        .empty;
      expect(response.body.wallet).to.have.property("name").and.not.be.empty;
      expect(response.body.wallet).to.have.property("locale", "en-US");
      expect(response.body.wallet).to.have.property("region").and.not.be.empty;
      expect(response.body.wallet).to.have.property("timezone").and.not.be
        .empty;
      expect(response.body.wallet).to.have.property("email").and.not.be.empty;
    });
  });

  it("user should have only one wallet", () => {
    cy.getUserInfo(userId, authToken).then((response) => {
      expect(response.body).to.have.property("wallet");
      expect(response.body.wallet).to.be.an("object");
    });
  });

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
