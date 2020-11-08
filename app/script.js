// Creamos mapa y el origen de la capa con tiles
const map = L.map("map-template").setView([20, 50], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Marcadores
// Creamos marcador manual con coprdenadas fijas
const markerIcon = L.marker([51.5, -0.09]);
const coordLat = 0;
const coordLong = 0;
markerIcon.setLatLng([coordLat, coordLong]);

// Diseño de iconos leaflet obj
// Mi icono
const myIcon = L.icon({
  iconUrl:
    "https://walkexperience.org/wp-content/uploads/2020/06/Walk-logo-97.png",
  iconSize: [24, 25], // size of the icon
  iconAnchor: [12, 25],
});

// ISS icono
const issIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/International-Space-Station_mark.svg/268px-International-Space-Station_mark.svg.png",
  iconSize: [25, 25],
  iconAnchor: [12, 45],
});

// ISS icono mayor
const issIconBig = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/International-Space-Station_mark.svg/268px-International-Space-Station_mark.svg.png",
  iconSize: [85, 85],
  iconAnchor: [12, 25],
});

// Añadimos marcadores
map.addLayer(markerIcon);
markerIcon.bindPopup(
  "here is the intersection of 0 degrees latitude (known as the Equator) and 0 degrees longitude (known as the Prime Meridian)"
);

const myIconMarker = L.marker([41.5, 1.5], { icon: myIcon }).addTo(map); //ecuador 0 0
myIconMarker.bindPopup(
  '<a href="https://walkexperience.org/">WalkExperience</a>'
);

//Incorporar posición del usuario
//Con el protocolo webscket el servidor http envía eventos en tiempo real cuando los usuarios se conectan

// Petición API ISS
const url_apiISS = "http://api.open-notify.org/iss-now.json";
const markerISS = L.marker([0, 0], { icon: issIcon }).addTo(map);

async function getISS() {
  const res = await fetch(url_apiISS);
  const data = await res.json();
  const timeSeconds = data.timestamp;
  const { latitude, longitude } = data.iss_position;
  markerISS.setLatLng([latitude, longitude]);
  console.log(typeof latitude);
  const latnum = +latitude;
  console.log(latnum + ": latnum");
  console.log(typeof latnum);
  //Transformar string substring() devuelve la parte de string entre los índices inicial y final, o hasta el final de la cadena. Así se muestran menos decimales en lat y lng
  const latitudeText =
    latitude.charAt(0) == "-"
      ? latitude.substring(0, 6)
      : latitude.substring(0, 5);
  console.log(latitudeText);
  const longitudeText =
    longitude.charAt(0) == "-"
      ? longitude.substring(0, 6)
      : longitude.substring(0, 5);
  console.log(longitudeText);
  document.getElementById("lat").textContent = latitudeText;
  document.getElementById("lng").textContent = longitudeText;

  // marker is moved via setLatLng or by dragging. Old and new coordinates are included in event arguments as oldLatLng, latlng.
  // Always set the view to current lat lon and zoom!
  map.setView([latitude, longitude], map.getZoom());
  // Captamos evento zoomend - in order to change the size of the markers
  // Resize marker icons depending on zoom level issue #1 -I did not resolve it
  // I Create another biggest marker that will be changed on the map zooming

  map.on("zoomend", function () {
    var currentZoom = map.getZoom();
    console.log(currentZoom);
    if (map.getZoom() > 4) {
      markerISS.setIcon(issIconBig);
    } else {
      markerISS.setIcon(issIcon);
    }
  });

  // Center view map with center ISS -setView()
  const zoomISS = document.getElementById("view-zoom");
  zoomISS.addEventListener("click", function () {
    map.setView([latitude, longitude], 8);
  });
  //map.setView([latitude, longitude],5)
  // time
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let date = new Date(timeSeconds * 1000);
  // Hours part from the timestamp
  let hours = date.getHours();
  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  let seconds = "0" + date.getSeconds();
  // Will display time in 10:30:23 format
  let formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  // Ver hora de paso en pop up
  markerISS.bindPopup("ISS passed at " + formattedTime);
  map.addLayer(markerISS);
  // refreshing new data from the ISS API
  setTimeout(getISS, 2000);
}

const api_url = "https://api.wheretheiss.at/v1/satellites/25544";
let firstTime = true;

// errors
getISS().catch((err) => {
  console.log("In catch !!!");
  console.log(err);
});



// "loop" with setTimeout() after the fetching is done
// If the request takes more than 1 second (maybe a slow server or internet connection issues) over a long period of time, setInterval() will push lots of callback calls to the event queue.
setTimeout(getISS, 2000);

// Set init view map with center ISS -setView()
const viewInit = document.getElementById("init-view");
viewInit.addEventListener("click", function () {
  map.setView([20, 50], 2);
  noDisplay();
});

// Set Geolocation.getCurrentPosition(): Retrieves the device's current location.
const viewGeolocation = document.getElementById("view-geolocation");
viewGeolocation.addEventListener("click", function () {
  if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      console.log(lat, lon);
     
      const mapAbsolute = L.map("map-absolute").setView([lat, lon], 15);
      const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const tiles = L.tileLayer(tileUrl, { attribution });
      tiles.addTo(mapAbsolute);
      const marker = L.marker([lat, lon]).addTo(mapAbsolute);
    });
  } else {
    console.log("geolocation not available");
  }
});


