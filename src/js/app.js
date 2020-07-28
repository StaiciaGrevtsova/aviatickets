import './plugins';
import '../css/style.css';
import locations from './store/locations';
import favourites from './store/favourites';
import formUI from './views/form';
import ticketsUI from './views/tickets';
import favouritesUI from './views/favourites';
import currencyUI from './views/currency';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  const form = formUI.form;
  const ticketsContainer = ticketsUI.ticketsContainer;
  const favouriteAddBtn = ticketsUI.favouriteAddBtnClass;
  const favouriteDelBtn = favouritesUI.favouriteDelBtnClass;
  const favouritesContainer = favouritesUI.favouritesContainer;

  //Events
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    onFormSubmit();
  });

  ticketsContainer.addEventListener('click', (e) => {
    e.preventDefault();
    if (!e.target.closest(favouriteAddBtn)) return;
    onFavouritesChange(e.target);
  });

  favouritesContainer.addEventListener('click', (e) => {
    e.preventDefault();
    if (!e.target.matches(favouriteDelBtn)) return;
    onFavouritesRemove(e.target);
  });

  //Handlers
  async function initApp() {
    favourites.getFavouritesList();
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList);
  }

  async function onFormSubmit() {
    //собрать данные из инпутов
    const origin = formUI.originValue ? locations.getCityCodeByKey(formUI.originValue) || '' : '';
    const destination = formUI.destinationValue ? locations.getCityCodeByKey(formUI.destinationValue) || '' : '';
    const depart_date = formUI.departDateValue || '';
    const return_date = formUI.returnDateValue || '';
    //CODE, CODE, 2019-09, 2019-10
    const currency = currencyUI.currencyValue;

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency
    });

    ticketsUI.renderTickets(locations.lastSearch);
  }

  //favourites
  function onFavouritesChange(btn) {
    const ticketID = btn.closest('[data-ticket-id]').dataset.ticketId;
    if(!favourites.checkTicketIsFavourite(ticketID)) {
      btn.classList.add('favourite-true');
    } else {
      btn.classList.remove('favourite-true');
    }
    favourites.changeFavouriteState(ticketID);
    favourites.getFavouritesList();
  }

  //remove item from favourites list
  function onFavouritesRemove(btn) {
    const ticketID = btn.closest('[data-ticket-id]').dataset.ticketId;
    const ticketBlock = ticketsContainer.querySelector(`[data-ticket-id=${ticketID}]`);
    if(ticketBlock) {
      const ticketBlockBtn = ticketBlock.querySelector(favouriteAddBtn).querySelector('i');
      ticketBlockBtn.classList.remove('favourite-true');
    }
    favourites.removeFavouritesItem(ticketID);
    favourites.getFavouritesList();
  }
});
