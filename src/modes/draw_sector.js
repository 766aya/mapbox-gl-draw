import * as CommonSelectors from "../lib/common_selectors";
import doubleClickZoom from '../lib/double_click_zoom';
import * as Constants from '../constants';
import dragPan from '../util/dragPan';
import { createSector, updateSector } from '../util/sectorGeojson';
import createGeodesicGeojson from '../util/createGeodesicGeojson';
import { distance, initialBearing } from '../util/geodesy';

//扇形
const DrawSector = {};

DrawSector.onSetup = function() {
  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  dragPan.disable(this);
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.setActionableState(); // default actionable state is false for all actions
  return {};
};

DrawSector.onMouseDown = DrawSector.onTouchStart = function(state, e) {
  const handle = [e.lngLat.lng, e.lngLat.lat];
  if (!state.sector) {
    const center = handle;
    const sector = this.newFeature(createSector(center, Number.EPSILON, 0, 0 + Number.EPSILON, { featureType: "sector" }));
    this.addFeature(sector);
    state.sector = sector;
    return;
  }
  if (state.sector && !state[Constants.properties.BEARING1] && !state[Constants.properties.BEARING2]) {
    const center = state.sector.properties[Constants.properties.CENTER];
    const radius = distance(center, handle);
    const bearing1 = initialBearing(center, handle);
    const { geometry, properties } = updateSector(center, radius, bearing1, bearing1 - Number.EPSILON, state.sector.toGeoJSON());
    state.sector.coordinates = geometry.coordinates;
    state.sector.properties = properties;
    state[Constants.properties.BEARING1] = bearing1;
    state.sector.changed();
  }
};

DrawSector.onMouseMove = function (state, e) {
  if (state.sector && state[Constants.properties.BEARING1]) {
    const handle = [e.lngLat.lng, e.lngLat.lat];
    const center = state.sector.properties[Constants.properties.CENTER];
    const bearing2 = initialBearing(center, handle);
    const { geometry, properties } = updateSector(center, state.sector.properties[Constants.properties.RADIUS], state[Constants.properties.BEARING1], bearing2, state.sector.toGeoJSON());
    state.sector.coordinates = geometry.coordinates;
    state.sector.properties = properties;
    state[Constants.properties.BEARING2] = bearing2;
    state.sector.changed();
  }
};

DrawSector.onClick = DrawSector.onTap = function(state) {
  if (state[Constants.properties.BEARING2]) {
    this.map.fire(Constants.events.CREATE, { features: [state.sector.toGeoJSON()] });
    return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.sector.id] });
  }
};

DrawSector.onKeyUp = function(state, e) {
  if (CommonSelectors.isEscapeKey(e)) {
    if (state.sector) {
      this.deleteFeature([state.sector.id], { silent: true });
    }
    this.changeMode(Constants.modes.SIMPLE_SELECT);
  } else if (CommonSelectors.isEnterKey(e)) {
    this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.sector.id] });
  }
};

DrawSector.onStop = function() {
  this.updateUIClasses({ mouse: Constants.cursors.NONE });
  doubleClickZoom.enable(this);
  dragPan.enable(this);
  this.activateUIButton();
};

DrawSector.toDisplayFeatures = function(state, geojson, display) {
  if (state.sector) {
    const isActivePolygon = geojson.properties.id === state.sector.id;
    geojson.properties.active = (isActivePolygon) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  }

  const displayGeodesic = (geojson) => {
    const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
    geodesicGeojson.forEach(display);
  };

  displayGeodesic(geojson);
};

export default DrawSector;
