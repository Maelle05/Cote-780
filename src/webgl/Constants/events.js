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
  CHANGE_SCENE: i++,
  INTRO_CHANGE_SECTION: i++,
  INTRO_UPDATE_TEXT: i++,
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
