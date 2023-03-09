import Pricify from "@chargebee/atomicpricing";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      Pricify.init();
    }
  }, [hasMounted]);

  return (
    <>
      {hasMounted && (
        <div
          id="pricify-hosted-pricing-page"
          data-pricify-site="01GTC02AXKE17Q0J9ZNMF73FRH"
          data-pricify-pricingpage="default"
        ></div>
      )}
      <div>
        <p className="mt-24 text-center text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
          Brought to you by
        </p>
        <div className="my-12 flex flex-col items-center space-y-4 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 md:mx-auto md:max-w-2xl">
          <div className="flex items-center justify-center">
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
          <div className="flex items-center justify-center">
            <a
              target="_blank"
              href="https://atomicpricing.com"
              rel="noreferrer"
              aria-label="atomicpricing.com Link"
            >
              <img
                src="/atomicpricing-white.svg"
                alt="atomicpricing.com Logo"
                className="h-14 text-white"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
