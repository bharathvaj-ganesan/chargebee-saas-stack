import type { NextApiRequest, NextApiResponse } from "next";
import { CHARGEBEE_WEBHOOKS_REQUEST_ORIGINS } from "@/server/chargebee/config";
import webhookHandlers from "@/server/chargebee/handlers";
import { prisma } from "@/server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const requestIp =
        req.headers["x-real-ip"] || req.headers["x-forwarded-for"];

      if (
        requestIp &&
        CHARGEBEE_WEBHOOKS_REQUEST_ORIGINS.find((ip) => ip === requestIp)
      ) {
        await webhookHandlers(req.body, {
          prisma,
          req,
          res,
        });
        res.send("ok");
      } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("IP Address Not Allowed");
      }
    } catch (err) {
      res.status(400).send(`Webhook Error: ${(err as any).message}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
