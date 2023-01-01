/**
 * Will be executed outside of NextJS context
 */
const { ChargeBee } = require("chargebee-typescript");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv");

async function clearProductCatalog() {
  await prisma.item.deleteMany();
  console.log("Deleted records in items table");

  await prisma.itemPrice.deleteMany();
  console.log("Deleted records in item prices table");
}

async function loadLatestProductCatalog() {
  const cb = new ChargeBee();
  cb.configure({
    site: process.env.NEXT_PUBLIC_CHARGEBEE_SITE_ID,
    api_key: process.env.CHARGEBEE_API_KEY,
  });
  const plans = await cb.item
    .list({
      "type[is]": "plan",
      "status[is]": "active",
      "item_family_id[is]": "cbdemo_pf_analytics",
      limit: 3,
    })
    .request()
    .then(({ list }) =>
      list.map(({ item }) => ({
        id: item.id,
        name: item.external_name,
        description: item.description,
        metadata: item.metadata,
      }))
    );
  await prisma.item.createMany({
    data: plans,
  });
  console.log("Created records in items table");

  const itemPrices = await cb.item_price
    .list({
      "item_id[in]": `[${plans.map((p) => p.id).join(",")}]`,
      "item_type[is]": "plan",
      "status[is]": "active",
      "item_family_id[is]": "cbdemo_pf_analytics",
      limit: 100,
    })
    .request()
    .then(({ list }) =>
      list.map(({ item_price }) => ({
        id: item_price.id,
        itemId: item_price.item_id,
        name: item_price.external_name,
        description: item_price.description,
        pricingModel: item_price.pricingModel,
        period: item_price.period,
        currencyCode: item_price.currency_code,
        periodUnit: item_price.period_unit,
        price: item_price.price,
        metadata: item_price.metadata,
        active: item_price.status === "active",
      }))
    );
  await prisma.itemPrice.createMany({
    data: itemPrices,
  });
  console.log("Created records in item prices table");
}

const load = async () => {
  try {
    await clearProductCatalog();
    await loadLatestProductCatalog();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
load();
