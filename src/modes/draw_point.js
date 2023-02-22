import * as CommonSelectors from "../lib/common_selectors";
import * as Constants from "../constants";
import createGeodesicGeojson from "../util/createGeodesicGeojson";

const DrawPoint = {};

DrawPoint.onSetup = function (properties = {}) {

  const point = this.newFeature({
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      ...properties,
      featureType: "point",
    },
    geometry: {
      type: Constants.geojsonTypes.POINT,
      coordinates: [],
    },
  });

  this.addFeature(point);

  this.clearSelectedFeatures();
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.activateUIButton(Constants.types.POINT);

  this.setActionableState({
    trash: true,
  });

  return { point };
};

DrawPoint.stopDrawingAndRemove = function (state) {
  this.deleteFeature([state.point.id], { silent: true });
  this.changeMode(Constants.modes.SIMPLE_SELECT);
};

DrawPoint.onTap = DrawPoint.onClick = function (state, e) {
  this.updateUIClasses({ mouse: Constants.cursors.MOVE });
  state.point.updateCoordinate("", e.lngLat.lng, e.lngLat.lat);
  this.map.fire(Constants.events.CREATE, {
    features: [state.point.toGeoJSON()],
  });
  this.changeMode(Constants.modes.SIMPLE_SELECT, {
    featureIds: [state.point.id],
  });
};

DrawPoint.onStop = function (state) {
  this.activateUIButton();
  if (!state.point.getCoordinate().length) {
    this.deleteFeature([state.point.id], { silent: true });
  }
};

DrawPoint.toDisplayFeatures = function (state, geojson, display) {
  const displayGeodesic = (geojson) => {
    const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
    geodesicGeojson.forEach(display);
  };
  // Never render the point we're drawing
  const isActivePoint = geojson.properties.id === state.point.id;
  geojson.properties.active = isActivePoint ?
    Constants.activeStates.ACTIVE :
    Constants.activeStates.INACTIVE;
  if (!isActivePoint) return displayGeodesic(geojson);
};

DrawPoint.onTrash = DrawPoint.stopDrawingAndRemove;

DrawPoint.onKeyUp = function (state, e) {
  if (CommonSelectors.isEscapeKey(e) || CommonSelectors.isEnterKey(e)) {
    return this.stopDrawingAndRemove(state, e);
  }
};

export default DrawPoint;
