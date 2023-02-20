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

const features = [
  {
    "id": "4bd5d6b30cb74097c61ea5d1108cdf3a",
    "type": "Feature",
    "properties": {
      "line-color": "#e600ff",
      "line-width": 2,
      "line-type": "solid",
      "line-active-color": "#ff0000",
      "line-active-type": "dashed",
      "text-anchor": "top",
      "name": "测试线5",
    },
    "geometry": {
      "coordinates": [
        [
          122.0186371744669,
          30.057057386482725
        ],
        [
          122.01880883584369,
          30.042199094924385
        ]
      ],
      "type": "LineString"
    }
  },
  {
    "id": "4bd5d6b30cb74097c61ea5d1108cdf4a",
    "type": "Feature",
    "properties": {
      "line-color": "#e600ff",
      "line-width": 2,
      "line-type": "solid",
      "line-active-color": "#ff0000",
      "line-active-type": "dashed",
      "name": "文本左对齐",
      "text-anchor": "left",
      "text-offset": [1, 1]
    },
    "geometry": {
      "coordinates": [
        [
          122.0786371744660,
          30.057057386482725
        ],
        [
          122.0786371744660,
          30.042199094924385
        ]
      ],
      "type": "LineString"
    }
  },
  {
    "id": "4bd5d6b30cb74097c61ea5d1108cdf5a",
    "type": "Feature",
    "properties": {
      "line-color": "#e600ff",
      "line-width": 2,
      "line-type": "solid",
      "line-active-color": "#ff0000",
      "line-active-type": "dashed",
      "name": "文本右对齐",
      "text-size": 20,
      "text-anchor": "right",
    },
    "geometry": {
      "coordinates": [
        [
          122.0986371744660,
          30.057057386482725
        ],
        [
          122.0986371744660,
          30.042199094924385
        ]
      ],
      "type": "LineString"
    }
  },
  {
    "id": "4bd5d6b30cb74097c61ea5d1108cdf6a",
    "type": "Feature",
    "properties": {
      "line-color": "#e600ff",
      "line-width": 2,
      "line-type": "solid",
      "line-active-color": "#ff0000",
      "line-active-type": "dashed",
      "name": "文本下对其",
      "text-anchor": "bottom",
    },
    "geometry": {
      "coordinates": [
        [
          122.1186371744660,
          30.057057386482725
        ],
        [
          122.1186371744660,
          30.042199094924385
        ]
      ],
      "type": "LineString"
    }
  },
  {
    "id": "4bd5d6b30cb74097c61ea5d1108cdf7a",
    "type": "Feature",
    "properties": {
      "line-color": "#e600ff",
      "line-width": 2,
      "line-type": "solid",
      "line-active-color": "#ff0000",
      "line-active-type": "dashed",
      "name": "文本居中对齐",
      "text-anchor": "center"
    },
    "geometry": {
      "coordinates": [
        [
          122.1386371744660,
          30.057057386482725
        ],
        [
          122.1386371744660,
          30.042199094924385
        ]
      ],
      "type": "LineString"
    }
  },
  {
    "id": "4bd5d6b30cb74097c61ea5d1108cdf9a",
    "type": "Feature",
    "properties": {
      "line-width": 2,
      "line-type": "dashed",
      "line-active-type": "solid",
      "name": "文本线上平铺",
      "text-anchor": "bottom",
      "symbol-placement": "line",
      "text-offset": [0, 0],
      // "text-rotation-alignment": "map",
    },
    "geometry": {
      "coordinates": [
        [
          122.1586371744660,
          30.057057386482725
        ],
        [
          122.1586371744660,
          30.042199094924385
        ]
      ],
      "type": "LineString"
    }
  },
];

for (const feature of features) {
  drawLineString.add(feature);
  draw.add(feature);
}
