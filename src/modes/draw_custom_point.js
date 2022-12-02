import * as Constants from '../constants';
import DrawPoint from "./draw_point";

const DrawCustomPoint = {...DrawPoint};

DrawCustomPoint.onSetup = function() {
  const point = this.newFeature({
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      featureType: "customPoint"
    },
    geometry: {
      type: Constants.geojsonTypes.POINT,
      coordinates: []
    }
  });

  this.addFeature(point);

  this.clearSelectedFeatures();
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.activateUIButton(Constants.types.POINT);

  this.setActionableState({
    trash: true
  });

  return { point };
};

export default DrawCustomPoint;
