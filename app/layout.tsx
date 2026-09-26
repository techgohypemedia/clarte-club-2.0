import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./onecheckout.css";
import { cn } from "@/lib/utils";
import { Montserrat, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import { CinematicPreloader } from "@/components/CinematicPreloader";
import { OneCheckoutModal } from "@/components/onecheckout/OneCheckoutModal";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

const oneCheckoutConfig = {
  apiKey: process.env.ONECHECKOUT_API_KEY ?? "",
  apiHost: process.env.ONECHECKOUT_API_HOST ?? "",
  checkoutHost: process.env.ONECHECKOUT_CHECKOUT_HOST ?? "",
};

const serializedOneCheckoutConfig = JSON.stringify(oneCheckoutConfig).replace(
  /</g,
  "\\u003c"
);

function getDnsPrefetchHref(value: string) {
  try {
    return `//${new URL(value).host}`;
  } catch {
    return "";
  }
}

const oneCheckoutApiDns = getDnsPrefetchHref(oneCheckoutConfig.apiHost);
const oneCheckoutPayDns = getDnsPrefetchHref(oneCheckoutConfig.checkoutHost);

export const metadata: Metadata = {
  title: "Clarte Club",
  description: "Luxury eyewear and future fashion. Elevating your lifestyle through vision.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        montserrat.variable,
        playfair.variable,
        "font-sans"
      )}
    >
      <head>
        {oneCheckoutPayDns ? <link rel="dns-prefetch" href={oneCheckoutPayDns} /> : null}
        {oneCheckoutApiDns ? <link rel="dns-prefetch" href={oneCheckoutApiDns} /> : null}
        <link rel="dns-prefetch" href="//cdn.1checkout.ai" />
        {oneCheckoutConfig.checkoutHost ? (
          <link rel="preconnect" href={oneCheckoutConfig.checkoutHost} crossOrigin="anonymous" />
        ) : null}
        {oneCheckoutConfig.apiHost ? (
          <link rel="preconnect" href={oneCheckoutConfig.apiHost} crossOrigin="anonymous" />
        ) : null}
        <link rel="preconnect" href="https://cdn.1checkout.ai" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script id="onecheckout-config" strategy="beforeInteractive">
          {`window.__ONE_CHECKOUT_CONFIG__=${serializedOneCheckoutConfig};`}
        </Script>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CR3DZEF9H8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-CR3DZEF9H8');
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2231083210798712');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2231083210798712&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
        <CinematicPreloader />
        <SmoothScroll />
        <div className="relative flex flex-1 flex-col overflow-x-clip">
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            {children}
          </div>
          <SiteFooter />
        </div>
        <OneCheckoutModal />
        <Script src="/onecheckout/1checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
