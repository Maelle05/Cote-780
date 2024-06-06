import { TEXTS } from "./texts";
import dataText from "../../locales/fr.json";

const DEV_MODE = true;
const INIT_SCENE = 4;

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

const introTexts = dataText['scene_0']

const INTRO_SECTIONS = [
  {
    elements: [{ id: "lac", src: "/assets/images/intro/1_lac.png" }],
    text: '',
  },
  {
    elements: [{ id: "maison", src: "/assets/images/intro/2_maison.png" }],
    text: '',
  },
  {
    elements: [
      { id: "chambre", src: "/assets/images/intro/3_chambre.png" },
      { id: "lettre", src: "/assets/images/intro/4_lettre.png" },
    ],
    text: introTexts['text_1'],
  },
  {
    elements: [
      {
        id: "construction-barrage",
        src: "/assets/images/intro/5_construction-barrage.png",
      },
      {
        id: "durance-colere",
        src: "/assets/images/intro/6_durance-colere.png",
      },
    ],
    text: introTexts['text_2'],
  },
  {
    elements: [],
    text: introTexts['text_3'],
  },
  {
    elements: [
      {
        id: "mamie-lien-durance-2",
        src: "/assets/images/intro/8_mamie-lien-durance-2.png",
      },
      {
        id: "mamie-lien-durance-1",
        src: "/assets/images/intro/8_mamie-lien-durance-1.png",
      },
    ],
    text: introTexts['text_4'],
  },
  {
    elements: [
      { id: "passage-lac", src: "/assets/images/intro/9_passage-lac.png" },
    ],
    text: introTexts['text_5'],
  },
  {
    elements: [{ id: "milo", src: "/assets/images/intro/10_milo.png" }],
    text: introTexts['text_6'],
  },
  {
    elements: [
      { id: "carte", src: "/assets/images/intro/11_carte.png" },
      { id: "collier", src: "/assets/images/intro/12_collier.png" },
    ],
    text: introTexts['text_7'],
  },
];

export { DEV_MODE, INIT_SCENE, INTRO_SECTIONS, TITLES_SCENE };
