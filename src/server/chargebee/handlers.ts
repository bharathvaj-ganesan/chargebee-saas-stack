import type {
  ChargebeePeriodUnit,
  ChargebeePricingModel,
  ChargebeeSubscriptionStatus,
  PrismaClient,
} from "@prisma/client";
import type { Event } from "chargebee-typescript/lib/resources";
import { NextApiRequest, NextApiResponse } from "next";

type Result = Event["content"];

interface WebhookHandlerProp {
  content: Result;
  prisma: PrismaClient;
}

export async function upsertItemRecord({
  content,
  prisma,
}: WebhookHandlerProp) {
  const item = content.item;
  const result = await prisma.item.upsert({
    where: {
      id: item.id,
    },
    update: {
      description: item.description,
      metadata: item.metadata,
      active: item.status === "active",
    },
    create: {
      id: item.id,
      name: item.external_name!,
      description: item.description,
      metadata: item.metadata,
    },
  });
  return result;
}

export async function upsertItemPriceRecord({
  content,
  prisma,
}: {
  content: Result;
  prisma: PrismaClient;
}) {
  const itemPrice = content.item_price;
  const result = await prisma.itemPrice.upsert({
    where: {
      id: itemPrice.id,
    },
    update: {
      period: itemPrice.period,
      periodUnit: itemPrice.period_unit as ChargebeePeriodUnit,
      price: itemPrice.price,
      description: itemPrice.description,
      metadata: itemPrice.metadata,
      active: itemPrice.status === "active",
    },
    create: {
      id: itemPrice.id,
      itemId: itemPrice.item_id,
      name: itemPrice.external_name!,
      description: itemPrice.description,
      pricingModel: itemPrice.pricing_model as ChargebeePricingModel,
      period: itemPrice.period,
      currencyCode: itemPrice.currency_code,
      periodUnit: itemPrice.period_unit as ChargebeePeriodUnit,
      price: itemPrice.price!,
      metadata: itemPrice.metadata,
      active: itemPrice.status === "active",
    },
  });
  return result;
}

export async function upsertSubscriptionRecord({
  content,
  prisma,
}: WebhookHandlerProp) {
  const subscription = content.subscription;
  const result = await prisma.subscription.upsert({
    where: {
      userId: subscription.customer_id,
    },
    update: {
      itemPriceId: subscription.subscription_items?.find(
        (item) => item.item_type === "plan"
      )?.item_price_id as string,
      status: subscription.status as ChargebeeSubscriptionStatus,
    },
    create: {
      id: subscription.id,
      userId: subscription.customer_id,
      itemPriceId: subscription.subscription_items?.find(
        (item) => item.item_type === "plan"
      )?.item_price_id as string,
      status: subscription.status as ChargebeeSubscriptionStatus,
    },
  });
  return result;
}

export default async function webhookHandlers(
  payload: Event,
  {
    prisma,
    req,
    res,
  }: { prisma: PrismaClient; req: NextApiRequest; res: NextApiResponse }
) {
  if (!payload) {
    throw new Error("Empty body");
  }
  const eventType = payload.event_type;
  const content = payload.content;

  switch (eventType) {
    case "item_created":
    case "item_updated":
      await upsertItemRecord({
        content,
        prisma,
      });
      await res.revalidate("/pricing");
      break;
    case "item_price_created":
    case "item_price_updated":
      await upsertItemPriceRecord({
        content,
        prisma,
      });
      await res.revalidate("/pricing");
      break;
    case "subscription_created":
    case "subscription_cancelled":
    case "subscription_changed":
    case "subscription_renewed":
      await upsertSubscriptionRecord({
        content,
        prisma,
      });
      break;
  }
}
