// src/providers/counter-store-provider.tsx
"use client";

import {
  type PropsWithChildren,
  createContext,
  useRef,
  useContext,
} from "react";
import { type StoreApi } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

import { type CounterStore, createCounterStore } from "@/stores/counter-store";

export const CounterStoreContext = createContext<StoreApi<CounterStore> | null>(
  null,
);

export type CounterStoreProviderProps = PropsWithChildren;

export const CounterStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CounterStore>>();
  if (!storeRef.current) {
    storeRef.current = createCounterStore();
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  );
};

export const useCounterStore = <T,>(
  selector: (store: CounterStore) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStoreWithEqualityFn(counterStoreContext, selector, shallow);
};
