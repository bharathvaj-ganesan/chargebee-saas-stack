import { requireAuth } from "@/server/common/get-server-auth-session";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { trpc } from "@/utils/trpc";
import LoadingDots from "@/components/ui/LoadingDots";
import SettingsLayout from "@/components/SettingsLayout";
import { ChargebeeSubscriptionStatus } from "@prisma/client";
import { initChargebee } from "@/utils/helpers";

export default function AccountPage() {
  const { data: session } = useSession();
  const { query } = useRouter();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const { mutateAsync: createPortalSession } =
    trpc.subscription.createPortalSession.useMutation();
  const {
    data: subscription,
    refetch: refetchSubscription,
    isLoading: isSubscriptionLoading,
  } = trpc.subscription.getSubscription.useQuery();
  const { mutateAsync: syncSubscription, isLoading: isSubscriptionSyncing } =
    trpc.subscription.syncSubscription.useMutation();

  const subscriptionId = query.sub_id as string;
  const subscriptionStatus = query.sub_status as string;

  useEffect(() => {
    if (
      !subscription &&
      !isSubscriptionLoading &&
      subscriptionId &&
      subscriptionStatus?.toLowerCase() === ChargebeeSubscriptionStatus.active
    ) {
      syncSubscription({
        subscriptionId,
      }).then(() => refetchSubscription());
    }
  }, [subscription, subscriptionId]);

  const openCustomerPortal = async () => {
    setLoading(true);
    window.cbInstance?.setPortalSession(async () => {
      const portalPage = await createPortalSession();
      return portalPage;
    });
    const cbPortal = window.cbInstance?.createChargebeePortal();

    cbPortal.open();
    setLoading(false);
  };

  if (!user || isSubscriptionSyncing || isSubscriptionLoading) {
    return (
      <>
        <SettingsLayout>
          <section
            className="flex h-full w-full justify-center align-middle
          "
          >
            <LoadingDots />
          </section>
        </SettingsLayout>
      </>
    );
  }

  return (
    <SettingsLayout>
      <div>
        <Script
          src="https://js.chargebee.com/v2/chargebee.js"
          onLoad={() => {
            window.cbInstance = initChargebee();
          }}
        />
        <div>
          <Card
            title="Your Plan"
            description={
              subscription
                ? `You are currently on the ${subscription?.ItemPrice?.name} plan.`
                : "You haven't subscribed for a plan."
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
                  onClick={openCustomerPortal}
                >
                  Open customer portal
                </Button>
              </div>
            }
          ></Card>
        </div>
      </div>
    </SettingsLayout>
  );
}

function Card({ title, description, footer, children }: any) {
  return (
    <div>
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

export const getServerSideProps = requireAuth(async ({ res }: any) => {
  return {
    props: {},
  };
});
