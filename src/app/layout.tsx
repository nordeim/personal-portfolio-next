import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nicholas Yun — The Engineered Soul",
    template: "%s | Nicholas Yun",
  },
  description:
    "Personal portfolio of Nicholas Yun — full-stack developer, designer, and engineer. Crafting digital experiences with precision and intention.",
  keywords: [
    "Nicholas Yun",
    "portfolio",
    "full-stack developer",
    "frontend architect",
    "web developer",
    "designer",
  ],
  authors: [{ name: "Nicholas Yun" }],
  creator: "Nicholas Yun",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Engineered Soul",
    title: "Nicholas Yun — The Engineered Soul",
    description:
      "Personal portfolio of Nicholas Yun — full-stack developer, designer, and engineer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicholas Yun — The Engineered Soul",
    description:
      "Personal portfolio of Nicholas Yun — full-stack developer, designer, and engineer.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC: apply theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'night') {
                    document.documentElement.setAttribute('data-theme', 'night');
                    document.body && document.body.setAttribute('data-theme', 'night');
                  } else if (!theme) {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                      document.documentElement.setAttribute('data-theme', 'night');
                      document.body && document.body.setAttribute('data-theme', 'night');
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Skip-to-content link — WCAG AAA keyboard navigation requirement */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}