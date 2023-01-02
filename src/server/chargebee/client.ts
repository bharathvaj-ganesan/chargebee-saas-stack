import { ChargeBee } from "chargebee-typescript";
import { API_KEY, SITE_ID } from "./config";

export const chargebee = (() => {
  const cb = new ChargeBee();
  cb.configure({
    site: SITE_ID,
    api_key: API_KEY,
  });
  return cb;
})();
