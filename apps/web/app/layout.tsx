import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import LenisSmoothScroll from "./animations/LenisSmoothScroll";
import ScrollBarCustom from "./components/ScrollBarCustom";
import { Footer } from "./components/Footer";
import { NpmIcon } from "./components/NpmIcon";
import { ThemeToggle } from "./components/ThemeToggle";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ThemeScript } from "./theme/ThemeScript";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Creative Skills Kit",
  description: "An installable registry of creative skills and coding standards.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ScrollBarCustom />
          <NpmIcon />
          <ThemeToggle />
          <LenisSmoothScroll>
            {children}
            <Footer />
          </LenisSmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
