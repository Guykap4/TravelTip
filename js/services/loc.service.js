import { API_KEY } from './api.service.js'

export const locService = {
    getLocs,
    searchPlace,
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

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