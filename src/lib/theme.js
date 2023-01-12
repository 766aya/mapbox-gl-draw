/**
 * @type { Array<import("@types/mapbox-gl").AnyLayer> }
 */
export default [
  {
    id: "gl-draw-point-arrow",
    type: "symbol",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "arrow"]],
    paint: {
      "icon-color": [
        "case",
        ["==", ["get", "is-active"], "true"],
        "#ff0000",
        "#e600ff",
      ],
    },
    layout: {
      "icon-anchor": "center",
      "icon-allow-overlap": true,
      "icon-image": "mapbox-gl-draw-icon-arrow",
      "icon-rotate": ["get", "icon-rotate"],
      "text-allow-overlap": true,
      "icon-size": 0.5,
    },
  },
  {
    id: "gl-draw-polygon-fill-inactive",
    type: "fill",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Polygon"],
      ["!=", "mode", "static"],
    ],
    paint: {
      "fill-color": "#e600ff",
      "fill-outline-color": "#e600ff",
      "fill-opacity": 0.1,
    },
  },
  {
    id: "gl-draw-polygon-fill-active",
    type: "fill",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#ff0000",
      "fill-outline-color": "#ff0000",
      "fill-opacity": 0.1,
    },
  },
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
    paint: {
      "circle-radius": ["coalesce", ["+", ["get", "line-width"], 2], 3],
      "circle-color": ["coalesce", ["get", "line-active-color"], "#FF0000"],
    },
  },
  {
    id: "gl-draw-polygon-stroke-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Polygon"],
      ["!=", "mode", "static"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#e600ff",
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#ff0000",
      "line-dasharray": [0.2, 2],
      "line-width": 2,
    },
  },
  // 线非选中态
  {
    id: "gl-draw-line-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "LineString"],
      ["!=", "mode", "static"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": ["coalesce", ["get", "line-color"], "#e600ff"],
      "line-width": ["coalesce", ["get", "line-width"], 2],
    },
  },
  // 线要素选中态
  {
    id: "gl-draw-line-active",
    type: "line",
    filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": ["coalesce", ["get", "line-active-color"], "#ff0000"],
      "line-dasharray": [0.2, 2],
      "line-width": ["coalesce", ["get", "line-width"], 2]
    },
  },
  // 面和线要素 顶点 非选中状态描边
  {
    id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "meta", "vertex"],
      ["==", "$type", "Point"],
      ["!=", "mode", "static"],
    ],
    paint: {
      "circle-radius": ["coalesce", ["+", ["get", "line-width"], 3], 5],
      "circle-color": "#fff",
    },
  },
  // 面和线要素 顶点 - 非选中状态
  {
    id: "gl-draw-polygon-and-line-vertex-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "meta", "vertex"],
      ["==", "$type", "Point"],
      ["!=", "mode", "static"],
    ],
    paint: {
      "circle-radius": ["coalesce", ["+", ["get", "line-width"], 1], 3],
      "circle-color": ["coalesce", ["get", "line-active-color"], "#ff0000"],
    },
  },
  // 点标绘非选中态 底层模拟描边
  {
    id: "gl-draw-point-point-stroke-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!=", "mode", "static"],
    ],
    paint: {
      "circle-radius": 5,
      "circle-opacity": 1,
      "circle-color": "#fff",
    },
  },
  // 点标绘非选中态 圆
  {
    id: "gl-draw-point-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!=", "mode", "static"],
    ],
    paint: {
      "circle-radius": 3,
      "circle-color": ["coalesce", ["get", "circle-color"], "#e600ff"],
    },
  },
  // 点标绘的名称
  {
    id: "gl-draw-point-name",
    type: "symbol",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!=", "mode", "static"],
    ],
    layout: {
      "text-allow-overlap": true,
      "text-field": ["get", "name"],
      "text-anchor": ["coalesce", ["get", "text-anchor"], "left"],
      "text-line-height": 1,
      "text-size": ["coalesce", ["get", "text-size"], 14],
      "text-justify": "center",
      "text-offset": ["match", ["get", "text-anchor"],
        "left",  ["literal", [0.6, 0]],
        "right", ["literal", [-0.6, 0]],
        "top", ["literal", [0, 0.6]],
        "bottom", ["literal", [0, -0.6]],
        ["literal", [0.6, 0]]
      ],
    },
    paint: {
      "text-color": ["coalesce", ["get", "text-color"], "#FF0000"],
    },
    minzoom: 10,
  },
  // 点要素以及顶点被选中时 底层模拟描边
  {
    id: "gl-draw-point-stroke-active",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "active", "true"],
      ["!=", "meta", "midpoint"],
    ],
    paint: {
      "circle-radius": ["case", ["has", "line-width"], ["+", ["get", "line-width"], 5], 7],
      "circle-color": "#fff",
    },
  },
  // 点要素以及顶点被选中时 非中心分割点
  {
    id: "gl-draw-point-active",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["!=", "meta", "midpoint"],
      ["==", "active", "true"],
    ],
    paint: {
      "circle-radius": ["coalesce", ["+", ["get", "line-width"], 3], 5],
      "circle-color": ["coalesce",
        ["get", "line-active-color"],
        ["get", "circle-active-color"],
        "#FF0000"
      ],
    },
  },
  /**
   * 以下是静态模式下各种标绘图层显示样式
   */
  {
    id: "gl-draw-polygon-fill-static",
    type: "fill",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#404040",
      "fill-outline-color": "#404040",
      "fill-opacity": 0.1,
    },
  },
  {
    id: "gl-draw-polygon-stroke-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#404040",
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-line-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#404040",
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-point-static",
    type: "circle",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
    paint: {
      "circle-radius": 5,
      "circle-color": "#404040",
    },
  },
];
