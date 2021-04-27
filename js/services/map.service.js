import { API_KEY } from './api.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo
}

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            });
        })
        .then(() => {
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Location!",
                position: { lat, lng },
              });
              infoWindow.open(gMap);
              // Configure the click listener.
              gMap.addListener('click', (mapsMouseEvent) => {
                // Close the current InfoWindow.
                infoWindow.close();
                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                  position: mapsMouseEvent.latLng,
                });

                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: mapsMouseEvent.latLng}, (results) => {
                    console.log(results[0]);
                    infoWindow.setContent(
                      
                    `<span>${results[0].formatted_address}</span>
                    <div class="info-window-btn" onclick="onAddPlace('${results[0].formatted_address}', ${mapsMouseEvent.latLng})">Add Location</div>`
                    );
                    // document.querySelector('.info-window-btn').addEventListener('click', () => {
                    //     console.log();
                    // })
                })
                infoWindow.open(gMap);
              });
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
