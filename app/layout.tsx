import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDRA Arsitek 25th Anniversary Invitation",
  description: "Undangan Anniversary ke-25 EDRA Arsitek — 4 Juli 2026. Dengan penuh kebahagiaan kami mengundang Anda hadir merayakan 25 tahun perjalanan kami.",
  icons: {
    icon: "/assets/edra-logo.png",
  },
  openGraph: {
    title: "EDRA Arsitek 25th Anniversary",
    description: "Undangan Anniversary ke-25 EDRA Arsitek — 4 Juli 2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
