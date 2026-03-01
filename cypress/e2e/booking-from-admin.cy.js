describe('Booking from admin hall name', () => {
  const selectors = require('../fixtures/selectors.json');
  const testData = require('../fixtures/testData.json');
  const cookiesData = require('../fixtures/cookie.json');

  it('Book ticket in hall from admin', () => {
    // Заходим в админку
    cy.setCookie(cookiesData[0].name, cookiesData[0].value);
    cy.visit(testData.links.adminUrl);
    // cy.login(testData.admin.validEmail, testData.admin.validPassword);

    // Из за ошибки showPopup is not defined я не могу корректно войти в админку: если я ее игнорирую, то у меня запускается пустая админка и тест просто не видит нужный селектор, если я не игнорирую данную ошибку, то у меня просто не происодит авторизация

    // Получаем название фильма из админки
    cy.get('.conf-step__movie-title').contains('Ведьмак').then(($el) => {
    // cy.get('[data-layer="Content"]').contains('Ведьмак').then(($el) => {
      const filmName = $el.text().trim();
      cy.log(`Film name from admin: ${filmName}`);

      // Идём на клиентскую часть
      cy.visit(testData.links.baseUrl);

      // Выбираем второй день по списку (не сегодня)
      cy.selectDay(1);

      // Ищем фильм по названию по всей странице
      cy.contains('.movie__title', filmName).then(($title) => {
        cy.log(`Found film: ${$title.text()}`);

        // Поднимаемся к родительскому блоку фильма
        cy.wrap($title).parents('main > :nth-child(3)').within(() => {

          // ПРОВЕРКА: название фильма совпадает
          cy.get('.movie__info > .movie__description > .movie__title').should('have.text', filmName);

          // Находим все доступные сеансы и выбираем самый первые
          cy.get(selectors.booking.movieSeancesTime)
          .first()
          .click();
        });

        // Выбираем первое свободное место
        cy.selectFreeChair();

        // Подтверждаем бронирование
        cy.confirmBooking();

        // ПРОВЕРКА: название фильма в билете совпадает
        cy.contains(filmName).should('be.visible');
      });
    });
  });
})