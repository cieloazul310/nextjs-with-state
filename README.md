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

## Zustand with Vitest and Testing Library

### Zustand公式ドキュメントの例の修正

`test`を実行するたびに、`test`内の`renderCounter`によって`screen`にDOMが増殖していく。結局、`test`内の`renderCounter`を削除し、`describe`の先頭に下記のコードを記載した。

```tsx
// __tests__/counter.test.tsx
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";

beforeEach(() => {
  renderCounter();
});
afterEach(cleanup);
```

### useStoreの修正

```tsx
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

export const useCounterStore = <T,>(
  selector: (store: CounterStore) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  // return useStore(counterStoreContext, selector);
  return useStoreWithEqualityFn(counterStoreContext, selector, shallow);
};
```

Testing - Zustand  
<https://docs.pmnd.rs/zustand/guides/testing>

Mocking - Vitest  
<https://vitest.dev/guide/mocking.html>

TypeScript Guide / `create` without curried workaround - Zustand  
<https://docs.pmnd.rs/zustand/guides/typescript#create-without-curried-workaround>

## Next.js App Router with Vitest and Testing Library

Setting up Vitest with Next.js - Next.js  
<https://nextjs.org/docs/app/building-your-application/testing/vitest>

Vitest Example - Next.js Repo  
<https://github.com/vercel/next.js/tree/canary/examples/with-vitest>

Common Errors / Cannot find module './relative-path' - Vitest  
<https://vitest.dev/guide/common-errors.html#cannot-find-module-relative-path>

## Storybook with Next.js

Storybook with Next.js - Storybook  
<https://storybook.js.org/docs/get-started/nextjs>

## Storybook with Panda CSS

Styling and CSS / Post CSS - Storybook  
<https://storybook.js.org/docs/configure/styling-and-css#postcss>

[Zustand]: https://docs.pmnd.rs/zustand/
[ESLint]: https://eslint.org/
[Vitest]: https://vitest.dev/
[Testing Library]: https://testing-library.com/
[Storybook]: https://storybook.js.org/
[Panda CSS]: https://panda-css.com/
