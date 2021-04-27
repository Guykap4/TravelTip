import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    document.querySelector('.btn-user-pos').addEventListener('click', onGetUserPos);
    document.querySelector('.search-button').addEventListener('click', onSearchLocation);
    // renderLocTable();
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
            console.log(locService.getSavedLocations());
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
            // document.querySelector('.user-pos').innerText =
            //     `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
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
    const removeBtns = document.querySelector('.card-remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', onRemoveLocation);
    })
}

function renderLocTable() {
    const locations = locService.getSavedLocations();
    let locationStr = locations.map(loc => {
        return `
            <div class="location-card" data-id="${loc.id}">
                <p>${loc.name}</p>
                <button class="btn card-go-btn">GO</button>
                <button class="btn card-remove-btn">Remove</button>
            </div>
        `
    }).join('')
    document.querySelector('.locations-container').innerHTML = locationStr;
    addEvents();

}


function onRemoveLocation(ev) {
    const locId = ev.target.dataset.id;
    removeLocation(locId);
    renderLocTable();
}


function onGoToLocation(ev) {
    console.log(ev)
}