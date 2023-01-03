import { requireAuth } from "@/server/common/get-server-auth-session";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import { useState } from "react";
import Script from "next/script";
import { trpc } from "@/utils/trpc";

export default function AccountPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [cbInstance, setCbInstance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { mutateAsync: createPortalSession } =
    trpc.subscription.createPortalSession.useMutation();

  const { data: subscription } =
    trpc.subscription.getSubscriptionStatus.useQuery();

  function initChargebee() {
    return window.Chargebee.init({
      site: process.env.NEXT_PUBLIC_CHARGEBEE_SITE_ID,
      isItemsModel: true,
    });
  }

  const redirectToCustomerPortal = async () => {
    if (typeof window !== "undefined") {
      if (!cbInstance && window.Chargebee) {
        setCbInstance(initChargebee());
        return;
      }
    }
    setLoading(true);
    cbInstance.setPortalSession(async () => {
      const portalPage = await createPortalSession();
      return portalPage;
    });
    const cbPortal = cbInstance.createChargebeePortal();

    cbPortal.open({
      close() {
        alert("It'll take sometime to reflect the changes if made any.");
      },
    });
    setLoading(false);
  };

  return (
    <section className="mb-32 bg-black">
      <Script
        src="https://js.chargebee.com/v2/chargebee.js"
        onLoad={() => {
          setCbInstance(initChargebee());
        }}
      />
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-8 sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            <span className="text-primary">{`${user?.name}'s `}</span>
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
              ? `You are currently on the ${subscription?.ItemPrice?.name} plan.`
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
        ></Card>
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

export const getServerSideProps = requireAuth(async (context: any) => {
  return {
    props: {},
  };
});
