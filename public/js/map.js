// map.js

function loadMap(locationName) {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
    center: [78.9629, 22.5937], // Initial center
    zoom: 4
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  function geocode(location) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

    return fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          throw new Error("Location not found");
        }
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      });
  }

  geocode(locationName)
    .then(coords => {
      new maplibregl.Marker({color: "red"})
        .setLngLat([coords.lon, coords.lat])
        .setPopup(new maplibregl.Popup({offset: 25})
        .setHTML("<h3>Welcome to Wanderlust!!!</h3>")
        .setText(coords.display_name))
        .addTo(map);

      map.flyTo({
        center: [coords.lon, coords.lat],
        zoom: 10
      });
    })
    .catch(err => {
      console.error(err);
      alert("Could not locate: " + locationName);
    });
}
