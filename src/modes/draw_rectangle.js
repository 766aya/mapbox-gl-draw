import * as CommonSelectors from "../lib/common_selectors";
import * as Constants from "../constants";
import doubleClickZoom from '../lib/double_click_zoom';
import dragPan from "../util/dragPan";
import createGeodesicGeojson from "../util/createGeodesicGeojson";

const DrawRectangle = {};

DrawRectangle.onSetup = function () {
  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  dragPan.disable(this);
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.setActionableState(); // default actionable state is false for all actions
  return {};
};

DrawRectangle.onMouseDown = DrawRectangle.onTouchStart = function(state, e) {
  const point = [e.lngLat.lng, e.lngLat.lat];
  const rectangle = this.newFeature({
    type: Constants.geojsonTypes.FEATURE,
    geometry: {
      type: Constants.geojsonTypes.POLYGON,
      coordinates: [
        [
          point,
          point,
          point,
          point,
          point,
        ]
      ]
    },
    properties: {
      featureType: "rectangle",
      [Constants.properties.POINT1]: point
    }
  });
  this.addFeature(rectangle);
  state.rectangle = rectangle;
};

DrawRectangle.onDrag = DrawRectangle.onTouchMove = function(state, e) {
  if (state.rectangle) {
    const p1 = state.rectangle.properties[Constants.properties.POINT1];
    const p2 = [e.lngLat.lng, e.lngLat.lat];
    state.rectangle.properties[Constants.properties.POINT2] = p2;
    state.rectangle.coordinates = [
      [p1, [p1[0], p2[1]], p2, [p2[0], p1[1]], p1]
    ];
    state.rectangle.changed();
  }
};

DrawRectangle.onMouseUp = DrawRectangle.onTouchEnd = function(state) {
  this.map.fire(Constants.events.CREATE, { features: [state.rectangle.toGeoJSON()] });
  return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.rectangle.id] });
};

DrawRectangle.onKeyUp = function(state, e) {
  if (CommonSelectors.isEscapeKey(e)) {
    if (state.rectangle) {
      this.deleteFeature([state.rectangle.id], { silent: true });
    }
    this.changeMode(Constants.modes.SIMPLE_SELECT);
  } else if (CommonSelectors.isEnterKey(e)) {
    this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.rectangle.id] });
  }
};

DrawRectangle.onStop = function() {
  this.updateUIClasses({ mouse: Constants.cursors.NONE });
  doubleClickZoom.enable(this);
  dragPan.enable(this);
  this.activateUIButton();
};

DrawRectangle.toDisplayFeatures = function(state, geojson, display) {
  if (state.rectangle) {
    const isActivePolygon = geojson.properties.id === state.rectangle.id;
    geojson.properties.active = (isActivePolygon) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  }

  const displayGeodesic = (geojson) => {
    const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
    geodesicGeojson.forEach(display);
  };

  displayGeodesic(geojson);
};

export default DrawRectangle;
