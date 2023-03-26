import './css/styles.css';
import { fetchCountries } from './fetchCountries'; 
import { debounce } from 'lodash';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 500;
const inputEl = document.querySelector('#search-box');
const ulEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleSearchCountry, DEBOUNCE_DELAY));

function cleanerPage() {
    ulEl.innerHTML = '';
    divEl.innerHTML = '';
}

function handleSearchCountry(e) {
    const searchCountry = e.target.value.trim();
    if (searchCountry === "") {
        cleanerPage();
        return;
    }
    
    fetchCountries(searchCountry)
        .then(data => {
            if (data.length > 10) {
                cleanerPage();
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");

            } else if (data.length >= 2 && data.length <= 10) {
                cleanerPage();
                markupListCountry(data);

            } else if (data.length === 1) {
                cleanerPage();
                markupBoxCountry(data);
            }
        })
        .catch((err) => { console.log(err) });
}

function markupListCountry(data) {
    const markupList = (({ name: { official }, flags: { svg } }) => {
        return `<li class="items"><img src="${svg}" alt="${official}" width=70 height=35>
                    <h2 class="sub-title" >${official}</h2></li>`;
    });
    const markup = data.map(d => markupList(d)).join("");
    ulEl.insertAdjacentHTML('beforeend', markup);
}

function markupBoxCountry(data) {
    const markupBox = (({ name: { official }, capital, population, flags: { svg }, languages }) => {
    const languagesCountry = Object.values(languages);
        return `  <img src="${svg}" alt="${official}" width=90 height=50>
                          <h1 class="title"> ${official}</h1>
                          <p><span class="article">Capital:</span> ${capital}</p> 
                          <p><span class="article">Population:</span> ${population}</p>
                          <p><span class="article">Language: </span>${languagesCountry}</p>`
    });   
    const markupCountry = data.map(d => markupBox(d)).join("");
    divEl.insertAdjacentHTML('beforeend', markupCountry);
}

