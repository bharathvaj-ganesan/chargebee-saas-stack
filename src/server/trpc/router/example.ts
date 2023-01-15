import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import WebhookQueue from "@/pages/api/queues/webhook";

export const exampleRouter = router({
  fireEvent: protectedProcedure.mutation(({ ctx }) => {
    // fetch all webhooks configured for the current event
    // for each webhook - add a job to the queue

    WebhookQueue.enqueue(
      {
        webhook: {
          id: "some_id",
          subscriberUrl:
            "https://webhook.site/e1f703ef-da81-4145-8698-790f5eee8cd0",
          appId: "custom",
          secret: "****",
        },
        event: {
          type: "SOME_EVENT",
          payload: {
            type: "SOME_EVENT",
            data: {
              someProperty: "someValue",
            },
          },
        },
      },
      {
        retry: ["5s", "20s"], // https://www.npmjs.com/package/exponential-backoff-generator
      }
    );
    return;
  }),
});
