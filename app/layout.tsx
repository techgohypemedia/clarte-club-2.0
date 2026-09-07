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
  description: "Luxury retail navigation concept for Clarte Club.",
  icons: {
    icon: "/logo.svg",
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
