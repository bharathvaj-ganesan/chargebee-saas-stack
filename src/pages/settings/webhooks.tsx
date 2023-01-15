import SettingsLayout from "@/components/SettingsLayout";
import Button from "@/components/ui/Button";
import LoadingDots from "@/components/ui/LoadingDots";
import { requireAuth } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

export default function Webhooks() {
  const { mutateAsync: fireEvent, isLoading } =
    trpc.example.fireEvent.useMutation();

  return (
    <>
      <SettingsLayout>
        <div className="font-bold">Your Webhooks</div>
        <div>
          <Button
            variant="slim"
            loading={isLoading}
            className="mt-8 block  rounded-md py-2 text-center text-sm font-semibold hover:border-primary hover:bg-zinc-900"
            onClick={() => fireEvent()}
          >
            Fire some event
          </Button>
        </div>
      </SettingsLayout>
    </>
  );
}

export const getServerSideProps = requireAuth(async ({ res }: any) => {
  return {
    props: {},
  };
});
