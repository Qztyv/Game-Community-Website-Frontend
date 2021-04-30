// https://docs.cypress.io/api/introduction/api.html

describe("Checks page banner title for home page", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("span", "Home Feed");
  });
});
