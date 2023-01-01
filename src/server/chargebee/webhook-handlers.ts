import { prisma } from "@/server/db/client";
import { ChargebeePeriodUnit, ChargebeePricingModel } from "@prisma/client";
import type Chargebee from "chargebee-typescript";
import { Event } from "chargebee-typescript/lib/resources";

type Result = Event["content"];

async function upsertItemRecord(data: Result) {
  const item = data.item;
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

async function upsertItemPriceRecord(data: Result) {
  const itemPrice = data.item_price;
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

export default async function webhookHandlers(payload: Event) {
  if (!payload) {
    throw new Error("Empty body");
  }
  const eventType = payload.event_type;
  const content = payload.content;

  switch (eventType) {
    case "item_created":
    case "item_updated":
      await upsertItemRecord(content);
      break;
    case "item_price_created":
    case "item_price_updated":
      await upsertItemPriceRecord(content);
      break;
  }
}
