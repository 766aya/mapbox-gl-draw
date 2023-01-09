window.mapboxgl.accessToken =
  "pk.eyJ1IjoieXVuZXI5OTY4IiwiYSI6ImNrazY1cTh1bzAwc24yd3AyMzBnbmtiMXYifQ.KmABHgQ1OZ4EVax3poOzyA";

const map = new window.mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [122.1703, 30.0474], // starting position [lng, lat]
  zoom: 12, // starting zoom
  boxZoom: false,
});

const draw = new window.MapboxDraw({
  boxSelect: false,
  displayControlsDefault: false,
});

map.addControl(draw);


// eslint-disable-next-line no-undef
const drawLineString = new DrawLineString(map, draw);

// 在地图上绘制线
const drawButton = document.getElementById("draw-button");

drawButton.addEventListener("click", () => {
  const properties = drawLineString.buildProperties();
  drawLineString.drawLineString(properties);
});

