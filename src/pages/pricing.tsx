import superjson from "superjson";
import Pricing from "@/components/Pricing";
import type { GetServerSidePropsResult } from "next";
import type { Item, ItemPrice, Subscription } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/trpc/router/_app";
import { createContext } from "@/server/trpc/context";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

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
  context: CreateNextContextOptions
): Promise<GetServerSidePropsResult<any>> {
  const ctx = await createContext(context);
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx,
    transformer: superjson,
  });
  const [items, itemPrices] = await Promise.all([
    ssg.pricing.getAllItems.fetch(),
    ssg.pricing.getAllItemPrices.fetch(),
  ]);

  let subscription = null;
  if (ctx.session) {
    const subscriptionResponse =
      await ssg.subscription.getSubscriptionStatus.fetch();
    subscription = subscriptionResponse.subscription;
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
