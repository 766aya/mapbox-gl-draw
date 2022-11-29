
import simple_select from './simple_select';
import direct_select from './direct_select';
import draw_point from './draw_point';
import draw_polygon from './draw_polygon';
import draw_line_string from './draw_line_string';
import draw_sector from './draw_sector';
import draw_circle from './draw_circle';
import Static from "./static";
import * as Constants from '../constants';

export default {
  [Constants.modes.STATIC]: Static,
  [Constants.modes.SIMPLE_SELECT]: simple_select,
  [Constants.modes.DIRECT_SELECT]: direct_select,
  [Constants.modes.DRAW_POINT]: draw_point,
  [Constants.modes.DRAW_LINE_STRING]: draw_line_string,
  [Constants.modes.DRAW_POLYGON]: draw_polygon,
  [Constants.modes.CIRCLE]: draw_polygon,
  [Constants.modes.DRAW_CIRCLE]: draw_circle,
  [Constants.modes.DRAW_SECTOR]: draw_sector,
};
