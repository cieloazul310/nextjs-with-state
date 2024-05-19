# Next.js App Router state management lab

- Next.js App Router
- [Zustand]
- [ESLint] Flag Config
- [Vitest]
- [Testing Library]
- [Storybook]
- [Panda CSS]

## Zustand with Next.js App Router

Setup with Next.js - Zustand  
<https://docs.pmnd.rs/zustand/guides/nextjs>

コンテクストを使ってプロバイダコンポーネント経由でZustandのstateを管理する

- `src/stores/counter-store.ts`: ストアの定義
- `src/providers/counter-store-provider.tsx`: コンテクストの作成とプロバイダ、フックの定義

stateを共有したいルートグループの`layout.tsx`にプロバイダコンポーネントを使用。

```tsx
// src/app/(with-state)/layout.tsx
import type { PropsWithChildren } from "react";
import { CounterStoreProvider } from "@/providers/counter-store-provider";

export default function Layout({ children }: PropsWithChildren) {
  return <CounterStoreProvider>{children}</CounterStoreProvider>;
}
```

### `sessionStorage`にstateを保存する

プロバイダコンポーネントを用いているルートグループの外に遷移するとstateはリセットされてしまう。`localStorage`や`sessionStorage`を使ってstateを保存したい場合、ストアを以下のように設定する。以下の例では`sessionStorage`を使用。

```ts
// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";

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
```

Persisting store data - Zustand  
<https://docs.pmnd.rs/zustand/integrations/persisting-store-data>

sessionStorage Web API - MDN  
<https://developer.mozilla.org/ja/docs/Web/API/Window/sessionStorage>

## Zustand with Vitest and Testing Library

Zustandを手順通りにモックする。`__mocks__`ディレクトリはVitestのルートディレクトリに配置する必要がある。この例ではプロジェクトのトップレベルをルートディレクトリに設定している。

Testing - Zustand  
<https://docs.pmnd.rs/zustand/guides/testing>

Mocking - Vitest  
<https://vitest.dev/guide/mocking.html>

mockしたZustandは`src/setup-vitest.ts`を用いて呼び出し、`vitest.config.ts`に記述する。

```ts
// src/setup-vitest.ts
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("zustand"); // to make it works like Jest (auto-mocking)
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setup-vitest.ts"],
  },
});
```

### TSConfigのpathsを適用

`vite-tsconfig-paths`プラグインを使用する。

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
```

vite-tsconfig-paths  
<https://github.com/aleclarson/vite-tsconfig-paths>

Common Errors / Cannot find module './relative-path' - Vitest  
<https://vitest.dev/guide/common-errors.html#cannot-find-module-relative-path>

### Zustand公式ドキュメントのコード例の修正

Zustand公式ドキュメントの通りに記載すると、`test`を実行するたびに、`test`内の`renderCounter`によって`screen`にDOMが増殖していく。結局、`test`内の`renderCounter`を削除し、`describe`の先頭に下記のコードを記載した。

```tsx
// __tests__/counter.test.tsx
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";

describe("test", () => {
  beforeEach(() => {
    renderCounter();
  });
  afterEach(cleanup);

  test("test name", () => {
    // ...
  });
});
```

### useStoreの修正

Zustand + Next.jsのコードをそのままVitestのテストに用いると上手く実行されない。Testingのコードと比較した結果、以下の修正を行うことでテストが正常に実行される。`useStore`を`useStoreWithEqualityFn`に置き換え、第3引数に`shallow`を用いる。なおこの変更がもたらすパフォーマンス面への影響は不明。

```tsx
// src/stores/use-counter-store.ts
// - import { useStore } from 'zustand'
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

