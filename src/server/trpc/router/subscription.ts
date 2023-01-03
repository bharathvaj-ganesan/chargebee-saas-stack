import type { TypeOf } from "zod";
import { z } from "zod";
import { type Context } from "../context";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getURL } from "@/utils/helpers";

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

async function createCheckoutSessionHandler({
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
      redirect_url: `${getURL()}/account`,
      cancel_url: `${getURL()}/pricing`,
    };
    if (user?.email) {
      payload.customer.email = user?.email;
    }

    const result = await chargebee.hosted_page
      .checkout_new_for_items(payload)
      .request();

    return result?.hosted_page;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to create subscription @ Chargebee",
    });
  }
}

async function createPortalSessionHandler({ ctx }: { ctx: Context }) {
  try {
    const user = ctx.session?.user;
    const userId = user?.id;
    const chargebee = ctx.chargebee;

    const payload: any = {
      customer: {
        id: userId,
      },
      // redirect_url: `${getURL()}/account`,
    };

    const result = await chargebee.portal_session.create(payload).request();
    return result?.portal_session;
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.error_msg || "Unable to create portal session @ Chargebee",
    });
  }
}

async function getSubscriptionStatusHandler({ ctx }: { ctx: Context }) {
  try {
    const { session, prisma } = ctx;
    const userId = session?.user?.id as string;
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: userId,
      },
      include: {
        ItemPrice: true,
      },
    });

    return subscription;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to retrive subscription",
    });
  }
}

/**
 * Router Defns
 */

export const subscriptionRouter = router({
  createCheckoutSession: protectedProcedure
    .input(createCheckoutSessionSchema)
    .mutation(({ input, ctx }) => createCheckoutSessionHandler({ input, ctx })),
  getSubscriptionStatus: protectedProcedure.query(({ ctx }) =>
    getSubscriptionStatusHandler({ ctx })
  ),
  createPortalSession: protectedProcedure.mutation(({ ctx }) =>
    createPortalSessionHandler({ ctx })
  ),
});
