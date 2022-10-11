import { distance, circle, helpers as turfHelpers } from "@turf/turf";
import PlotUtils from './PlotUtils';

const DrawUtil = {};

DrawUtil.drawPlot = function (type, points, tempArg) {
  if (type === 'arc_line') { //圆弧
    return this.drawArcLine(points);
  } else if (type === 'circle') { //圆
    return this.drawCircle(points);
  } else if (type === 'curve_line') { //曲线
    return this.drawCurveLine(points);
  } else if (type === 'double_arrow') { //钳击
    return this.drawDoubleArrow(points, tempArg);
  } else if (type === 'gather_place') { //聚集地
    return this.drawGatherPlace(points, tempArg);
  } else if (type === 'sector') { //扇形
    return this.drawSector(points);
  } else if (type === 'tailed_squad_combat') { //双尾箭头
    return this.drawTailedSquadCombat(points, tempArg);
  } else if (type === 'line_arrow') { //带箭头的线
    return this.drawLineArrow(points, tempArg);
  }
};


//画圆函数
DrawUtil.drawCircle = function (points) {
  if (points.length < 2) {
    return;
  }
  const distanceInKm = distance(
    turfHelpers.point(points[0]),
    turfHelpers.point(points[1]), {units: 'kilometers'});
  const circleFeature = circle(points[0], distanceInKm);
  return circleFeature.geometry.coordinates;
};

//画曲线
DrawUtil.drawCurveLine = function (points) {

  if (points.length < 2) {
    return [];
  }
  if (points.length === 2) {
    return points;
  } else {
    return PlotUtils.getCurvePoints(0.3, points);
  }
};

//画圆弧
DrawUtil.drawArcLine = function (points) {


  if (points.length <= 1)
    return points;

  const pnt1 = PlotUtils.wgsToMercator(points[0]);
  const pnt2 = PlotUtils.wgsToMercator(points[1]);
  const pnt3 = PlotUtils.wgsToMercator(points[2]);
  const center = PlotUtils.getCircleCenterOfThreePoints(pnt1, pnt2, pnt3);
  const radius = PlotUtils.distance(pnt1, center);

  const angle1 = PlotUtils.getAzimuth(pnt1, center);
  const angle2 = PlotUtils.getAzimuth(pnt2, center);
  let startAngle = 0;
  let endAngle = 0;
  if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
    startAngle = angle2;
    endAngle = angle1;
  } else {
    startAngle = angle1;
    endAngle = angle2;
  }
  return PlotUtils.getArcPoints(center, radius, startAngle, endAngle);

};

DrawUtil.drawDoubleArrow = function (points, tempArg) {


  const count = points.length;
  if (count < 2) {
    return [[]];
  }
  if (count === 2) {
    return [points];
  }
  const pnt1 = points[0];
  const pnt2 = points[1];
  const pnt3 = points[2];
  if (count === 3)
    tempArg.tempPoint4 = this.getTempPoint4(pnt1, pnt2, pnt3);
  else
    tempArg.tempPoint4 = points[3];
  if (count === 3 || count === 4)
    tempArg.connPoint = PlotUtils.mid(pnt1, pnt2);
  else
    tempArg.connPoint = points[4];
  let leftArrowPnts, rightArrowPnts;
  if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
    leftArrowPnts = this.getArrowPoints(pnt1, tempArg.connPoint, tempArg.tempPoint4, false, tempArg);
    rightArrowPnts = this.getArrowPoints(tempArg.connPoint, pnt2, pnt3, true, tempArg);
  } else {
    leftArrowPnts = this.getArrowPoints(pnt2, tempArg.connPoint, pnt3, false, tempArg);
    rightArrowPnts = this.getArrowPoints(tempArg.connPoint, pnt1, tempArg.tempPoint4, true, tempArg);
  }
  const m = leftArrowPnts.length;
  const t = (m - 5) / 2;

  const llBodyPnts = leftArrowPnts.slice(0, t);
  const lArrowPnts = leftArrowPnts.slice(t, t + 5);
  let lrBodyPnts = leftArrowPnts.slice(t + 5, m);

  let rlBodyPnts = rightArrowPnts.slice(0, t);
  const rArrowPnts = rightArrowPnts.slice(t, t + 5);
  const rrBodyPnts = rightArrowPnts.slice(t + 5, m);

  rlBodyPnts = PlotUtils.getBezierPoints(rlBodyPnts);
  const bodyPnts = PlotUtils.getBezierPoints(rrBodyPnts.concat(llBodyPnts.slice(1)));
  lrBodyPnts = PlotUtils.getBezierPoints(lrBodyPnts);

  const pntss = rlBodyPnts.concat(rArrowPnts, bodyPnts, lArrowPnts, lrBodyPnts);
  return [pntss];


};

