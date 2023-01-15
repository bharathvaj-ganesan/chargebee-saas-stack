import NavLink from "./NavLink";
import s from "./Navbar.module.css";
import { useSession, signOut, signIn } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  function signOutHandler() {
    signOut({
      callbackUrl: "/",
    });
  }

  function signInHandler() {
    signIn();
  }

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="align-center relative flex flex-row justify-between py-4 md:py-6">
          <div className="flex flex-1 items-center">
            <NavLink href="/">
              <span className="font-bold text-gray-200">Chargebee</span>
              &nbsp;<span className="text-primary">Stack</span>
            </NavLink>
            <nav className="ml-6 hidden space-x-2 lg:block">
              <NavLink href="/pricing">
                <span className={s.link}>Pricing</span>
              </NavLink>
              {session && (
                <NavLink href="/settings">
                  <span className={s.link}>Settings</span>
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {session ? (
              <span className={s.link} onClick={signOutHandler}>
                Sign out
              </span>
            ) : (
              <span onClick={signInHandler}>
                <span className={s.link}>Sign in</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
