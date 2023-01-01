import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const pricingRouter = router({
  getAllItemPrices: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.itemPrice.findMany();
  }),
  getAllItems: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany();
  }),
});
