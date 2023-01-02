import cn from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Script from "next/script";
import { ChargebeePeriodUnit, Item, ItemPrice } from "@prisma/client";
import { useSession } from "next-auth/react";
import { env } from "@/env/client.mjs";

interface Props {
  items: Item[];
  itemPrices: ItemPrice[];
}

declare global {
  interface Window {
    // Chargebee.js must be loaded directly from https://js.chargebee.com/v2/chargebee.js, which
    // places a `Chargebee` object on the window
    Chargebee?: any;
  }
}

export default function Pricing({ items = [], itemPrices = [] }: Props) {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { data: session } = useSession();
  const [periodUnit, setPeriodUnit] = useState<ChargebeePeriodUnit>(
    ChargebeePeriodUnit.month
  );
  const [itemPricesToDisplay, setItemPricesToDisplay] = useState<ItemPrice[]>(
    []
  );

  const getItem = (itemId: string) => items.find((i) => i.id === itemId);

  useEffect(() => {
    setItemPricesToDisplay(
      itemPrices
        .filter((item) => item.periodUnit === periodUnit)
        .sort((a, b) => a.price - b.price)
    );
  }, [itemPrices, periodUnit]);

  const handleCheckout = async (price: ItemPrice) => {
    setPriceIdLoading(price.id);
    if (!session?.user) {
      return router.push("/auth/signin");
    }
    // TODO
    // if (subscription) {
    //   return router.push("/account");
    // }

    // try {
    //   const { sessionId } = await postData({
    //     url: "/api/create-checkout-session",
    //     data: { price },
    //   });

    //   const stripe = await getStripe();
    //   stripe?.redirectToCheckout({ sessionId });
    // } catch (error) {
    //   return alert((error as Error)?.message);
    // } finally {
    //   setPriceIdLoading(undefined);
    // }
  };

  if (!itemPrices.length)
    return (
      <section className="bg-black">
        <div className="mx-auto max-w-6xl py-8 px-4 sm:py-24 sm:px-6 lg:px-8">
          <p className="mt-12 text-2xl font-extrabold text-white sm:text-center sm:text-3xl">
            No subscription pricing plans found. <br />
            Create them in your{" "}
            <a
              className="text-primary underline"
              href={`https://${env.NEXT_PUBLIC_CHARGEBEE_SITE_ID}.chargebee.com/plans`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Chargbee Web Console
            </a>
            .
          </p>
        </div>
      </section>
    );

  return (
    <section className="bg-black">
      <Script
        src="https://js.chargebee.com/v2/chargebee.js"
        onLoad={() => {
          window.Chargebee.init({
            site: process.env.NEXT_PUBLIC_CHARGEBEE_SITE_ID,
            isItemsModel: true,
          });
        }}
      />
      <div className="mx-auto max-w-6xl py-8 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-primary sm:text-center sm:text-6xl">
            Pricing
          </h1>
          <p className="m-auto mt-5 max-w-2xl text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>
          <div className="relative mt-6 flex self-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 sm:mt-8">
            <button
              onClick={() => setPeriodUnit(ChargebeePeriodUnit.month)}
              type="button"
              className={`${
                periodUnit === ChargebeePeriodUnit.month
                  ? "relative w-1/2 border-zinc-800 bg-primary text-white shadow-sm"
                  : "relative ml-0.5 w-1/2 border border-transparent text-zinc-400"
              } m-1 whitespace-nowrap rounded-md py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setPeriodUnit(ChargebeePeriodUnit.year)}
              type="button"
              className={`${
                periodUnit === ChargebeePeriodUnit.year
                  ? "relative w-1/2 border-zinc-800 bg-primary text-white shadow-sm"
                  : "relative ml-0.5 w-1/2 border border-transparent text-zinc-400"
              } m-1 whitespace-nowrap rounded-md py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
            >
              Yearly billing
            </button>
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-3xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {itemPricesToDisplay.map((itemPrice, idx) => {
            const priceString = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: itemPrice.currencyCode,
              minimumFractionDigits: 0,
            }).format((itemPrice.price || 0) / 100);

            const item = getItem(itemPrice.itemId);

            return (
              <div
                key={itemPrice.id}
                className={cn(
                  "divide-y divide-zinc-600 rounded-lg bg-zinc-900 shadow-sm"
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold leading-6 text-white">
                    {item?.name || itemPrice.name}
                  </h2>
                  <p
                    className="mt-4 text-zinc-300"
                    style={{ minHeight: "84px" }}
                  >
                    {item?.description || itemPrice.description}
                  </p>
                  <p className="mt-12">
                    <span className="white text-5xl font-extrabold">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-zinc-100">
                      /{periodUnit}
                    </span>
                  </p>
                  <div
                    data-cb-type="checkout"
                    data-cb-item-0={itemPrice.id}
                    data-cb-item-0-quantity="1"
                  >
                    <Button
                      variant="slim"
                      className="mt-8 block w-full rounded-md py-2 text-center text-sm font-semibold hover:border-primary hover:bg-zinc-900"
                    >
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <p className="mt-24 text-center text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
            Brought to you by
          </p>
          <div className="my-12 flex flex-col items-center space-y-4 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 md:mx-auto md:max-w-2xl">
            <div className="flex items-center justify-start">
              <a
                target="_blank"
                href="https://nextjs.org"
                rel="noreferrer"
                aria-label="Next.js Link"
              >
                <img
                  src="/nextjs.svg"
                  alt="Next.js Logo"
                  className="h-12 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a
                target="_blank"
                href="https://chargebee.com"
                rel="noreferrer"
                aria-label="chargebee.com Link"
              >
                <img
                  src="/chargebee.svg"
                  alt="chargebee.com Logo"
                  className="h-14 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a
                target="_blank"
                href="https://github.com"
                rel="noreferrer"
                aria-label="github.com Link"
              >
                <img
                  src="/github.svg"
                  alt="github.com Logo"
                  className="h-8 text-white"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
