import Vue from "vue";
import Unicon from "vue-unicons";

import {
  uniEye,
  uniPen,
  uniCheck,
  uniTimes,
  uniUser,
  uniEuroCircle,
  uniHome,
  uniSuitcaseAlt,
  uniFileAlt,
  uniAngleUp,
  uniAngleDown,
  uniFolderLock,
  uniMouse,
  uniStar
} from "vue-unicons/src/icons.js";

Unicon.add([
  uniEye,
  uniPen,
  uniCheck,
  uniTimes,
  uniUser,
  uniEuroCircle,
  uniHome,
  uniSuitcaseAlt,
  uniFileAlt,
  uniAngleUp,
  uniAngleDown,
  uniFolderLock,
  uniMouse,
  uniStar
]);
Vue.use(Unicon, {
  fill: "royalBlue"
});
