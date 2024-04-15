"use client";

import type { ComponentProps } from "react";
import { useCounterStore } from "@/providers/counter-store-provider";

export function IncrementButton(props: ComponentProps<"button">) {
  const incrementCount = useCounterStore((state) => state.incrementCount);

  return <button onClick={incrementCount} {...props} />;
}
