import superjson from "superjson";
import Pricing from "@/components/Pricing";
import { GetServerSidePropsResult } from "next";
import { Item, ItemPrice } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/trpc/router/_app";
import { createContext } from "@/server/trpc/context";

interface Props {
  items: Item[];
  itemPrices: ItemPrice[];
}

export default function PricingPage({ items, itemPrices }: Props) {
  return <Pricing items={items} itemPrices={itemPrices} />;
}

export async function getServerSideProps(
  context: any
): Promise<GetServerSidePropsResult<any>> {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: superjson,
  });
  const [items, itemPrices] = await Promise.all([
    ssg.pricing.getAllItems.fetch(),
    ssg.pricing.getAllItemPrices.fetch(),
  ]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      items: items,
      itemPrices,
    },
  };
}
