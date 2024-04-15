// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";

export type CounterState = {
  count: number;
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  reset: () => void;
};

export type CounterStore = CounterState & CounterActions;

export const defaultInitState: CounterState = {
  count: 0,
};

export const createCounterStore = (
  initState: CounterState = defaultInitState,
) => {
  return createStore<CounterStore>()(
    persist(
      (set) => ({
        ...initState,
        reset: () => set(() => defaultInitState),
        decrementCount: () =>
          set((state) => ({ count: Math.max(state.count - 1, 0) })),
        incrementCount: () => set((state) => ({ count: state.count + 1 })),
      }),
      {
        name: "counter-store",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );
};
