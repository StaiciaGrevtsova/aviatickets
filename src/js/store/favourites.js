import locations from './locations';
import favouritesUI from '../views/favourites';

class Favourites {
  constructor() {
    this.favouriteTickets = JSON.parse(localStorage.getItem('favouriteTickets')) || {};
  }

  changeFavouriteState(ticket) {
    this.favouriteTickets = JSON.parse(localStorage.getItem('favouriteTickets')) || {};
    if(this.checkTicketIsFavourite(ticket)) {
      this.removeFavouritesItem(ticket);
    } else {
      this.addFavouritesItem(ticket);
    }
    locations.changeFavouriteState(ticket, !this.checkTicketIsFavourite(ticket));
  }

  checkTicketIsFavourite(ticket) {
    this.favouriteTickets = JSON.parse(localStorage.getItem('favouriteTickets')) || {};
    return this.favouriteTickets.hasOwnProperty(ticket)
  }

  addFavouritesItem(ticket) {
    const ticketInfo = locations.getTicketByID(ticket);
    Favourites.addToLocalStorageObject('favouriteTickets', ticket, ticketInfo);
    this.favouriteTickets = JSON.parse(localStorage.getItem('favouriteTickets')) || {};
  }

  removeFavouritesItem(ticket) {
    Favourites.removeFromLocalStorageObject('favouriteTickets', ticket);
    this.favouriteTickets = JSON.parse(localStorage.getItem('favouriteTickets')) || {};
  }

  getFavouritesList() {
    favouritesUI.renderFavouritesList(this.favouriteTickets);
  }

  static addToLocalStorageObject(name, key, value) {
    let existing = localStorage.getItem(name);
    existing = existing ? JSON.parse(existing) : {};

    existing[key] = value;
    localStorage.setItem(name, JSON.stringify(existing));
  };

  static removeFromLocalStorageObject(name, key) {
    let existing = localStorage.getItem(name);
    existing = existing ? JSON.parse(existing) : {};

    delete existing[key];
    localStorage.setItem(name, JSON.stringify(existing));
  };
}

const favourites = new Favourites();

export default favourites;
