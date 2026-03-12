import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE AGENCY — AI Specialists Platform",
  description:
    "135+ specialized AI agents across 15 divisions. Tell it what you need — the right specialist handles it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
