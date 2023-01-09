class DrawLineString {
  /**
   * @type { mapboxgl.Map }
   */
  map;

  /**
   * @type { MapboxDraw }
   */
  draw;

  /**
   * @type { GeoJSON.Feature[] }
   */
  featureList = [];

  /**
   * @type { HTMLElement }
   */
  featureListLayout;

  /**
   * @type { GeoJSON.Feature | null }
   */
  selectedFeature;

  constructor (map, draw) {
    this.map = map;
    this.draw = draw;

    this.featureListLayout = document.querySelector(".feature-list-layout");

    this.map.on("draw.create", this.onDrawCreateListener.bind(this));
    this.map.on("draw.update", this.onDrawUpdateListener.bind(this));
    this.map.on("draw.selectionchange", this.onDrawSelectionchangeListener.bind(this));

    document.getElementById("save-button").addEventListener("click", () => {
      if (this.selectedFeature) {
        this.update(this.selectedFeature);
      }
    });
    document.getElementById("cancel-button").addEventListener("click", () => {
      this.draw.select(null);
    });
  }

  drawLineString (properties = {}) {
    this.draw.changeMode("draw_line_string", properties);
  }

  /**
   * 创建要素回调
   */
  onDrawCreateListener ({ features }) {
    this.add(features[0]);
  }

  /**
   * 修改要素回调
   */
  onDrawUpdateListener ({ features }) {
    if (Array.isArray(features) && features.length !== 0) {
      this.update(features[0]);
    }
  }

  onDrawSelectionchangeListener ({ features }) {
    const buttonLayout = document.querySelector(".controller-layout .button-layout");
    if (features.length !== 0) {
      buttonLayout.style.display = "flex";
      this.selectedFeature = features[0];
    } else {
      buttonLayout.style.display = "none";
      this.selectedFeature = null;
    }
  }

  /**
   * 创建要素详情DOM
   * @param { GeoJSON.Feature } feature
   */
  _createFeatureItem (feature) {
    const featureItem = document.createElement("div");
    featureItem.classList.add("feature-item");
    featureItem.id = feature.id;
    const featureInfoLayout = document.createElement("div");
    featureInfoLayout.classList.add("feature-info-layout");

    const idInfo = document.createElement("div");
    idInfo.classList.add("feature-info-item");
    const idLabel = document.createElement("div");
    idLabel.classList.add("feature-info-item__label");
    idLabel.innerText = "id";
    const idValue = document.createElement("div");
    idValue.classList.add("feature-info-item__content");
    idValue.innerText = feature.id;
    idInfo.appendChild(idLabel);
    idInfo.appendChild(idValue);
    featureInfoLayout.appendChild(idInfo);

    const keys = Object.keys(feature.properties);
    for (const key of keys) {
      const featureInfoItem = document.createElement("div");
      featureInfoItem.classList.add("feature-info-item");
      const label = document.createElement("div");
      label.classList.add("feature-info-item__label");
      label.innerText = key;
      const value = document.createElement("div");
      value.classList.add("feature-info-item__content");
      value.innerText = feature.properties[key];
      featureInfoItem.appendChild(label);
      featureInfoItem.appendChild(value);
      featureInfoLayout.appendChild(featureInfoItem);
    }
    const buttonLayout = document.createElement("div");
    buttonLayout.classList.add("button-layout");
    const updateButton = document.createElement("button");
    updateButton.innerText = "编辑";
    updateButton.addEventListener("click", () => {
      this.draw.select(feature.id);
    });
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "删除";
    deleteButton.addEventListener("click", () => this.remove(feature.id));
    buttonLayout.appendChild(updateButton);
    buttonLayout.appendChild(deleteButton);
    featureItem.appendChild(featureInfoLayout);
    featureItem.appendChild(buttonLayout);
    return featureItem;
  }

  /**
   * 创建线要素
   * @param { GeoJSON.Feature } feature
   */
  add (feature) {
    this.featureList.push(feature);
    const featureItemElement = this._createFeatureItem(feature);
    this.featureListLayout.appendChild(featureItemElement);
  }

  /**
   * 修改线要素
   * @param { GeoJSON.Feature } feature
   */
  update (feature) {
    console.log(feature);
    feature.properties = Object.assign(feature.properties, this.buildProperties());
    const propertiesKeys = Object.keys(feature.properties);
    for (const property of propertiesKeys) {
      this.draw.setFeatureProperty(feature.id, property, feature.properties[property]);
    }
    this.draw.select(null);
    const index = this.featureList.findIndex(item => item.id === feature.id);
    if (index !== -1) {
      this.featureList.splice(index, 1, feature);
      this.featureListLayout.innerHTML = "";
      for (const feature of this.featureList) {
        const featureItem = this._createFeatureItem(feature);
        this.featureListLayout.appendChild(featureItem);
      }
    }
  }

  remove (featureId) {
    const index = this.featureList.findIndex(feature => feature.id === featureId);
    if (index !== -1) {
      const [feature] = this.featureList.splice(index, 1);
      const featureElement = document.getElementById(feature.id);
      featureElement.parentElement.removeChild(featureElement);
      this.draw.delete(feature.id);
    }
  }

  buildProperties () {
    const result = {};
    const form = document.getElementById("form");

    const lineColor = form.querySelector("input#line-color");
    const lineWidth = form.querySelector("input#line-width");
    const lineActiveColor = form.querySelector("input#line-active-color");

    result["line-color"] = lineColor.value;
    result["line-width"] = Number(lineWidth.value);
    result["line-active-color"] = lineActiveColor.value;

    return result;
  }

}
