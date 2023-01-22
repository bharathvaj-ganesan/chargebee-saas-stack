import { Queue } from "quirrel/next";
import fetch from "@/utils/fetch";

export default Queue("api/queues/webhook", async (job: any) => {
  const { event, webhook } = job;
  const headerName = process.env.HEADER_NAME || "Shotstack";

  const config = {
    headers: {
      ["X-" + headerName + "-Event-Type"]: event.type,
      "User-Agent": headerName + "-Webhook/1.0",
      "Content-Type": "application/json",
    },
    timeout: 10000,
  };

  try {
    await fetch(webhook.subscriberUrl, {
      method: "POST",
      body: JSON.stringify(event.payload),
      ...config,
    });
  } catch (error: any) {
    console.log(error);
    console.log("bharath errror");
    if (error.code && error.code === "ECONNABORTED") {
      throw new Error("Response exceeded timeout of : " + 10000 + "ms");
    }

    if (error.response && error.response.status) {
      throw new Error(
        "Callback POST failed with status code: " + error.response.status
      );
    }
  }
});
