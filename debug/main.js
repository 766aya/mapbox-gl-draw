window.mapboxgl.accessToken = 'pk.eyJ1IjoieXVuZXI5OTY4IiwiYSI6ImNrazY1cTh1bzAwc24yd3AyMzBnbmtiMXYifQ.KmABHgQ1OZ4EVax3poOzyA';
const map = new window.mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: [120, 30], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const draw = new window.MapboxDraw({
  boxSelect: false,
  displayControlsDefault: false,
  userProperties: true
});

map.addControl(draw);

/**
 * 点击开始绘制
 */
document.getElementById("button-point")?.addEventListener("click", () => {
  draw.changeMode("draw_point");
});

document.getElementById("button-linestring")?.addEventListener("click", () => {
  draw.changeMode("draw_line_string");
});

document.getElementById("button-polygon")?.addEventListener("click", () => {
  draw.changeMode("draw_polygon");
});

document.getElementById("button-circle")?.addEventListener("click", () => {
  draw.changeMode("draw_circle");
});

document.getElementById("button-sector")?.addEventListener("click", () => {
  draw.changeMode("draw_sector");
});

document.getElementById("button-rectangle")?.addEventListener("click", () => {
  draw.changeMode("draw_rectangle");
});

document.getElementById("button-arrow").addEventListener("click", () => {
  draw.changeMode("draw_arrow");
});

document.getElementById("button-lay-line").addEventListener("click", () => {
  draw.changeMode("draw_lay_line");
});

map.on("draw.create", ({ features }) => {
  console.log("创建成功", features);
});

map.on("draw.delete", ({ features }) => {
  console.log("删除成功", features);
});

map.on("draw.update", ({ features }) => {
  console.log("修改成功", features);
});

map.on("draw.selectionchange", ({ features }) => {
  console.log("选中要素切换", features);
});

map.on("draw.modechange", ({ mode }) => {
  console.log("绘制模式切换", mode);
});
