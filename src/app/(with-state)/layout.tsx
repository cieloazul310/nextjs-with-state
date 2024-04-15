import type { PropsWithChildren } from "react";
import { CounterStoreProvider } from "@/providers/counter-store-provider";

export default function Layout({ children }: PropsWithChildren) {
  return <CounterStoreProvider>{children}</CounterStoreProvider>;
}
