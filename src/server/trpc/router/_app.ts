import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { pricingRouter } from "./pricing";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  pricing: pricingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
