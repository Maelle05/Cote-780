import dataText from "../../locales/fr.json";

const DEV_MODE = false;
const INIT_SCENE = 0;

const TITLES_SCENE = [
  [dataText["scene_0"].title],
  [dataText["scene_1"].title],
  [dataText["scene_2"].title_0, dataText["scene_2"].title_1],
  [dataText["scene_3"].title],
  [dataText["scene_4"].title_0, dataText["scene_4"].title_1],
  [dataText["scene_5"].title_0, dataText["scene_5"].title_1],
  [dataText["scene_6"].title_0, dataText["scene_6"].title_1],
  [dataText["scene_7"].title_0, dataText["scene_7"].title_1],
];

const introTexts = dataText["scene_0"];

const INTRO_SECTIONS = [
  {
    elements: [
      { id: "0-lac", src: "/assets/images/intro/0_lac.png" },
      { id: "0-milo", src: "/assets/images/intro/0_milo.png" },
      { id: "0-buisson", src: "/assets/images/intro/0_buisson.png" },
    ],
    texts: [],
    audios: [],
  },
  {
    elements: [
      { id: "1-colline-1", src: "/assets/images/intro/1_colline-1.png" },
      { id: "1-colline-2", src: "/assets/images/intro/1_colline-2.png" },
      { id: "1-maison", src: "/assets/images/intro/1_maison.png" },
      {
        id: "1-buisson-gauche",
        src: "/assets/images/intro/1_buisson-droite.png",
      },
      {
        id: "1-buisson-droite",
        src: "/assets/images/intro/1_buisson-gauche.png",
      },
      { id: "1-arbre", src: "/assets/images/intro/1_arbre.png" },
    ],
    texts: [],
    audios: [],
  },
  {
    elements: [
      { id: "2-chambre", src: "/assets/images/intro/2_chambre.png" },
      { id: "2-lit", src: "/assets/images/intro/2_lit.png" },
      { id: "2-table-chevet", src: "/assets/images/intro/2_table-chevet.png" },
      { id: "2-milo", src: "/assets/images/intro/2_milo.png" },
      { id: "2-lumiere", src: "/assets/images/intro/2_lumiere.png" },
      { id: "2-enveloppe", src: "/assets/images/intro/2_enveloppe.png" },
      { id: "2-lettre", src: "/assets/images/intro/2_lettre.png" },
    ],
    texts: [introTexts["text_1"], introTexts["text_2"]],
    audios: [introTexts["audio_1"], introTexts["audio_2"]],
  },
  {
    elements: [
      {
        id: "3-durance-colere",
        src: "/assets/images/intro/3_durance-colere.png",
      },
    ],
    texts: [introTexts["text_3"]],
    audios: [introTexts["audio_3"]],
  },
  {
    elements: [
      { id: "4-durance-1", src: "/assets/images/intro/4_durance-1.png" },
      { id: "4-durance-2", src: "/assets/images/intro/4_durance-2.png" },
      { id: "4-durance-3", src: "/assets/images/intro/4_durance-3.png" },
      { id: "4-grandma", src: "/assets/images/intro/4_grandma.png" },
      { id: "4-cairn", src: "/assets/images/intro/4_cairn.png" },
    ],
    texts: [introTexts["text_4"]],
    audios: [introTexts["audio_4"]],
  },
  {
    elements: [
      { id: "5-collines", src: "/assets/images/intro/5_collines.png" },
      { id: "5-lac", src: "/assets/images/intro/5_lac.png" },
      { id: "5-passage", src: "/assets/images/intro/5_passage.png" },
    ],
    texts: [introTexts["text_5"], introTexts["text_6"]],
    audios: [introTexts["audio_5"], introTexts["audio_6"]],
  },
  {
    elements: [
      { id: "6-eau", src: "/assets/images/intro/6_eau.png" },
      { id: "6-milo", src: "/assets/images/intro/6_milo.png" },
    ],
    texts: [introTexts["text_7"], introTexts["text_8"]],
    audios: [introTexts["audio_7"], introTexts["audio_8"]],
  },
  {
    elements: [],
    texts: [introTexts["text_9"]],
    audios: [introTexts["audio_9"]],
  },
  {
    elements: [
      { id: "carte", src: "/assets/images/intro/11_carte.png" },
      { id: "collier", src: "/assets/images/intro/12_collier.png" },
    ],
    texts: [introTexts["text_10"], introTexts["text_11"]],
    audios: [introTexts["audio_10"], introTexts["audio_11"]],
  },
];

const NEW_CAIRNS = [
  {
    scene: 2,
    step: 5,
  },
  {
    scene: 3,
    step: 5,
  },
  {
    scene: 4,
    step: 5,
  },
  {
    scene: 5,
    step: 4,
  },
  {
    scene: 6,
    step: 6,
  },
];

const MAP_DATA = [
  {
    scene: 2,
    point: {
      x: 445,
      y: 516,
    },
    path: ''
  },
  {
    scene: 3,
    point: {
      x: 223,
      y: 572,
    },
    path: 'M442.5 525.5C439 531.833 437.1 544.9 445.5 550.5C463 562.167 470.5 545.5 496 545.5C565 545.5 680 610.5 695 643C706.5 670.5 683 675.5 669.5 673.5C656 671.5 628.993 664.135 612 659.5C568 647.5 564.5 669 544.5 669C527 669 520.5 647 503 642.5C490.5 639.286 480 648.479 455.5 650C383 654.5 284.5 641.5 230 579.5'
  },
  {
    scene: 4,
    point: {
      x: 363,
      y: 350,
    },
    path: 'M217.5 564C201.167 546.667 183.379 510.682 202.5 482C232.5 437 294.703 445.5 305.5 421C316.297 396.5 308 358 351.5 352.5'
  },
  {
    scene: 5,
    point: {
      x: 489,
      y: 277,
    },
    path: 'M351.5 346.501C336 344.834 316.388 339.083 309.5 317.5C302 294 316 281.5 312 254.5C308.579 231.407 334.041 222.402 345.5 240C359.5 261.5 375.009 308.007 399.5 295.501C423 283.501 393.5 213.499 439 208.501C466.5 205.479 485 260.167 486 265.5'
  },
  {
    scene: 6,
    point: {
      x: 602,
      y: 266,
    },
    path: 'M492 288.5C496.5 311 511.5 313.7 525.5 309.5C550.592 301.973 548.5 277 590.5 267.5'
  },
  {
    scene: 7,
    point: {
      x: 680,
      y: 294,
    },
    path: 'M613 266C628 266.5 656.5 272.7 670.5 287.5'
  },
]

export { DEV_MODE, INIT_SCENE, INTRO_SECTIONS, TITLES_SCENE, NEW_CAIRNS, MAP_DATA };