export const useCounterStore = <T,>(
  selector: (store: CounterStore) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  // - return useStore(counterStoreContext, selector);
  return useStoreWithEqualityFn(counterStoreContext, selector, shallow);
};
```

## Next.js App Router with Vitest and Testing Library

Setting up Vitest with Next.js - Next.js  
<https://nextjs.org/docs/app/building-your-application/testing/vitest>

Vitest Example - Next.js Repo  
<https://github.com/vercel/next.js/tree/canary/examples/with-vitest>

## Storybook with Next.js

Storybook with Next.js - Storybook  
<https://storybook.js.org/docs/get-started/nextjs>

## Storybook with Panda CSS

Styling and CSS / Post CSS - Storybook  
<https://storybook.js.org/docs/configure/styling-and-css#postcss>

### Next.jsと共有する`postcss.config.cjs`の設定を適用

`@storybook/nextjs`のオプションで、`builder.useSWC`を`true`に設定する。

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  ...,
  addons: [
    ...,
    {
      name: "@storybook/addon-styling-webpack",
      options: {
        rules: [
          // Replaces existing CSS rules to support PostCSS
          {
            test: /\.css$/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: { importLoaders: 1 },
              },
              {
                // Gets options from `postcss.config.js` in your project root
                loader: "postcss-loader",
                options: { implementation: require.resolve("postcss") },
              },
            ],
          },
        ],
      },
    },
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
};
```

### TSConfigのpathsをStorybookに適用

```ts
// .storybook/main.ts
import * as path from "path";

const toPath = (filePath: string) => path.join(process.cwd(), filePath);

const config: StorybookConfig = {
  ...,
  webpackFinal: async (baseConfig) => {
    if (baseConfig.resolve) {
      baseConfig.resolve.alias = {
        ...baseConfig.resolve.alias,
        "styled-system": toPath("styled-system"),
      };
    }
    return baseConfig;
  },
};
```

### ダークモードの設定

まずダークモード使用の有無に関わらず`global.css`をインポートする。  
次に`@storybook/addon-themes`をインストールする。`.storybook/preview.tsx`を下記のように編集。

@storybook/addon-themes  
<https://storybook.js.org/addons/@storybook/addon-themes/>

```ts
// .storybook/preview.tsx
import { withThemeByDataAttribute } from "@storybook/addon-themes";

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "light",
    attributeName: "data-theme",
  }),
  (Story) => <Story />,
];
```

## Next.js with ESLint Flag config

`next/core-web-vitals`はFlat configに対応していないため、他のプラグインで置き換える。`eslint-plugin-react`はFlat configに対応しているが、ESLint v9に対応していないためESLint v8を用いた。

ESLint v8でFlat configを使うには、以下のように環境変数`ESLINT_USE_FLAT_CONFIG`を`true`に設定する。

```sh
ESLINT_USE_FLAT_CONFIG=true eslint . -c eslint.config.mjs
```

next-lint Doesn't Support ESLint 9 #64409  
<https://github.com/vercel/next.js/issues/64409>

### VSCodeをFlat configに対応させる

```json
{
  "eslint.experimental.useFlatConfig": true,
  "eslint.options": {
    "overrideConfigFile": "eslint.config.mjs"
  }
}
```

## Links

### Zustand

Setup with Next.js - Zustand  
<https://docs.pmnd.rs/zustand/guides/nextjs>

Persisting store data - Zustand  
<https://docs.pmnd.rs/zustand/integrations/persisting-store-data>

Testing - Zustand  
<https://docs.pmnd.rs/zustand/guides/testing>

### Vitest

Mocking - Vitest  
<https://vitest.dev/guide/mocking.html>

Common Errors / Cannot find module './relative-path' - Vitest  
<https://vitest.dev/guide/common-errors.html#cannot-find-module-relative-path>

### Next.js

Setting up Vitest with Next.js - Next.js  
<https://nextjs.org/docs/app/building-your-application/testing/vitest>

### Storybook

Storybook with Next.js - Storybook  
<https://storybook.js.org/docs/get-started/nextjs>

Styling and CSS / Post CSS - Storybook  
<https://storybook.js.org/docs/configure/styling-and-css#postcss>

[Zustand]: https://docs.pmnd.rs/zustand/
[ESLint]: https://eslint.org/
[Vitest]: https://vitest.dev/
[Testing Library]: https://testing-library.com/
[Storybook]: https://storybook.js.org/
[Panda CSS]: https://panda-css.com/
