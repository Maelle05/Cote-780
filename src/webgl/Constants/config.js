import { TEXTS } from "./texts";

const DEV_MODE = false;
const INIT_SCENE = 2;

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
    elements: [{ id: "lac", src: "src/assets/intro/1_lac.png" }],
    text: TEXTS.intro[0],
  },
  {
    elements: [{ id: "maison", src: "src/assets/intro/2_maison.png" }],
    text: TEXTS.intro[1],
  },
  {
    elements: [
      { id: "chambre", src: "src/assets/intro/3_chambre.png" },
      { id: "lettre", src: "src/assets/intro/4_lettre.png" },
    ],
    text: TEXTS.intro[2],
  },
  {
    elements: [
      {
        id: "construction-barrage",
        src: "src/assets/intro/5_construction-barrage.png",
      },
      { id: "durance-colere", src: "src/assets/intro/6_durance-colere.png" },
    ],
    text: TEXTS.intro[3],
  },
  {
    elements: [],
    text: TEXTS.intro[4],
  },
  {
    elements: [
      { id: "mamie-lien-durance-2", src: "src/assets/intro/8_mamie-lien-durance-2.png" },
      { id: "mamie-lien-durance-1", src: "src/assets/intro/8_mamie-lien-durance-1.png" },
    ],
    text: TEXTS.intro[5],
  },
  {
    elements: [
      { id: "passage-lac", src: "src/assets/intro/9_passage-lac.png" },
    ],
    text: TEXTS.intro[6],
  },
  {
    elements: [
      { id: "milo", src: "src/assets/intro/10_milo.png" },
    ],
    text: TEXTS.intro[7],
  },
  {
    elements: [
      { id: "carte", src: "src/assets/intro/11_carte.png" },
      { id: "collier", src: "src/assets/intro/12_collier.png" },

    ],
    text: TEXTS.intro[8],
  },
]

export { DEV_MODE, INIT_SCENE, INTRO_SECTIONS, TITLES_SCENE };
