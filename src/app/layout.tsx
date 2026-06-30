import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create New Account",
  description: "Poker Mavens player registration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden antialiased">{children}</body>
    </html>
  );
}
