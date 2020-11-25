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
  uniAngleDown
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
  uniAngleDown
]);
Vue.use(Unicon, {
  fill: "royalBlue"
});
