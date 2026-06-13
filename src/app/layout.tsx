import type { Metadata, Viewport } from "next";
import { ThemeScript } from "@/components/ThemeScript";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nicholasyun.com";

export const metadata: Metadata = {
  title: {
    default: "Nicholas Yun — Software Engineer & Designer",
    template: "%s | Nicholas Yun",
  },
  description:
    "Portfolio of Nicholas Yun — software engineer and designer crafting thoughtful digital experiences at the intersection of engineering precision and creative expression.",
  keywords: [
    "Nicholas Yun",
    "software engineer",
    "designer",
    "portfolio",
    "web development",
    "New York",
  ],
  authors: [{ name: "Nicholas Yun" }],
  creator: "Nicholas Yun",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Nicholas Yun",
    title: "Nicholas Yun — Software Engineer & Designer",
    description:
      "Portfolio of Nicholas Yun — software engineer and designer crafting thoughtful digital experiences.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nicholas Yun — Software Engineer & Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicholas Yun — Software Engineer & Designer",
    description:
      "Portfolio of Nicholas Yun — software engineer and designer crafting thoughtful digital experiences.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f0e8" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: "Software Engineer & Designer",
    url: siteConfig.url,
    sameAs: [
      siteConfig.githubUrl,
      siteConfig.linkedinUrl,
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
