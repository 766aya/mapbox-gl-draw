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

class FeatureList {
  el;

  featureList = [];

  selectedFeature = null;

  constructor(el, featureList = []) {
    if (typeof el === "string") {
      this.el = document.querySelector(el);
    } else if (el instanceof HTMLElement) {
      this.el = el;
    } else {
      throw new TypeError("param el is not String or HTMLElement");
    }
    this.featureList = featureList;
  }

  _createInfoItem(label, value) {
    const row = document.createElement("div");
    row.classList.add("feature-info-item");

    const rowLabel = document.createElement("div");
    rowLabel.classList.add("feature-info-item__label");
    rowLabel.appendChild(document.createTextNode(label));

    const rowValue = document.createElement("div");
    rowValue.classList.add("feature-info-item__value");
    rowValue.appendChild(document.createTextNode(value));

    row.appendChild(rowLabel);
    row.appendChild(rowValue);

    return row;
  }

  add(feature) {
    const root = document.createElement("div");
    root.id = feature.id;
    root.classList.add("feature-item");

    const featureInfoLayout = document.createElement("div");
    featureInfoLayout.classList.add("feature-info-layout");
    const infoItemId = this._createInfoItem("id", feature.id);
    featureInfoLayout.appendChild(infoItemId);
    const propertiesKeys = Object.keys(feature.properties);
    for (const key of propertiesKeys) {
      const infoItem = this._createInfoItem(key, feature.properties[key]);
      featureInfoLayout.appendChild(infoItem);
    }

    const buttonLayout = document.createElement("div");
    buttonLayout.classList.add("button-layout");

    const updateButton = document.createElement("button");
    updateButton.classList.add("update-button", "feature-button");
    updateButton.innerText = "修改要素";
    updateButton.addEventListener("click", () => {
      draw.select(feature.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button", "feature-button");
    deleteButton.innerText = "删除要素";
    deleteButton.addEventListener("click", () => {
      draw.delete([feature.id]);
      this.el?.removeChild(root);
      const index = this.featureList.findIndex(
        item => item.id === feature.id
      );
      if (index !== -1) {
        this.featureList.splice(index, 1);
      }
    });

    buttonLayout.appendChild(updateButton);
    buttonLayout.appendChild(deleteButton);

    root.appendChild(featureInfoLayout);
    root.appendChild(buttonLayout);

    this.el?.appendChild(root);
  }

  _getRootElement(featureId) {
    return document.getElementById(featureId);
  }

  update (feature) {
    const root = this._getRootElement(feature.id);
    const featureInfoLayout = root?.querySelector(".feature-info-layout");
    featureInfoLayout.innerHTML = "";
    const infoItemId = this._createInfoItem("id", feature.id);
    featureInfoLayout.appendChild(infoItemId);
    const propertiesKeys = Object.keys(feature.properties);
    for (const key of propertiesKeys) {
      const infoItem = this._createInfoItem(key, feature.properties[key]);
      featureInfoLayout.appendChild(infoItem);
    }
  }

  setSelectedFeature(feature) {
    this.selectedFeature = feature;
    const circleColor = document.getElementById("circle-color");
    const circleActiveColor = document.getElementById("circle-active-color");
    const name = document.getElementById("name");
    const textSize = document.getElementById("text-size");
    const textColor = document.getElementById("text-color");

    circleColor.value = feature.properties["circle-color"];
    circleActiveColor.value = feature.properties["circle-active-color"];
    name.value = feature.properties["name"];
    textSize.value = feature.properties["text-size"];
    textColor.value = feature.properties["text-color"];

  }
}

const featureList = new FeatureList(".feature-list-layout");

const directDrawPointButton = document.getElementById(
  "direct-draw-point-button"
);

const controllerButtonLayout = document.querySelector(".controller-layout .button-layout");

directDrawPointButton.addEventListener("click", () => {
  const options = {};
  const circleColor = document.getElementById("circle-color");
  const circleActiveColor = document.getElementById("circle-active-color");
  const name = document.getElementById("name");
  const textSize = document.getElementById("text-size");
  const textColor = document.getElementById("text-color");

  options["circle-color"] = circleColor.value;
  options["circle-active-color"] = circleActiveColor.value;
  options["name"] = name.value;
  options["text-size"] = Number(textSize.value);
  options["text-color"] = textColor.value;

  draw.changeMode("draw_point", options);
});

document.getElementById("save-button").addEventListener("click", () => {
  if (!featureList.selectedFeature) return;
  const circleColor = document.getElementById("circle-color");
  const circleActiveColor = document.getElementById("circle-active-color");
  const name = document.getElementById("name");
  const textSize = document.getElementById("text-size");
  const textColor = document.getElementById("text-color");

  draw.setFeatureProperty(featureList.selectedFeature.id, "circle-color", circleColor.value);
  draw.setFeatureProperty(featureList.selectedFeature.id, "circle-active-color", circleActiveColor.value);
  draw.setFeatureProperty(featureList.selectedFeature.id, "name", name.value);
  draw.setFeatureProperty(featureList.selectedFeature.id, "text-size", Number(textSize.value));
  draw.setFeatureProperty(featureList.selectedFeature.id, "text-color", textColor.value);
  draw.select(null);

  featureList.update(featureList.featureList);
});

document.getElementById("cancel-button").addEventListener("click", () => {
  draw.select(null);
});

map.on("draw.create", ({ features }) => {
  featureList.add(features[0]);
});

map.on("draw.update", ({ features }) => {
  featureList.update(features[0]);
});

map.on("draw.selectionchange", ({ features }) => {
  if (features.length !== 0) {
    controllerButtonLayout.style.display = "flex";
    featureList.setSelectedFeature(features[0]);
  } else {
    controllerButtonLayout.style.display = "none";
    featureList.setSelectedFeature(null);
  }
});

map.on("draw.clickOnFeature", ({ feature }) => {
  console.log("要素被点击", feature);
});
