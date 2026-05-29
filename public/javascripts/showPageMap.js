const campgroundEl = document.getElementById("campground-data");

const maptilerApiKey = campgroundEl.dataset.mapToken;
const campgroundData = JSON.parse(campgroundEl.dataset.campground);

maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.BRIGHT,
    center: campgroundData.geometry.coordinates,
    zoom: 10
});

new maptilersdk.Marker()
    .setLngLat(campgroundData.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(`<h3>${campgroundData.title}</h3><p>${campgroundData.location}</p>`)
    )
    .addTo(map);