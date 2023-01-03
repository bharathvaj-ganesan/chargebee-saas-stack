import Head from "next/head";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import type { ReactNode } from "react";

interface PageMeta {
  title: string;
  description: string;
}

interface Props {
  children: ReactNode;
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const meta = {
    title: "Chargebee Subscription SAAS Stack",
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
      <div className="flex h-screen flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
