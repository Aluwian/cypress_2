// Загружаем фикстуры через require
const selectors = require('../fixtures/selectors.json');
const testData = require('../fixtures/testData.json');

// Проверка корректной загрузки страницы
Cypress.Commands.add('checkPage', (selector, verifyText) => {
  cy.get(selector).should('have.text', verifyText);
});

// Авторизация в админке
Cypress.Commands.add('login', (email, password) => {
  cy.get(selectors.admin.login.email).type(email);
  cy.get(selectors.admin.login.password).type(password);
  cy.get(selectors.admin.login.submitButton).click();
});

// Выбрать день по индексу или сегодня
Cypress.Commands.add('selectDay', (day) => {
  if (day === 'today') {
    cy.get(selectors.main.todayDay).click();
  } else {
    cy.get(selectors.main.dayWeek).eq(day).click();
  }
});

// Выбрать сеанс по ID
Cypress.Commands.add('selectSeance', (seanceID) => {
  cy.get(`${selectors.booking.seanceLink}[data-seance-id="${seanceID}"]`).click();
});

// Выбрать первое свободное место
Cypress.Commands.add('selectFreeChair', () => {
  cy.get(selectors.booking.chairAvailable).first().click();
});

// Подтверждение бронирования (два этапа)
Cypress.Commands.add('confirmBooking', () => {
  cy.get(selectors.booking.acceptButton).click();
  cy.get(selectors.booking.acceptButton).click();
});

// Получение информации о билете
Cypress.Commands.add('getTicketInfo', () => {
  return cy.get(selectors.booking.ticketTitle).invoke('text').then((title) => {
    return cy.get(selectors.booking.ticketChairs).invoke('text').then((chairsText) => {
      const match = chairsText.match(/(\d+)\/(\d+)/);
      const row = match ? parseInt(match[1]) : null;
      const seat = match ? parseInt(match[2]) : null;

      return {
        title: title.trim(),
        hall: chairsText.trim(),
        row: row,
        seat: seat
      };
    });
  });
});

// Проверка забронированного билета (название фильма и зал)
Cypress.Commands.add('verifyBooking', (filmName, hallName) => {
  cy.contains(filmName).should('be.visible');
  cy.contains(hallName).should('be.visible');
});

// Проверка что занятое место не кликабельно (по ряду и месту)
Cypress.Commands.add('verifyTakenSeatNotClickable', (row, seat) => {
  cy.get(`div.buying-scheme__row:nth-child(${row}) span.buying-scheme__chair:nth-child(${seat})`)
    .should('have.class', 'buying-scheme__chair_taken');
});

// Бронирование билета «под ключ»
Cypress.Commands.add('bookTicket', (dayIndex, seanceId) => {
  cy.selectDay(dayIndex);
  cy.selectSeance(seanceId);
  cy.selectFreeChair();
  cy.confirmBooking();
});

// Проверка что сеанс неактивен (прошедший)
Cypress.Commands.add('verifySeanceDisabled', (seanceId) => {
  cy.get(`${selectors.booking.seanceLink}[data-seance-id="${seanceId}"]`).should('have.class', 'movie-seances__time');
});

// Получение названия зала из админки
Cypress.Commands.add('getHallNameFromAdmin', () => {
  return cy.get(selectors.admin.dashboard.hallName).invoke('text');
});
