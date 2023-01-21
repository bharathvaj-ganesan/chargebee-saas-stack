import { useRouter } from "next/router";
import type { LinkProps } from "next/link";
import Link from "next/link";
import s from "./Navbar.module.css";

export default function NavLink({
  href,
  exact = true,
  children,
  ...props
}: LinkProps & {
  className?: string;
  exact?: boolean;
  children: any;
  activeClassName?: string;
}) {
  const { pathname } = useRouter();
  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href as string);

  if (isActive) {
    props.className += props.activeClassName
      ? props.activeClassName
      : ` ${s.active}`;
  }

  return (
    <Link href={href} className={props.className}>
      <span {...props}>{children}</span>
    </Link>
  );
}
