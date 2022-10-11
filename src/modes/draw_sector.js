import * as CommonSelectors from '../lib/common_selectors';
import doubleClickZoom from '../lib/double_click_zoom';
import * as Constants from '../constants';
import DrawUtil from "../util/DrawUtils";

//扇形
const DRAW_SECTOR = {};

DRAW_SECTOR.onSetup = function () {
  const polygon = this.newFeature({
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      type: 'sector',
      points: []
    },
    geometry: {
      type: Constants.geojsonTypes.POLYGON,
      coordinates: [[]]
    }
  });

  this.addFeature(polygon);

  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  this.map.dragPan.disable();
  this.updateUIClasses({mouse: Constants.cursors.ADD});
  this.activateUIButton(Constants.types.POLYGON);
  this.setActionableState({
    trash: true
  });

  return {
    polygon,
    currentVertexPosition: 0
  };
};

DRAW_SECTOR.clickAnywhere = function (state, e) {
  if (state.currentVertexPosition === 0) {
    state.currentVertexPosition++;
    return;
  }

  const points = state.polygon.properties.points;

  if (points.length > 1) {

    const circleFeature = this.generate(points, [e.lngLat.lng, e.lngLat.lat]);
    state.polygon.incomingCoords(circleFeature);
    // return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
  }
  if (points.length > 2) {
    return this.changeMode(Constants.modes.SIMPLE_SELECT, {featureIds: [state.polygon.id]});
  }

};

DRAW_SECTOR.onMouseMove = function (state, e) {
  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
  if (CommonSelectors.isVertex(e)) {
    this.updateUIClasses({mouse: Constants.cursors.POINTER});
  }
};

DRAW_SECTOR.onTap = DRAW_SECTOR.onClick = function (state, e) {
  if (CommonSelectors.isVertex(e)) return this.clickOnVertex(state, e);
  return this.clickAnywhere(state, e);
};

DRAW_SECTOR.onKeyUp = function (state, e) {
  if (CommonSelectors.isEscapeKey(e)) {
    this.deleteFeature([state.polygon.id], {silent: true});
    this.changeMode(Constants.modes.SIMPLE_SELECT);
  } else if (CommonSelectors.isEnterKey(e)) {
    this.changeMode(Constants.modes.SIMPLE_SELECT, {featureIds: [state.polygon.id]});
  }
};

DRAW_SECTOR.onStop = function (state) {
  this.updateUIClasses({mouse: Constants.cursors.NONE});
  doubleClickZoom.enable(this);
  this.activateUIButton();

  // check to see if we've deleted this feature
  if (this.getFeature(state.polygon.id) === undefined) return;

  //remove last added coordinate
  // state.polygon.removeCoordinate(`0.${state.currentVertexPosition}`);
  if (state.polygon.isValid()) {
    this.map.fire(Constants.events.CREATE, {
      features: [state.polygon.toGeoJSON()]
    });
  } else {
    this.deleteFeature([state.polygon.id], {silent: true});
    this.changeMode(Constants.modes.SIMPLE_SELECT, {}, {silent: true});
  }
};

DRAW_SECTOR.toDisplayFeatures = function (state, geojson, display) {

  const isActivePolygon = geojson.properties.id === state.polygon.id;
  geojson.properties.active = (isActivePolygon) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  return display(geojson);
};

DRAW_SECTOR.onTrash = function (state) {
  this.deleteFeature([state.polygon.id], {silent: true});
  this.changeMode(Constants.modes.SIMPLE_SELECT);
};


DRAW_SECTOR.onMouseDown = DRAW_SECTOR.onTouchStart = function (state, e) {
  const currentPoints = state.polygon.properties.points;
  if (currentPoints.length < 3) {
    state.polygon.properties.points.push([e.lngLat.lng, e.lngLat.lat]);
  }
};

DRAW_SECTOR.onDrag = DRAW_SECTOR.onMouseMove = function (state, e) {
  const points = state.polygon.properties.points;
  if (points.length > 1) {
    const circleFeature = this.generate(points, [e.lngLat.lng, e.lngLat.lat]);
    state.polygon.incomingCoords(circleFeature);
  }
};

DRAW_SECTOR.onMouseUp = DRAW_SECTOR.onTouchEnd = function (state) {
  this.map.dragPan.enable();
  return this.changeMode(Constants.modes.SIMPLE_SELECT, {featureIds: [state.polygon.id]});
};
export default DRAW_SECTOR;

DRAW_SECTOR.generate = function (points, coordinate) {
  const pnts = [];

  const length = points.length;
  Object.assign(pnts, points);
  if (length === 0 || pnts[length - 1][0] !== coordinate[0]) {
    pnts.push(coordinate);
  }
  return DrawUtil.drawSector(pnts);

};
