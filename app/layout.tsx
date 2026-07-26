import type { Metadata, Viewport } from "next";
import { Amatic_SC, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import config from "@/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const amaticSC = Amatic_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-handwritten",
});

export const metadata: Metadata = {
  title: {
    default: `${config.appName} — ${config.tagline}`,
    template: `%s — ${config.appName}`,
  },
  description: config.appDescription,
  keywords: [
    "healing music",
    "brain waves",
    "binaural beats",
    "solfeggio frequencies",
    "daily affirmations",
    "meditation app",
    "sound healing",
  ],
  metadataBase: new URL(`https://${config.domainName}`),
  robots: { index: true, follow: true },
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
    images: [{ url: "/nuralume-logo.png", width: 603, height: 722, alt: config.appName }],
  },
  twitter: {
    card: "summary",
    title: `${config.appName} — ${config.tagline}`,
    description: config.appDescription,
    images: ["/nuralume-logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: config.colors.main,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: config.appName,
  url: `https://${config.domainName}`,
  logo: `https://${config.domainName}/nuralume-logo.png`,
  description: config.appDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme={config.colors.theme}>
      <body className={`${inter.variable} ${amaticSC.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
