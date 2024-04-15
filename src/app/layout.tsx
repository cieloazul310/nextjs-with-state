import type { Metadata } from "next";
import NextLink from "next/link";
import type { PropsWithChildren } from "react";
import { css } from "styled-system/css";
import { container, hstack } from "styled-system/patterns";
import { link } from "styled-system/recipes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js with state",
  description: "Next.js App Router with state management by zustand",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="ja">
      <body className={container({ maxWidth: "4xl" })}>
        <nav
          className={hstack({
            gap: 2,
            height: "56px",
            borderBottomColor: "accent.6",
            borderBottomWidth: "2px",
          })}
        >
          <NextLink className={link()} href="/">
            Top
          </NextLink>
          <NextLink className={link()} href="/about">
            About
          </NextLink>
          <NextLink className={link()} href="/hoge">
            Hoge
          </NextLink>
        </nav>
        <main className={css({ pt: 4 })}>{children}</main>
      </body>
    </html>
  );
}
