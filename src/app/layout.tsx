import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eurostar Booking - Diplat Korea",
  description: "Book Eurostar train tickets across Europe",
  manifest: "/eurostar-booking/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Eurostar",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#191f28",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/eurostar-booking/icon-180.png" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