DrawUtil.drawGatherPlace = function (points) {


  let pnts = this.copyPointsAndAddCoordinate(points);
  if (pnts.length < 2) {
    return;
  }
  if (pnts.length === 2) {
    const mid = PlotUtils.mid(pnts[0], pnts[1]);
    const d = PlotUtils.distance(pnts[0], mid) / 0.9;
    const pnt = PlotUtils.getThirdPoint(pnts[0], mid, PlotUtils.Constants.HALF_PI, d, true);
    pnts = [pnts[0], pnt, pnts[1]];
  }
  const mid = PlotUtils.mid(pnts[0], pnts[2]);
  pnts.push(mid, pnts[0], pnts[1]);

  let normals = [];
  for (let i = 0; i < pnts.length - 2; i++) {
    const pnt1 = pnts[i];
    const pnt2 = pnts[i + 1];
    const pnt3 = pnts[i + 2];
    const normalPoints = PlotUtils.getBisectorNormals(0.4, pnt1, pnt2, pnt3);
    normals = normals.concat(normalPoints);
  }
  const count = normals.length;
  normals = [normals[count - 1]].concat(normals.slice(0, count - 1));
  const pList = [];
  for (let i = 0; i < pnts.length - 2; i++) {
    const pnt1 = pnts[i];
    const pnt2 = pnts[i + 1];
    pList.push(pnt1);
    for (let t = 0; t <= PlotUtils.Constants.FITTING_COUNT; t++) {
      const pnt = PlotUtils.getCubicValue(t / PlotUtils.Constants.FITTING_COUNT, pnt1, normals[i * 2], normals[i * 2 + 1], pnt2);
      pList.push(pnt);
    }
    pList.push(pnt2);
  }
  return [pList];

};


DrawUtil.drawSector = function (points) {
  const pnts = this.copyPointsAndAddCoordinate(points);

  if (pnts.length <= 2)
    return [pnts];
  else {
    const center = pnts[0];
    const pnt2 = pnts[1];
    const pnt3 = pnts[2];
    const radius = PlotUtils.distance(PlotUtils.wgsToMercator(pnt2), PlotUtils.wgsToMercator(center));
    const startAngle = PlotUtils.getAzimuth(PlotUtils.wgsToMercator(pnt2), PlotUtils.wgsToMercator(center));
    const endAngle = PlotUtils.getAzimuth(PlotUtils.wgsToMercator(pnt3), PlotUtils.wgsToMercator(center));
    const pList = PlotUtils.getArcPoints(PlotUtils.wgsToMercator(center), radius, startAngle, endAngle);
    pList.push(center, pList[0]);
    return [pList];
  }
};


DrawUtil.drawTailedSquadCombat = function (points, tempArg) {

  const pnts = this.copyPointsAndAddCoordinate(points);


  length = pnts.length;
  if (length < 2) {
    return;
  }
  const tailPnts = this.getTailPoints(pnts, tempArg);
  const headPnts = this.getArrowHeadPoints(pnts, tempArg, true, tailPnts[0], tailPnts[2]);
  const neckLeft = headPnts[0];
  const neckRight = headPnts[4];
  const bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, tempArg.tailWidthFactor);
  const count = bodyPnts.length;
  let leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, count / 2));
  leftPnts.push(neckLeft);
  let rightPnts = [tailPnts[2]].concat(bodyPnts.slice(count / 2, count));
  rightPnts.push(neckRight);

  leftPnts = PlotUtils.getQBSplinePoints(leftPnts);
  rightPnts = PlotUtils.getQBSplinePoints(rightPnts);

  return [leftPnts.concat(headPnts, rightPnts.reverse(), [tailPnts[1], leftPnts[0]])];

};


