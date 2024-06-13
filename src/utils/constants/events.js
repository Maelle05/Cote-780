let i = 0;

const EVENTS = {
  // APP EVENTS
  LOADER_PROGRESS: i++,
  APP_LOADED: i++,
  ATTACH: i++,
  FIRST_CLICK: i++,

  // TICKER
  TICK: i++,
  RENDER: i++,

  // DEVICE EVENTS
  RESIZE: i++,
  POINTER_MOVE: i++,
  POINTER_UP: i++,
  POINTER_DOWN: i++,
  KEY_DOWN: i++,
  DRAG: i++,
  DRAG_END: i++,
  PINCH: i++,
  WHEEL: i++,

  // COTE 780
  START_EXP: i++,
  GO_NEXT: i++,
  GO_PREV: i++,
  ASK_CHANGE_SCENE: i++,
  CHANGE_SCENE: i++,
  CHANGE_SCENE_STEP: i++,
  UPDATE_DIALOGUE: i++,
  COLLECT_CAIRN: i++,
  VIEW_COLLECTION_CAIRNS: i++,
  FIREWORKS_ANIM_STOP: i++,
};

const EVENTS_MAP = Object.fromEntries(
  Object.entries(EVENTS).map(([key, value]) => [
    value,
    `on${key
      .toLowerCase()
      .split("_")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join("")}`,
  ])
);

export { EVENTS, EVENTS_MAP };
