import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const pricingRouter = router({
  getAllItemPrices: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.itemPrice.findMany();
  }),
  getAllItems: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany();
  }),
  getItemPrice: publicProcedure
    .input(
      z.object({
        itemPriceId: z.string({
          required_error: "Item Price Id is required",
        }),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.itemPrice.findUnique({
        where: {
          id: input.itemPriceId,
        },
      });
    }),
});
