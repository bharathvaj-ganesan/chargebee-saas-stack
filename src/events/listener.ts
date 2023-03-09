// Reference : https://github.com/rottitime/react-hook-window-message-event/blob/main/useMessage.ts

import { useCallback, useEffect } from "react";

import type { EventPayload, EventType } from "@/events/defn";

type EventHandler = (payload: EventPayload) => void;

/**
 * It listens for a specific message type, and when it receives it, it calls the event handler with the
 * message payload and a function to send a message back to the sender
 * @param {string} eventType - string
 * @param {EventHandler} eventHandler - This is the function that will be called when the event is
 * triggered.
 * @returns An object with two properties: history and sendToParent.
 */
const useMessage = (
  eventType: EventType,
  eventHandler: EventHandler,
  host: string
) => {
  const onWatchEventHandler = useCallback(
    ({ origin, data }: MessageEvent) => {
      const { type, payload } = data;
      if (origin === host) {
        if (type === eventType) {
          eventHandler(payload);
        }
      } else if (origin.match(/https:\/\/[A-Za-z0-9\-_.]+chargebee.com/g)) {
        // DO NOTHING
      } else if (origin === window.location.origin) {
        // DO NOTHING
      } else {
        console.log("unknown origin", origin);
      }
    },
    [eventType, eventHandler, host]
  );

  useEffect(() => {
    window.addEventListener("message", onWatchEventHandler);
    return () => window.removeEventListener("message", onWatchEventHandler);
  }, [eventType, onWatchEventHandler]);

  return {};
};

export default useMessage;
