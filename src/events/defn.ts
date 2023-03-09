export const EventKeys = {
  PAGE_LOAD: "pricify.hosted.page.load",
  DIMENSION: "pricify.hosted.page.dimension",
};

export type EventData = {
  source: "pricify";
  type: EventType;
  payload: EventPayload;
};

export type EventType = typeof EventKeys[keyof typeof EventKeys];

export type EventPayload = PageLoadEvent | DimensionEvent; //add other event types here separated by |

export type PageLoadEvent = {
  meta?: Record<string, unknown>;
};

export type DimensionEvent = {
  meta?: Record<string, unknown>;
  window?: {
    height: number;
    width: number;
  };
  scroll?: {
    height: number;
    width: number;
  };
};
