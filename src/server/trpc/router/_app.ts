import { router } from "../trpc";
import { authRouter } from "./auth";
import { pricingRouter } from "./pricing";
import { subscriptionRouter } from "./subscription";
import { exampleRouter } from "./example";

export const appRouter = router({
  auth: authRouter,
  pricing: pricingRouter,
  subscription: subscriptionRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
