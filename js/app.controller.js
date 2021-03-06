import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddPlace = onAddPlace;
window.renderDisplayedPlace = renderDisplayedPlace;

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    document.querySelector('.btn-user-pos').addEventListener('click', onGetUserPos);
    document.querySelector('.search-button').addEventListener('click', onSearchLocation);
    renderLocTable();
}

function onSearchLocation() {
    const locationName = document.querySelector('input[name=location-search]').value;
    locService.searchPlace(locationName)
        .then(res => {
            console.log(res)
            const pos = res.candidates[0].geometry.location;
            mapService.panTo(pos.lat, pos.lng);
            mapService.addMarker({ lat: pos.lat, lng: pos.lng });
            locService.createLocations({ name: locationName, lat: pos.lat, lng: pos.lng })
            renderLocTable();
            renderDisplayedPlace(locationName);
        })
    // .catch(console.log('Zero Results'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            mapService.panTo(pos.coords.latitude, pos.coords.longitude);
            mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function addEvents() {
    const goBtns = document.querySelectorAll('.card-go-btn')
    goBtns.forEach(btn => {
        btn.addEventListener('click', onGoToLocation);
    });
    const removeBtns = document.querySelectorAll('.card-remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', onRemoveLocation);
    })

}

function renderLocTable() {
    const locations = locService.getSavedLocations();
    let locationStr = locations.map(loc => {
        return `
            <div class="location-card">
                <p>${loc.name}</p>
                <button class="btn card-go-btn" data-name="${loc.name}" data-pos="${loc.lat},${loc.lng}">GO</button>
                <button class="btn card-remove-btn"  data-id="${loc.id}">Remove</button>
            </div>
        `
    }).join('')
    document.querySelector('.locations-container').innerHTML = locationStr;
    addEvents();

}


function onRemoveLocation(ev) {
    const locId = ev.target.dataset.id;
    locService.removeLocation(locId);
    renderLocTable();
}


function onGoToLocation(ev) {
    let pos = ev.target.dataset.pos;
    pos = pos.split(',');
    console.log(pos)
    mapService.panTo(pos[0], pos[1]);
    renderDisplayedPlace(ev.target.dataset.name);
}

function onAddPlace(name, lat, lng) {
    locService.createLocations({name, lat, lng});
    renderLocTable();
}

function renderDisplayedPlace(name) {
    document.querySelector('.location-span').innerText = name;
}