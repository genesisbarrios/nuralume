import type { Metadata, Viewport } from "next";
import { Amatic_SC, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import config from "@/config";
import { defaultOgImage } from "@/libs/seo";
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
    "spiritual wellness app",
    "spiritual app",
    "sound healing",
    "healing frequencies",
    "solfeggio frequencies",
    "432 hz music",
    "binaural beats",
    "brain waves music",
    "meditation music",
    "daily affirmations",
    "daily horoscope",
    "birth chart",
    "numerology",
    "human design",
    "spiritual growth",
    "mindfulness",
  ],
  applicationName: config.appName,
  category: "health",
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
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.appName} — ${config.tagline}`,
    description: config.appDescription,
    images: [defaultOgImage.url],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: config.colors.main,
};

const site = `https://${config.domainName}`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site}/#organization`,
      name: config.appName,
      url: site,
      logo: `${site}/nuralume-logo.png`,
      description: config.appDescription,
    },
    {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      name: config.appName,
      url: site,
      description: config.appDescription,
      publisher: { "@id": `${site}/#organization` },
      inLanguage: "en",
    },
  ],
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
