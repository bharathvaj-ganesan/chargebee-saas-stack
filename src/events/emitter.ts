import type { EventData, EventPayload, EventType } from "@/events/defn";
// data should be | separated types as this is meant to be a generic function
export const sendEvent = (
  type: EventType,
  data: EventPayload,
  targetOrigin?: string
) => {
  if (typeof window !== "undefined") {
    let targetWindow: Window = window;

    const message: EventData = {
      source: "pricify",
      type: type,
      payload: data,
    };
    if (targetOrigin && document.referrer.startsWith(targetOrigin)) {
      targetWindow = window.parent;
      try {
        targetWindow.postMessage(message, targetOrigin);
      } catch (e) {
        // Do Nothing
      }
    }
  }
};
