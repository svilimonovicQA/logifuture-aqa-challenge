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
