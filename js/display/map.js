let list = null;

function onPackageSuccess(data) {
    list = JSON.parse(data);

    if (list) {
        initMap();
    }
}

function onPackageFailed(errorCode) {
    alert("Failed retrieving package : " + errorCode);
}

function getLocations(itinerary) {
    let locations = [];

    itinerary.forEach(package => {
        console.log(package);
        locations.push(
            {
                latLng: { lat: package.location[0], lng: package.location[1] }
            }
        );
    });

    locations.push(
        {
            latLng: { lat: itinerary[0].warehouses.location[0], lng: itinerary[0].warehouses.location[1] }
        }
    );

    return locations;
}

function createItinerarys(map) {

    const warehouses = [... new Set(list.map(package => package.warehouses.city))];

    warehouses.forEach(warehouse => {
        const itinerary = list.filter(package => package.warehouses.city == warehouse);

        let dir;
        dir = MQ.routing.directions();

        dir.route({
            locations: getLocations(itinerary)
        });

        CustomRouteLayer = MQ.Routing.RouteLayer.extend({
            createStopMarker: function (location, stopNumber) {
                var custom_icon,
                    marker;

                custom_icon = L.icon({
                    iconUrl: 'https://www.mapquestapi.com/staticmap/geticon?uri=poi-red_1.png',
                    iconSize: [20, 29],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });

                marker = L.marker(location.latLng, { icon: custom_icon })
                    .bindPopup(location.adminArea5 + ' ' + location.adminArea3)
                    .openPopup()
                    .addTo(map);

                return marker;
            },

            createEndMarker: function (location, stopNumber) {
                var custom_icon,
                    marker;

                custom_icon = L.icon({
                    iconUrl: 'https://www.mapquestapi.com/staticmap/geticon?uri=poi-blue_1.png',
                    iconSize: [20, 29],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });

                marker = L.marker(location.latLng, { icon: custom_icon })
                    .bindPopup(location.adminArea5 + ' ' + location.adminArea3)
                    .openPopup()
                    .addTo(map);

                return marker;
            }
        });

        map.addLayer(new CustomRouteLayer({
            directions: dir,
            fitBounds: true,
            draggable: false,
            ribbonOptions: {
                draggable: false,
                ribbonDisplay: { color: '#CC0000', opacity: 0.3 },
                widths: [15, 15, 15, 15, 14, 13, 12, 12, 12, 11, 11, 11, 11, 12, 13, 14, 15]
            }
        }));

    });

}

function initMap() {

    map = L.map('map', {
        layers: MQ.mapLayer(),
        center: [38.895345, -77.030101],
        zoom: 15
    });

    createItinerarys(map);
}

function generateMap(isDelivery) {
    if (isUserLogged()) {

        // Hide class menu 
        $("#selection-content").css("display","none");

        // Show table 
        $("#map").removeAttr("style");

        getPackageRequest(getUserInfo("token"), isDelivery, 0, 0, [0, 1, 2], onPackageSuccess, onPackageFailed);
    }
    else {
        window.location = "../login";
    }
}