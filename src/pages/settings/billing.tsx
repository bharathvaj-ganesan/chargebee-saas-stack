import { requireAuth } from "@/server/common/get-server-auth-session";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import { useState } from "react";
import Script from "next/script";
import { trpc } from "@/utils/trpc";
import LoadingDots from "@/components/ui/LoadingDots";
import SettingsLayout from "@/components/SettingsLayout";

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

  if (!user) {
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
            setCbInstance(initChargebee());
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
                  onClick={redirectToCustomerPortal}
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
