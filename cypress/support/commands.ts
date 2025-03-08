// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("userAuth", (username, password, serviceId) => {
  cy.request({
    method: "POST",
    url: "/user/login",
    headers: {
      "X-Service-Id": serviceId,
    },
    failOnStatusCode: false,
    body: {
      username: username,
      password: password,
    },
  });
});

Cypress.Commands.add("getUserInfo", (userId, authToken) => {
  cy.request({
    method: "GET",
    url: `/user/info/${userId}`,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    failOnStatusCode: false,
  });
});
