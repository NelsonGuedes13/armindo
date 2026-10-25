import type { Metadata, Viewport } from "next";
import "@fontsource/bangers/400.css";
import "@fontsource/comic-neue/400.css";
import "@fontsource/comic-neue/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Linha Vermelha — BD",
  description: "Banda desenhada interativa com scroll imersivo: o Alfaiate contra o Agricultor.",
};

export const viewport: Viewport = {
  themeColor: "#14100c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
