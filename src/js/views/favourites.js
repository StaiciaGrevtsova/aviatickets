class FavouritesUI {
  constructor(currency) {
    this.container = document.getElementById('dropdown1');
    this.favouriteDelBtnClass = '.delete-favourite';
  }

  get favouritesContainer() {
    return this.container;
  }

  renderFavouritesList(tickets) {
    this.clearContainer();

    const ticketsArray = Object.values(tickets);
    if (!ticketsArray.length) {
      this.showEmptyMsg();
      return;
    }

    let fragment = '';

    ticketsArray.forEach(ticket => {
      const template = FavouritesUI.favouriteTemplate(ticket);
      fragment += template;
    });

    this.container.insertAdjacentHTML('afterbegin', fragment);
  }

  clearContainer() {
    this.container.innerHTML = '';
  }

  showEmptyMsg() {
    const template = FavouritesUI.emptyMsgTemplate();
    this.container.insertAdjacentHTML('afterbegin', template);
  }

  static emptyMsgTemplate() {
    return `<div class="favourite-empty-res-msg">Избранных билетов нет</div>`;
  }

  static favouriteTemplate(ticket) {
    return `
    <div class="favourite-item d-flex align-items-start" data-ticket-id="${ticket._id}">
      <img
              src="${ticket.airline_logo}"
              class="favourite-item-airline-img"
      />
      <div class="favourite-item-info d-flex flex-column">
        <div
                class="favourite-item-destination d-flex align-items-center"
        >
          <div class="d-flex align-items-center mr-auto">
            <span class="favourite-item-city">${ticket.origin_name} </span>
            <i class="medium material-icons">flight_takeoff</i>
          </div>
          <div class="d-flex align-items-center">
            <i class="medium material-icons">flight_land</i>
            <span class="favourite-item-city">${ticket.destination_name}</span>
          </div>
        </div>
        <div class="ticket-time-price d-flex align-items-center">
          <span class="ticket-time-departure">${ticket.departure_at}</span>
          <span class="ticket-price ml-auto">$${ticket.price}</span>
        </div>
        <div class="ticket-additional-info">
          <span class="ticket-transfers">Пересадок: ${ticket.transfers}</span>
          <span class="ticket-flight-number">Номер рейса: ${ticket.flight_number}</span>
        </div>
        <a
                class="waves-effect waves-light btn-small pink darken-3 delete-favourite ml-auto"
        >Delete</a
        >
      </div>
    </div>
    `;
  }

}

const favouritesUI = new FavouritesUI();

export default favouritesUI;
