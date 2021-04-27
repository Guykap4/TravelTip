import { utilService } from './util.service.js'

const gLocations = [];

export const locService = {
    getLocs
}


function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
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