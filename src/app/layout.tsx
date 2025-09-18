import {
  createTheme,
  DarkThemeToggle,
  ThemeModeScript,
  ThemeProvider,
} from "flowbite-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeInit } from "../../.flowbite-react/init";
import "./globals.css";
import type { PropsWithChildren } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLM Knowledge Extractor",
  description: "LLM Knowledge Extractor ",
};

const customTheme = createTheme({
  tabs: {
    base: "w-full",
    tablist: {
      base: "mx-auto w-auto gap-2 rounded-xl bg-gray-200 p-1.5 dark:bg-gray-600",
      tabitem: {
        base: "cursor-pointer rounded-xl text-base font-semibold text-gray-800",
        variant: {
          default: {
            active: {
              on: "bg-white text-gray-800 dark:text-white",
              off: "bg-transparent dark:text-gray-300",
            },
          },
        },
      },
    },
  },
  table: {
    root: {
      shadow: "drop-shadow-none dark:shadow-md",
      wrapper: "rounded-md! border border-gray-200 dark:border-gray-900",
    },
    body: {
      cell: {
        base: "px-3",
      },
    },
    head: {
      cell: {
        base: "px-3",
      },
    },
    row: {
      base: "border-gray-200 dark:border-gray-900",
    },
  },
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} px-10 antialiased dark:bg-gray-900`}
      >
        <ThemeInit />
        <DarkThemeToggle className="absolute top-4 right-4 cursor-pointer" />
        <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
