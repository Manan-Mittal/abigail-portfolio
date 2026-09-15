"use client";

import dynamic from "next/dynamic";
import { useScrollDriver } from "@/lib/scroll";

// Touches document on mount, so it never renders on the server.
// The page is fully readable without it.
const PixelScene = dynamic(
  () => import("./pixel/PixelScene").then((m) => m.PixelScene),
  { ssr: false },
);

export function RideCanvas() {
  useScrollDriver();
  return (
    <div className="scene-layer">
      <PixelScene />
    </div>
  );
}