DrawUtil.drawLineArrow = function (points, tempArg) {
  const pnts = this.copyPointsAndAddCoordinate(points);
  const pntsLength = pnts.length;
  if (pntsLength < 2) {
    return;
  }

  let pnt1 = null;
  let pnt2 = null;
  let distance = 0;
  for (let index = 1; index < tempArg.maxCount && pntsLength - index > 0; index++) {
    pnt1 = pnts[pntsLength - index - 1];
    pnt2 = pnts[pntsLength - index];
    distance += PlotUtils.distance(pnt1, pnt2);
  }
  pnt1 = pnts[pntsLength - 2];
  pnt2 = pnts[pntsLength - 1];

  let len = distance / tempArg.arrowLengthScale;
  len = len > tempArg.maxArrowLength ? tempArg.maxArrowLength : len;
  const leftPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false);
  const rightPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true);


  const coordinates = DrawUtil.copyPointsAndAddCoordinate(pnts);
  coordinates.push(leftPnt);
  coordinates.push(pnt2);
  coordinates.push(rightPnt);
  return coordinates;
};


DrawUtil.copyPointsAndAddCoordinate = function (points, coordinate) {
  const newArray = [];
  Object.assign(newArray, points);
  if (coordinate) {
    newArray.push(coordinate);
  }
  return newArray;
};

DrawUtil.getArrowPoints = function (pnt1, pnt2, pnt3, clockWise, tempArg) {
  const midPnt = PlotUtils.mid(pnt1, pnt2);
  const len = PlotUtils.distance(midPnt, pnt3);
  let midPnt1 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
  let midPnt2 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
  //let midPnt3=PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.7, true);
  midPnt1 = PlotUtils.getThirdPoint(midPnt, midPnt1, PlotUtils.Constants.HALF_PI, len / 5, clockWise);
  midPnt2 = PlotUtils.getThirdPoint(midPnt, midPnt2, PlotUtils.Constants.HALF_PI, len / 4, clockWise);
  //midPnt3=PlotUtils.getThirdPoint(midPnt, midPnt3, Constants.HALF_PI, len / 5, clockWise);

  const points = [midPnt, midPnt1, midPnt2, pnt3];
  // 计算箭头部分
  const arrowPnts = this.getArrowHeadPoints(points, tempArg);
  const neckLeftPoint = arrowPnts[0];
  const neckRightPoint = arrowPnts[4];
  // 计算箭身部分
  const tailWidthFactor = PlotUtils.distance(pnt1, pnt2) / PlotUtils.getBaseLength(points) / 2;
  const bodyPnts = this.getArrowBodyPoints(points, neckLeftPoint, neckRightPoint, tailWidthFactor);
  const n = bodyPnts.length;
  let lPoints = bodyPnts.slice(0, n / 2);
  let rPoints = bodyPnts.slice(n / 2, n);
  lPoints.push(neckLeftPoint);
  rPoints.push(neckRightPoint);
  lPoints = lPoints.reverse();
  lPoints.push(pnt2);
  rPoints = rPoints.reverse();
  rPoints.push(pnt1);
  return lPoints.reverse().concat(arrowPnts, rPoints);
};


DrawUtil.getArrowHeadPoints = function (points, tempArg, hasTail, tailLeft, tailRight) {
  let len = PlotUtils.getBaseLength(points);
  let headHeight = len * tempArg.headHeightFactor;
  const headPnt = points[points.length - 1];

  if (hasTail) {
    len = PlotUtils.distance(headPnt, points[points.length - 2]);
    const tailWidth = PlotUtils.distance(tailLeft, tailRight);
    if (headHeight > tailWidth * tempArg.headTailFactor) {
      headHeight = tailWidth * tempArg.headTailFactor;
    }
  }

  const headWidth = headHeight * tempArg.headWidthFactor;
  const neckWidth = headHeight * tempArg.neckWidthFactor;
  headHeight = headHeight > len ? len : headHeight;
  const neckHeight = headHeight * tempArg.neckHeightFactor;
  const headEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true);
  const neckEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true);
  const headLeft = PlotUtils.getThirdPoint(headPnt, headEndPnt, PlotUtils.Constants.HALF_PI, headWidth, false);
  const headRight = PlotUtils.getThirdPoint(headPnt, headEndPnt, PlotUtils.Constants.HALF_PI, headWidth, true);
  const neckLeft = PlotUtils.getThirdPoint(headPnt, neckEndPnt, PlotUtils.Constants.HALF_PI, neckWidth, false);
  const neckRight = PlotUtils.getThirdPoint(headPnt, neckEndPnt, PlotUtils.Constants.HALF_PI, neckWidth, true);
  return [neckLeft, headLeft, headPnt, headRight, neckRight];
};

