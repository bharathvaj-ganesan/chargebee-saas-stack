import superjson from "superjson";
import Pricing from "@/components/Pricing";
import { GetServerSidePropsResult } from "next";
import { Item, ItemPrice, Subscription } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/trpc/router/_app";
import { createContext } from "@/server/trpc/context";

interface Props {
  items: Item[];
  itemPrices: ItemPrice[];
  subscription?: Subscription;
}

export default function PricingPage({
  items,
  itemPrices,
  subscription,
}: Props) {
  return (
    <Pricing
      items={items}
      itemPrices={itemPrices}
      subscription={subscription}
    />
  );
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

  let subscription = null;

  if (context.session) {
    subscription = ssg.subscription.getSubscriptionStatus.fetch();
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      subscription,
      items: items,
      itemPrices,
    },
  };
}
