import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import LenisSmoothScroll from "./animations/LenisSmoothScroll";
import ScrollBarCustom from "./components/ScrollBarCustom";
import { Footer } from "./components/Footer";
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
    >
      <body className="min-h-full flex flex-col">
        <ScrollBarCustom />
        <LenisSmoothScroll>
          {children}
          <Footer />
        </LenisSmoothScroll>
      </body>
    </html>
  );
}
