import { requireAuth } from "@/server/common/get-server-auth-session";
import { useSession } from "next-auth/react";
import LoadingDots from "@/components/ui/LoadingDots";
import Button from "@/components/ui/Button";

import Link from "next/link";
import { useState, ReactNode } from "react";

export default function AccountPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  // const { , subscription, userDetails } = useUser();

  const subscription: any = undefined;
  const isLoading = false;

  const redirectToCustomerPortal = async () => {
    // setLoading(true);
    // try {
    //   const { url, error } = await postData({
    //     url: '/api/create-portal-link'
    //   });
    //   window.location.assign(url);
    // } catch (error) {
    //   if (error) return alert((error as Error).message);
    // }
    // setLoading(false);
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0,
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <section className="mb-32 bg-black">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-8 sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            <span className="text-primary">{`${session?.user?.name}'s `}</span>
            <span>Account</span>
          </h1>
          <p className="m-auto mt-5 max-w-2xl text-xl text-zinc-200 sm:text-center sm:text-2xl">
            We partnered with Chargebee for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : ""
          }
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Manage your subscription on Chargebee.
              </p>
              <Button
                variant="slim"
                loading={loading}
                disabled={loading || !subscription}
                onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {isLoading ? (
              <div className="mb-6 h-12">
                <LoadingDots />
              </div>
            ) : subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/">
                <span>Choose your plan</span>
              </Link>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Card({ title, description, footer, children }: any) {
  return (
    <div className="p m-auto	my-8 w-full max-w-3xl rounded-md border border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="rounded-b-md border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}

export const getServerSideProps = requireAuth(() => {
  return Promise.resolve({ props: {} });
});
