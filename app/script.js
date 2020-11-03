// Creamos mapa y el origen de la cap
const map = L.map('map-template').setView([20, 50], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



// Creamos marcador manual con coprdenadas fijas
const marker = L.marker([51.5, -0.09]);
marker.bindPopup('Hello There');
map.addLayer(marker);

// Diseño de marcador con icon leaflet obj
const myIcon = L.icon({
    iconUrl: 'https://walkexperience.org/wp-content/uploads/2020/06/Walk-logo-97.png',
    iconSize: [24, 25], // size of the icon
    iconAnchor: [12, 25]

});
const issIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/International-Space-Station_mark.svg/268px-International-Space-Station_mark.svg.png',
    iconSize: [45, 45],
    iconAnchor: [12, 45]
});
L.marker([41.5, 1.5], { icon: myIcon }).addTo(map); //ecuador 0 0

//Incorporar posición del usuario
//Con el protocolo webscket el servidor http envía eventos en tiempo real cuando los usuarios se conectan

const url_apiISS = 'http://api.open-notify.org/iss-now.json';
// Petición API ISS
async function getISS() {
    const res = await fetch(url_apiISS);
    const data = await res.json();
    const timeSeconds = data.timestamp;
    const { latitude, longitude } = data.iss_position;

    // Transformar string substring() devuelve la parte de string entre los índices inicial y final, o hasta el final de la cadena. Así se muestran menos decimales en lat y lng
    const latitudeDos = latitude.charAt(0)=='-' ? latitude.substring(0,6): latitude.substring(0,5);
        console.log(latitudeDos);
    const longitudeDos = longitude.charAt(0)=='-' ? longitude.substring(0,6) : longitude.substring(0,5);
        console.log(longitudeDos);
    document.getElementById('lat').textContent = latitudeDos;
    document.getElementById('lng').textContent = longitudeDos;

    // Creamos marcador ISS
    const markerISS = L.marker([latitude, longitude], { icon: issIcon });
    
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
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    // Ver hora de paso en pop up
    markerISS.bindPopup('ISS passed at ' + formattedTime);
    map.addLayer(markerISS);
    setTimeout(getISS, 20000);
    
}

getISS().catch((err) => {
    console.log('In catch !!!')
    console.log(err);
});

setTimeout(getISS(), 2000);
