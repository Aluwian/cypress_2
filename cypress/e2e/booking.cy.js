describe('Booking the ticket', () => {
  const links = require('../fixtures/testData.json').links;
  const bookingData = require('../fixtures/testData.json').booking;
  const selectors = require('../fixtures/selectors.json').booking;

  beforeEach(() => {
    cy.visit(links.baseUrl);
  });

  // Успешное бронирование билета на фильм ведьмак
  it('Successful booking of 1 ticket for "Witcher"', () => {
    cy.bookTicket(bookingData.witcher.dayIndex, bookingData.witcher.seanceId);
    cy.getTicketInfo().then((ticket) => {
      cy.log(`Забронировано: ${ticket.title}, ${ticket.hall}, Ряд ${ticket.row}, Место ${ticket.seat}`);
    });
    cy.verifyBooking(bookingData.witcher.filmTitle, bookingData.witcher.hallType);
  });

  // Попытка выбрать прошедний сеанс
  it('Cannot select past seance', () => {
    cy.selectDay('today');
    cy.verifySeanceDisabled(bookingData.pastSeance.seanceId);
  });

  // Попытка занять уже занятое место
  it('Attempt to book already taken seat', () => {
    cy.selectDay(bookingData.witcher.dayIndex);
    cy.selectSeance(bookingData.witcher.seanceId);
    // Находим первое свободное место и запоминаем его
    cy.get(selectors.chairAvailable).first().then(($chair) => {
      // Проверяем, что место не имеет класс taken
      cy.wrap($chair).should('not.have.class', selectors.chairTaken);
      
      // Кликаем на место и бронируем
      cy.wrap($chair).click();
      cy.confirmBooking();
      
      // После бронирования проверяем, что место стало занятым
      // Возвращаемся на страницу сеанса
      cy.visit(links.baseUrl);
      cy.selectDay(bookingData.witcher.dayIndex);
      cy.selectSeance(bookingData.witcher.seanceId);
      
      // Проверяем что есть занятые места
      cy.get(selectors.chairTaken).should('exist');
    });
  });
});
