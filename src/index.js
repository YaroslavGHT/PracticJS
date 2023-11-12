import axios from 'axios';
import { pagination } from './pagination';

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/';
const API_KEY = 'uHSLi07StIOlriMPxJGxUbSYsHDs6AFx';
const lisOfEvents = document.querySelector('.events');
const page = pagination.getCurrentPage();
const searchForm = document.querySelector('.search-form');
const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');
let query = '';
console.log(query);

// 'https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey={apikey}';

async function fetchEvents(query, page) {
  const response = await axios.get(
    `${BASE_URL}events.json?apikey=${API_KEY}&page=${page}&keyword=${query}`
  );
  console.log(response.data);
  return response.data;
}

async function fetchEventId(id) {
  const response = await axios.get(
    `${BASE_URL}events.json?apikey=${API_KEY}&id=${id}`
  );
  console.log(response.data);
  return response.data;
}

function renderTemplate(arr) {
  const markup = arr
    .map(
      ({ name, id }) =>
        `<li id="${id}">
  <p id="${id}">${name}</p>
</li>`
    )
    .join('');
  lisOfEvents.innerHTML = markup;
}
async function renderFirstPage(query, page) {
  try {
    const data = await fetchEvents(query, page);
    renderTemplate(data._embedded.events);
    pagination.reset(data.page.totalElements);
  } catch (err) {
    console.log(err);
  }
}

renderFirstPage(query, page);

async function renderPage(query, page) {
  try {
    const data = await fetchEvents(query, page);
    renderTemplate(data._embedded.events);
  } catch (err) {
    console.log(err);
  }
}

pagination.on('afterMove', event => {
  const currentPage = event.page;
  console.log(currentPage);
  renderPage(query, currentPage);
});

searchForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  query = event.target.elements.searchQuery.value;
  renderFirstPage(query, page);
}

lisOfEvents.addEventListener('click', onClick);

function onClick(event) {
  backdrop.classList.remove('is-hidden');
  const elId = event.target.id;
  getEvent(elId);
}

async function getEvent(id) {
  try {
    const data = await fetchEventId(id);
    console.log(data);
    renderEvent(data._embedded.events);
  } catch (error) {
    console.log(error);
  }
}
function renderEvent(array) {
  const markup = `<img src="${array[0].images[0].url}" width="200" height="200">
<p>${array[0].name}</p>`;
  modal.innerHTML = markup;
}
backdrop.addEventListener('click', onCloseModal);
function onCloseModal() {
  backdrop.classList.add('is-hidden');
}
