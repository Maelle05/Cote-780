import dataText from "../../locales/fr.json";

const DEV_MODE = true;
const INIT_SCENE = 2;

const TITLES_SCENE = [
  [dataText["scene_0"].title],
  [dataText["scene_1"].title],
  [dataText["scene_2"].title_0, dataText["scene_2"].title_1],
  [dataText["scene_3"].title],
  [dataText["scene_4"].title_0, dataText["scene_4"].title_1],
  [dataText["scene_5"].title_0, dataText["scene_5"].title_1],
  [dataText["scene_6"].title_0, dataText["scene_6"].title_1],
  [dataText["scene_7"].title],
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
  },
  {
    elements: [
      {
        id: "3-durance-colere",
        src: "/assets/images/intro/3_durance-colere.png",
      },
    ],
    texts: [introTexts["text_3"]],
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
  },
  {
    elements: [
      { id: "5-collines", src: "/assets/images/intro/5_collines.png" },
      { id: "5-lac", src: "/assets/images/intro/5_lac.png" },
      { id: "5-passage", src: "/assets/images/intro/5_passage.png" },
    ],
    texts: [introTexts["text_5"], introTexts["text_6"]],
  },
  {
    elements: [
      { id: "6-eau", src: "/assets/images/intro/6_eau.png" },
      { id: "6-milo", src: "/assets/images/intro/6_milo.png" },
    ],
    texts: [introTexts["text_7"], introTexts["text_8"]],
  },
  {
    elements: [],
    texts: [introTexts["text_9"]],
  },
  {
    elements: [
      { id: "carte", src: "/assets/images/intro/11_carte.png" },
      { id: "collier", src: "/assets/images/intro/12_collier.png" },
    ],
    texts: [introTexts["text_10"], introTexts["text_11"]],
  },
];

export { DEV_MODE, INIT_SCENE, INTRO_SECTIONS, TITLES_SCENE };
