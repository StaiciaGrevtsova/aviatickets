import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';

// Init dropdown
const dropdowns = document.querySelectorAll('.dropdown-trigger');
M.Dropdown.init(dropdowns, {
  closeOnClick: false,
  alignment: 'right'
});

export function getDropdownInstance(elem) {
  return M.Dropdown.getInstance(elem);
}

//Init select
const select = document.querySelectorAll('select');
M.FormSelect.init(select);

export function getSelectInstance(elem) {
  return M.FormSelect.getInstance(elem);
}

//Init Autocomplete
const autocomplete = document.querySelectorAll('.autocomplete');
M.Autocomplete.init(autocomplete);

export function getAutocompleteInstance(elem) {
  return M.Autocomplete.getInstance(elem);
}

//Init Datepickers
const datepicker = document.querySelectorAll('.datepicker');
M.Datepicker.init(datepicker, {
  showClearBtn: true,
  format: 'yyyy-mm',
  autoClose: true
});

export function getDatepickerInstance(elem) {
  return M.Datepicker.getInstance(elem);
}
