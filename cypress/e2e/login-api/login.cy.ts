describe("Login API Mock", () => {
  it("should return a JWT token when making a POST request to /user/login", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/user/login",
      body: {
        username: "testuser",
        password: "testpass",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
      expect(response.body.token).to.be.a("string");
      expect(response.body.token).to.match(/^eyJ/); // JWT tokens typically start with 'eyJ'
    });
  });
});
