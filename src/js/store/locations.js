import api from '../services/apiService';
import { formatDate } from '../helpers/date';
import favourites from '../store/favourites';

class Locations {
    constructor(api, helpers) {
        this.api = api;
        this.countries = null;
        this.cities = null;
        this.shortCitiesList = null;
        this.lastSearch = {};
        this.airlines = {};
        this.formatDate = helpers.formatDate;
    }

    async init() {
        const response = await Promise.all([
            this.api.countries(),
            this.api.cities(),
            this.api.airlines(),
        ]);

        const [countries, cities, airlines] = response;
        this.countries = this.serializeCountries(countries);
        this.cities = this.serializeCities(cities);
        this.shortCitiesList = this.createShortCitiesList(this.cities);
        this.airlines = this.serializeAirlines(airlines);

        return response;
    }

    getCityCodeByKey(key) {
        const city = Object.values(this.cities).find((item) => item.full_name === key);
        return city.code;
    }

    getCityNameByCode(code) {
        return this.cities[code] ? this.cities[code].name || this.cities[code].name_translations.en : '';
    }

    getAirlineNameByCode(code) {
        return this.airlines[code] ? this.airlines[code].name : '';
    }

    getAirlineLogoByCode(code) {
        return this.airlines[code] ? this.airlines[code].logo : '';
    }

    getTicketByID(id) {
        const ticket = Object.values(this.lastSearch).find((item) => item._id === id);
        return ticket;
    }

    createShortCitiesList(cities) {
        // {'City, Country': null }
        // Object.entries => [key, value]
        return Object.entries(cities).reduce((acc, [, city]) => {
            acc[city.full_name] = null;
            return acc;
        }, {})
    }

    serializeAirlines(airlines) {
        return airlines.reduce((acc, item) => {
            item.logo = `http://pics.avs.io/al_square/36/36/${item.code}.png`;
            item.name = item.name || item.name_translations.en || '';
            acc[item.code] = item;
            return acc;
        }, {})
    }

    serializeCountries(countries) {
        //{ 'Country_code' : { ... } }
        return countries.reduce((acc, country) => {
            acc[country.code] = country;
            return acc;
        }, {})
    }

    serializeCities(cities) {
        //{ 'City name, Country name' : { ... } }
        return cities.reduce((acc, city) => {
            const country_name = this.countries[city.country_code].name;
            city.name = city.name || city.name_translations.en || '';
            const full_name = `${city.name}, ${country_name}`;
            acc[city.code] = {
                ...city,
                country_name,
                full_name,
            };
            return acc;
        }, {})
    }

    createTicketId(ticket) {
        return `id_${ticket.airline}${ticket.flight_number}${ticket.origin}${ticket.destination}${this.formatDate(ticket.departure_at, 'ddmmyyyyhhmm')}${this.formatDate(ticket.return_at, 'ddmmyyyyhhmm')}`
    }

    changeFavouriteState(ticketID, state = false) {
        const ticket = Object.values(this.lastSearch).find((item) => item._id === ticketID);
        ticket.isFavourite = state;
        return state;
    }

    getFavouriteState(ticket) {
        const ticketID = this.createTicketId(ticket);
        return favourites.checkTicketIsFavourite(ticketID)
    }

    async fetchTickets(params) {
        const response = await this.api.prices(params);
        this.lastSearch = this.serializeTickets(response.data);
    }

    serializeTickets(tickets) {
        return Object.values(tickets).map(ticket => {
            return {
                ...ticket,
                _id: this.createTicketId(ticket),
                origin_name: this.getCityNameByCode(ticket.origin),
                destination_name: this.getCityNameByCode(ticket.destination),
                airline_logo: this.getAirlineLogoByCode(ticket.airline),
                airline_name: this.getAirlineNameByCode(ticket.airline),
                departure_at: this.formatDate(ticket.departure_at, 'dd MMM yyyy hh:mm'),
                return_at: this.formatDate(ticket.return_at, 'dd MMM yyyy hh:mm'),
                isFavourite: this.getFavouriteState(ticket),
            }
        })
    }
}

const locations = new Locations(api, { formatDate });

export default locations;
