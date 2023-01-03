import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "@/server/db/client";
import { chargebee } from "@/server/chargebee/client";
import type { PrismaClient } from "@prisma/client";
import type { ChargeBee } from "chargebee-typescript";

export type CreateContextOptions = {
  session?: Session | null | undefined;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (
  opts?: CreateContextOptions
): Promise<{
  session: Session | null | undefined;
  prisma: PrismaClient;
  chargebee: ChargeBee;
}> => {
  return {
    session: opts?.session,
    prisma,
    chargebee,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
