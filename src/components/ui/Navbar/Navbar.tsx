import Link from "next/link";
import s from "./Navbar.module.css";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();

  function signOutHandler() {
    signOut();
    router.push("/signin");
  }

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="align-center relative flex flex-row justify-between py-4 md:py-6">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <span className="font-bold text-gray-200">Chargebee</span>
              &nbsp;<span className="text-primary">Stack</span>
            </Link>
            <nav className="ml-6 hidden space-x-2 lg:block">
              <Link href="/pricing">
                <span className={s.link}>Pricing</span>
              </Link>
              {session && (
                <Link href="/account">
                  <span className={s.link}>Account</span>
                </Link>
              )}
            </nav>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {session ? (
              <span className={s.link} onClick={signOutHandler}>
                Sign out
              </span>
            ) : (
              <Link href="/signin">
                <span className={s.link}>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
