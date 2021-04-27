import { API_KEY } from './api.service.js'
import { utilService } from './util.service.js'
import { storageService } from './storage.service'
const KEY = 'locations'

const gLocations = storageService.loadFromStorage(KEY) || [];

export const locService = {
    getLocs,
    searchPlace,
}


function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function searchPlace(val) {
    return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${val}&inputtype=textquery&fields=geometry&key=${API_KEY}`).then(res => res.data)
}

function createLocations(location) {
    const { name, lat, lng } = location;
    gLocations.push(_createLocation(name, lat, lng))
}


function _createLocation(name, lat, lng) {
    return {
        id: utilService.makeId,
        name,
        lat,
        lng,
        weather: '',
        createdAt: Date.now(),
        updatedAt: ''
    }
}