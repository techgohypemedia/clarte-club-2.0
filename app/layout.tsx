import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Montserrat, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import { CinematicPreloader } from "@/components/CinematicPreloader";

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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CinematicPreloader />
        <SmoothScroll />
        <div className="relative flex flex-1 flex-col overflow-x-clip">
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            {children}
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
