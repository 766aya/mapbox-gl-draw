import * as CommonSelectors from "../lib/common_selectors";
import * as Constants from '../constants';
import { createCircle, getCircleCenter } from '../util/circleGeojson';
import { distance, initialBearing } from '../util/geodesy';
import createGeodesicGeojson from '../util/createGeodesicGeojson';
import dragPan from '../util/dragPan';
import doubleClickZoom from '../lib/double_click_zoom';

const DrawCircle = {};

DrawCircle.onSetup = function(properties) {
  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  dragPan.disable(this);
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.setActionableState(); // default actionable state is false for all actions
  return {
    properties,
  };
};

DrawCircle.onMouseDown = DrawCircle.onTouchStart = function(state, e) {
  const center = [e.lngLat.lng, e.lngLat.lat];
  const circle = this.newFeature(createCircle(center, Number.EPSILON, {
    ...state.properties,
    featureType: 'circle'
  }));
  this.addFeature(circle);
  state.circle = circle;
};

DrawCircle.onDrag = DrawCircle.onTouchMove = function(state, e) {
  if (state.circle) {
    const geojson = state.circle.toGeoJSON();
    const center = getCircleCenter(geojson);
    const handle = [e.lngLat.lng, e.lngLat.lat];
    const radius = distance(center, handle);
    const handleBearing = initialBearing(center, handle);
    state.circle.properties[Constants.properties.RADIUS] = radius;
    state.circle.properties[Constants.properties.BEARING] = handleBearing;
    state.circle.changed();
  }
};

DrawCircle.onMouseUp = DrawCircle.onTouchEnd = function(state) {
  this.map.fire(Constants.events.CREATE, { features: [state.circle.toGeoJSON()] });
  return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.circle.id] });
};

DrawCircle.onKeyUp = function(state, e) {
  if (CommonSelectors.isEscapeKey(e)) {
    if (state.circle) {
      this.deleteFeature([state.circle.id], { silent: true });
    }
    this.changeMode(Constants.modes.SIMPLE_SELECT);
  } else if (CommonSelectors.isEnterKey(e)) {
    this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.circle.id] });
  }
};

DrawCircle.onStop = function() {
  this.updateUIClasses({ mouse: Constants.cursors.NONE });
  doubleClickZoom.enable(this);
  dragPan.enable(this);
  this.activateUIButton();
};

DrawCircle.toDisplayFeatures = function(state, geojson, display) {
  if (state.circle) {
    const isActivePolygon = geojson.properties.id === state.circle.id;
    geojson.properties.active = (isActivePolygon) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  }

  const displayGeodesic = (geojson) => {
    const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
    geodesicGeojson.forEach(display);
  };

  displayGeodesic(geojson);
};

export default DrawCircle;
