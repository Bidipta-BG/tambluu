"use client";

import dynamic from "next/dynamic";

const LaunchOfferModal = dynamic(() => import("./LaunchOfferModal"), {
  ssr: false,
});

export default function LaunchOfferModalWrapper() {
  return <LaunchOfferModal />;
}
