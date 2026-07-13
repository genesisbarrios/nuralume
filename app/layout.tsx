import type { Metadata, Viewport } from "next";
import { Inter, Kalam } from "next/font/google";
import { Toaster } from "react-hot-toast";
import config from "@/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-handwritten",
});

export const metadata: Metadata = {
  title: `${config.appName} — ${config.tagline}`,
  description: config.appDescription,
  metadataBase: new URL(`https://${config.domainName}`),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: config.appName,
  },
  openGraph: {
    title: `${config.appName} — ${config.tagline}`,
    description: config.appDescription,
    siteName: config.appName,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: config.colors.main,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme={config.colors.theme}>
      <body className={`${inter.variable} ${kalam.variable} font-sans antialiased`}>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
