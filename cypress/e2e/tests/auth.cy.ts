describe("Login API tests", () => {
  it("should return a user token when making a POST request to /user/login", () => {
    cy.userAuth("testUser", "testPass", "serviceID").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq("success");
      expect(response.body.data).to.have.property("token");
      expect(response.body.data.token).to.be.a("string");
      expect(response.body.data.token).to.match(/^eyJ/); // JWT tokens typically start with 'eyJ'
      expect(response.body.data).to.have.property("refreshToken").and.not.be
        .empty;
      expect(response.body.data).to.have.property("expiry").and.not.be.empty;
      expect(response.body.data).to.have.property("userId").and.not.be.empty;
    });
  });

  it("should return 400 when X-Service-Id header is missing", () => {
    cy.userAuth("testUser", "testPass", "").then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property(
        "error",
        "Missing required X-Service-Id header"
      );
    });
  });
  it("should return 400 when username is missing", () => {
    cy.userAuth("", "testPass", "serviceID").then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property(
        "error",
        "Username and password are required"
      );
    });
  });
  it("should return 400 when password is missing", () => {
    cy.userAuth("testUser", "", "serviceID").then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property(
        "error",
        "Username and password are required"
      );
    });
  });
});
