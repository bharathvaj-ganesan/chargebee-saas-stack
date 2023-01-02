import Pricing from "@/components/Pricing";
import { GetStaticPropsResult } from "next";
import { Item, ItemPrice } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/trpc/router/_app";
import { createContextInner } from "@/server/trpc/context";

interface Props {
  items: Item[];
  itemPrices: ItemPrice[];
}

export default function PricingPage({ items, itemPrices }: Props) {
  return <Pricing items={items} itemPrices={itemPrices} />;
}

export async function getStaticProps(): Promise<GetStaticPropsResult<any>> {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
  });
  const [items, itemPrices] = await Promise.all([
    ssg.pricing.getAllItems.fetch(),
    ssg.pricing.getAllItemPrices.fetch(),
  ]);

  return {
    props: {
      items: items,
      itemPrices,
    },
    revalidate: 3600,
  };
}
