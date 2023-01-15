import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders, signIn } from "next-auth/react";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import type { GetServerSidePropsContext } from "next";
import LoadingDots from "@/components/ui/LoadingDots";

export default function SigninPage() {
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const promises: Promise<any>[] = [];
    !providers && promises.push(getProviders().then(setProviders));
    Promise.all(promises).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="bg-black">
        <div className="align-center mx-auto flex max-w-6xl flex-col items-center py-8 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="block h-80 max-w-sm rounded-lg border border-zinc-600 p-12 shadow-md">
            <span>Fetching login options </span>
            <LoadingDots />
          </div>
        </div>
      </section>
    );
  }

  if (!providers) {
    return (
      <section className="bg-black">
        <div className="align-center mx-auto flex max-w-6xl flex-col items-center py-8 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-xl">
            Sorry, no login options are available to login at the moment.
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-black">
        <div className="align-center mx-auto flex max-w-6xl flex-col items-center py-8 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="block h-80 max-w-sm rounded-lg border border-zinc-600 p-12 shadow-md">
            <div className="mb-4	text-center	text-2xl	font-bold">Welcome back</div>
            {Object.keys(providers)
              .filter((p) => providers[p]?.type !== "credentials")
              .map((providerKey: string) => (
                <Button
                  type="submit"
                  key={providerKey}
                  className="w-100 mb-3"
                  onClick={() =>
                    signIn(providers[providerKey]?.id, {
                      callbackUrl: "/settings",
                    })
                  }
                >
                  Continue with {providers[providerKey]?.name}{" "}
                </Button>
              ))}
          </div>
          <div className="d-flex align-items-center min-vh-100 bg-auth border-top border-top-2 border-primary">
            <div>
              <div className="justify-content-center">
                <div className="my-5">
                  {/* {query.error && (
                  <>
                    <div>
                      Could not login. Please check your e-mail or password or
                      third-party application.
                    </div>
                  </>
                )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: { destination: "/settings" },
    };
  }
  return {
    props: {},
  };
}
