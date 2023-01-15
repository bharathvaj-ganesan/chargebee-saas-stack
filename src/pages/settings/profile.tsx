import SettingsLayout from "@/components/SettingsLayout";
import LoadingDots from "@/components/ui/LoadingDots";
import { requireAuth } from "@/server/common/get-server-auth-session";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();
  return (
    <>
      <SettingsLayout>
        <div className="flex gap-2 text-2xl">
          <div>Your Name&nbsp;</div>
          {session ? (
            <div className="text-primary">{session?.user?.name}</div>
          ) : (
            <LoadingDots />
          )}
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
