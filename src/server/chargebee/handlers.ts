import {
  ChargebeePeriodUnit,
  ChargebeePricingModel,
  PrismaClient,
} from "@prisma/client";
import { Event } from "chargebee-typescript/lib/resources";
import type { ChargeBee } from "chargebee-typescript";

type Result = Event["content"];

async function upsertItemRecord({
  content,
  prisma,
}: {
  content: Result;
  prisma: PrismaClient;
}) {
  const item = content.item;
  await prisma.item.upsert({
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
}

async function upsertItemPriceRecord({
  content,
  prisma,
}: {
  content: Result;
  prisma: PrismaClient;
}) {
  const itemPrice = content.item_price;
  await prisma.itemPrice.upsert({
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
}

// async function getOrCreateChargbeeCustomerIdForUser({
//   userId,
//   prisma,
//   chargbee,
// }: {
//   userId: string;
//   prisma: PrismaClient;
//   chargbee: ChargeBee;
// }) {
//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   if (!user) throw new Error("User not found");

//   if (user.chargebeeCustomerId) {
//     return user.chargebeeCustomerId;
//   }

//   // create a new customer
//   const customer = await chargbee.customer.create({
//     email: user.email ?? undefined,
//     name: user.name ?? undefined,
//     // use metadata to link this Stripe customer to internal user id
//     metadata: {
//       userId,
//     },
//   });

//   // update with new customer id
//   const updatedUser = await prisma.user.update({
//     where: {
//       id: userId,
//     },
//     data: {
//       stripeCustomerId: customer.id,
//     },
//   });

//   if (updatedUser.stripeCustomerId) {
//     return updatedUser.stripeCustomerId;
//   }
// }

export default async function webhookHandlers(
  payload: Event,
  { prisma }: { prisma: PrismaClient }
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
      break;
    case "item_price_created":
    case "item_price_updated":
      await upsertItemPriceRecord({
        content,
        prisma,
      });
      break;
  }
}