DrawUtil.getArrowBodyPoints = function (points, neckLeft, neckRight, tailWidthFactor) {
  const allLen = PlotUtils.wholeDistance(points);
  const len = PlotUtils.getBaseLength(points);
  const tailWidth = len * tailWidthFactor;
  const neckWidth = PlotUtils.distance(neckLeft, neckRight);
  const widthDif = (tailWidth - neckWidth) / 2;
  let tempLen = 0, leftBodyPnts = [], rightBodyPnts = [];
  for (let i = 1; i < points.length - 1; i++) {
    const angle = PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
    tempLen += PlotUtils.distance(points[i - 1], points[i]);
    const w = (tailWidth / 2 - tempLen / allLen * widthDif) / Math.sin(angle);
    const left = PlotUtils.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
    const right = PlotUtils.getThirdPoint(points[i - 1], points[i], angle, w, false);
    leftBodyPnts.push(left);
    rightBodyPnts.push(right);
  }
  return leftBodyPnts.concat(rightBodyPnts);
};

// 计算对称点
DrawUtil.getTempPoint4 = function (linePnt1, linePnt2, point) {
  const midPnt = PlotUtils.mid(linePnt1, linePnt2);
  const len = PlotUtils.distance(midPnt, point);
  const angle = PlotUtils.getAngleOfThreePoints(linePnt1, midPnt, point);
  let symPnt, distance1, distance2, mid;
  if (angle < PlotUtils.Constants.HALF_PI) {
    distance1 = len * Math.sin(angle);
    distance2 = len * Math.cos(angle);
    mid = PlotUtils.getThirdPoint(linePnt1, midPnt, PlotUtils.Constants.HALF_PI, distance1, false);
    symPnt = PlotUtils.getThirdPoint(midPnt, mid, PlotUtils.Constants.HALF_PI, distance2, true);
  } else if (angle >= PlotUtils.Constants.HALF_PI && angle < Math.PI) {
    distance1 = len * Math.sin(Math.PI - angle);
    distance2 = len * Math.cos(Math.PI - angle);
    mid = PlotUtils.getThirdPoint(linePnt1, midPnt, PlotUtils.Constants.HALF_PI, distance1, false);
    symPnt = PlotUtils.getThirdPoint(midPnt, mid, PlotUtils.Constants.HALF_PI, distance2, false);
  } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
    distance1 = len * Math.sin(angle - Math.PI);
    distance2 = len * Math.cos(angle - Math.PI);
    mid = PlotUtils.getThirdPoint(linePnt1, midPnt, PlotUtils.Constants.HALF_PI, distance1, true);
    symPnt = PlotUtils.getThirdPoint(midPnt, mid, PlotUtils.Constants.HALF_PI, distance2, true);
  } else {
    distance1 = len * Math.sin(Math.PI * 2 - angle);
    distance2 = len * Math.cos(Math.PI * 2 - angle);
    mid = PlotUtils.getThirdPoint(linePnt1, midPnt, PlotUtils.Constants.HALF_PI, distance1, true);
    symPnt = PlotUtils.getThirdPoint(midPnt, mid, PlotUtils.Constants.HALF_PI, distance2, false);
  }
  return symPnt;
};


DrawUtil.getTailPoints = function (points, tempArg) {
  const allLen = PlotUtils.getBaseLength(points);
  const tailWidth = allLen * tempArg.tailWidthFactor;
  const tailLeft = PlotUtils.getThirdPoint(points[1], points[0], PlotUtils.Constants.HALF_PI, tailWidth, false);
  const tailRight = PlotUtils.getThirdPoint(points[1], points[0], PlotUtils.Constants.HALF_PI, tailWidth, true);
  const len = tailWidth * tempArg.swallowTailFactor;
  const swallowTailPnt = PlotUtils.getThirdPoint(points[1], points[0], 0, len, true);
  return [tailLeft, swallowTailPnt, tailRight];
};


export default DrawUtil;
