import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Financial Literacy Quest",
  description: "Gamified financial literacy with seamless onramps into credit-building services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
