import { TEXTS } from "./texts";

const DEV_MODE = false;
const INIT_SCENE = 0;
const TITLES_SCENE = [
  "Intro",
  "Map",
  "Demoiselles",
  "Barrage",
  "Pont",
  "Chapelle",
  "Village",
  "Fin",
];

const INTRO_SECTIONS = [
  {
    elements: [],
    text: TEXTS.intro[0],
  },
  {
    elements: [],
    text: TEXTS.intro[1],
  },
  {
    elements: [],
    text: TEXTS.intro[2],
  },
  {
    elements: [],
    text: TEXTS.intro[3],
  },
  {
    elements: [],
    text: TEXTS.intro[4],
  },
];

export { DEV_MODE, INIT_SCENE, INTRO_SECTIONS, TITLES_SCENE };
