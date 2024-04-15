"use client";

import { useCounterStore } from "@/providers/counter-store-provider";

export function Viewer() {
  const count = useCounterStore((state) => state.count);

  return <p>{count}</p>;
}
