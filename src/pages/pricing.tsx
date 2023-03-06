import type { DimensionEvent } from "@/events/defn";
import { EventKeys } from "@/events/defn";
import useMessage from "@/events/listener";
import { useState } from "react";

export default function PricingPage() {
  const [dimension, setDimension] = useState<DimensionEvent>({});

  useMessage(
    EventKeys.DIMENSION,
    (data) => {
      console.log(data);
      setDimension(data);
    },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    new URL(process.env.NEXT_PUBLIC_ATOMIC_PRICING_HOSTED_PAGE!).origin
  );

  return (
    <iframe
      style={{
        height: dimension.scroll?.height,
        // width: dimension.scroll?.width,
      }}
      src={process.env.NEXT_PUBLIC_ATOMIC_PRICING_HOSTED_PAGE}
      className="w-full bg-inherit"
    />
  );
}
