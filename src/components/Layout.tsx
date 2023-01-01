import Head from "next/head";
import { useRouter } from "next/router";

import Navbar from "components/ui/Navbar";
import Footer from "components/ui/Footer";
import { ReactNode } from "react";
import { PageMeta } from "../types";

interface Props {
  children: ReactNode;
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const meta = {
    title: "Chargebee Subscription SAAS Stack",
    description: "Brought to you by Chargebee and NextJS.",
    ...pageMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
