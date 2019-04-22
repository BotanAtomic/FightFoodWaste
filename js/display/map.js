let list = null;
function onPackageSuccess (data){
    list = JSON.parse(data);

    if(list){
        initMap();
    }
}

function generateItinerary(map,origin,destination){
    var directions = L.mapbox.directions();

    console.log(directions);
    directions.setOrigin(L.latLng(origin[0],origin[1]));
    directions.setDestination(L.latLng(destination[0], destination[1]));
    directions.query();
    
    var directionsLayer = L.mapbox.directions.layer(directions).addTo(map);
   // var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions).addTo(map);
    var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions).addTo(map);
    var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions).addTo(map);
    // var directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions).addTo(map);
}

function initMap(){
    L.mapbox.accessToken = 'pk.eyJ1IjoicGF1bHN1bmt5byIsImEiOiJjanVzaGN6aW8wbGtoNGRuNnh4cWVrZ2htIn0.HPK1Q8N9S8im4PMidARzOQ';

    let map = L.mapbox.map('map', null, {
    zoomControl: false
    })
  .setView([48.898961, 2.518569], 9)
  .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

    // move the attribution control out of the way
    map.attributionControl.setPosition('bottomleft');


    list.forEach(package => {
       console.log(package);
       generateItinerary(map,[48.898961, 2.518569],[48.886873, 2.544347]);
    });
   
}

function onPackageFailed(errorCode){
    alert("Failed retrieving package : " + errorCode);
}

function generateMap()
{
    if (isUserLogged()) {
        const permission = getUserInfo("permission") === 1;
        getPackageRequest(getUserInfo("token"), permission, 0,0, [0, 1, 2], onPackageSuccess, onPackageFailed);
    }
    else
    {
        window.location = "../login";
    } 
}