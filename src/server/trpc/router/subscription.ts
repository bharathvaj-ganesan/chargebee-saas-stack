import { TypeOf, z } from "zod";
import { type Context } from "../context";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

/**
 * Controllers
 */

export const createCheckoutSessionSchema = z.object({
  itemPriceId: z.string({
    required_error: "Item Price Id is required",
  }),
});

export type CreateCheckoutSessionInput = TypeOf<
  typeof createCheckoutSessionSchema
>;

async function createPostHandler({
  input,
  ctx,
}: {
  input: CreateCheckoutSessionInput;
  ctx: Context;
}) {
  try {
    const itemPriceId = input.itemPriceId;
    const user = ctx.session?.user;
    const userId = user?.id;
    const chargebee = ctx.chargebee;

    const payload: any = {
      subscription: {
        id: userId,
      },
      subscription_items: [
        {
          item_price_id: itemPriceId,
          quantity: 1,
        },
      ],
      customer: {
        id: userId,
        name: user?.name || "",
      },
    };
    if (user?.email) {
      payload.customer.email = user?.email;
    }

    const result = await chargebee.hosted_page
      .checkout_new_for_items(payload)
      .request();

    return {
      hostedPage: result?.hosted_page,
    };
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to create subscription @ Chargebee",
    });
  }
}

/**
 * Router Defns
 */

export const subscriptionRouter = router({
  createCheckoutSession: protectedProcedure
    .input(createCheckoutSessionSchema)
    .mutation(({ input, ctx }) => createPostHandler({ input, ctx })),
});
