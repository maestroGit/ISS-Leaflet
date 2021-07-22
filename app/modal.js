// Modal window
const closing = ()=>{
    console.log("hi arrow function!");
    modal.style.visibility="hidden";
    //modal.style.background="red";
}

// Get elements
const modal = document.getElementsByClassName('modal')[0];
const closed = document.getElementById('closed');

// Listen for closed modal window
closed.addEventListener('click', closing);

// map pop up
// Set Geolocation.getCurrentPosition(): Retrieves the device's current location.
const viewGeolocation = document.getElementById("view-geolocation");
viewGeolocation.addEventListener("click", function () {
  if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      console.log(lat, lon);

      modal.style.visibility="visible";

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


