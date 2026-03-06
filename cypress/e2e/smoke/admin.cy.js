describe('Admin login', () => {
  const testData = require('../../fixtures/testData.json').admin;
  const selectors = require('../../fixtures/selectors.json').admin.dashboard;
  const links = require('../../fixtures/testData.json').links
  const expectedResults = require('../../fixtures/testData.json').adminexpected

  // Игнорируем ошибки приложения (баг showPopup на сайте)
  before(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('showPopup')) return false;
    });
  });

  beforeEach(() => {
    cy.visit(links.adminUrl);
  });

  it('Succesful login with correct login and password', () => {
    cy.login(testData.validEmail, testData.validPassword);
    cy.get(selectors.hallControlTitle).should('have.text', expectedResults.expectedHallControlTitle);
    cy.get(selectors.priceConfigTitle).should('have.text', expectedResults.expectedPriceConfigTitle);
  });

  it('Login with invalid password', function() {
    cy.login(testData.validEmail, testData.invalidPassword);
    cy.get(selectors.bodySelector).should('contain', expectedResults.expectedErrorMessage);
  });

  it('Login with invalid login', function() {
    cy.login(testData.invalidEmail, testData.validPassword);
    cy.get(selectors.bodySelector).should('contain', expectedResults.expectedErrorMessage);
  });
});
