const selectors = require('../fixtures/selectors.json').main;
const mainData = require('../fixtures/testData.json');


describe('template spec', () => {
  beforeEach(() => {
    cy.visit(mainData.links.baseUrl);
  })
  // Заголовок страницы "Идем в кино"
  it('should display main page header', () => {
    cy.checkPage(selectors.header, mainData.main.expectedHeader);
  });

  // На странице отображается фильм "Сталкер(1979)"
  it ('display has film', () => {
    cy.checkPage(selectors.filmTitle, mainData.main.expectedFilmTitle);
  })
})
