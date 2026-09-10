// Clarté Club - Contact Us (Editorial Luxury Layout)
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Clarté Club | Say Hello",
  description: "Get in touch with Clarté Club. Email, WhatsApp, or Instagram — a real person replies, usually the same day.",
}

function FacebookIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
    </svg>
  )
}

function InstagramIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export default function ContactPage() {
  return (
    <main className="flex-1 bg-[#fcfbfa] text-[#0F0F10] font-sans min-h-screen pb-24 relative overflow-hidden">
      
      {/* Top Main Section (Natural height on Mobile, Full Viewport Height on Desktop) */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 sm:min-h-[calc(100vh-var(--header-stack-height))] flex flex-col justify-center pt-10 sm:pt-16 pb-8 sm:pb-16">
        {/* Hero Container */}
        <div className="space-y-4 sm:space-y-8 w-full">
          
          {/* Responsive Side-by-Side Flex Layout (Social Icons + Headline Block) */}
          <div className="flex flex-row items-center gap-4 sm:gap-8 lg:gap-12 w-full">
            
            {/* Left Vertical Social Bar */}
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 shrink-0 my-auto">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-7 sm:size-9 items-center justify-center rounded-full border border-black/20 text-[#0F0F10] hover:border-[#C9B07A] hover:text-[#C9B07A] hover:bg-black/5 transition-all"
              >
                <FacebookIcon className="size-3.5 sm:size-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex size-7 sm:size-9 items-center justify-center rounded-full border border-black/20 text-[#0F0F10] hover:border-[#C9B07A] hover:text-[#C9B07A] hover:bg-black/5 transition-all"
              >
                <YoutubeIcon className="size-3.5 sm:size-4" />
              </a>
              <a
                href="https://instagram.com/clarteclub.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-7 sm:size-9 items-center justify-center rounded-full border border-black/20 text-[#0F0F10] hover:border-[#C9B07A] hover:text-[#C9B07A] hover:bg-black/5 transition-all"
              >
                <InstagramIcon className="size-3.5 sm:size-4" />
              </a>
            </div>

            {/* Hero Editorial Heading & Integrated Brand Logo */}
            <div className="flex-1 min-w-0 space-y-2 sm:space-y-4 select-none">
              
              {/* High-Fashion Luxury Serif Headline */}
              <div className="space-y-0 text-[#0F0F10]">
                <h1 className="font-serif text-3xl min-[380px]:text-4xl sm:text-7xl md:text-8xl lg:text-[96px] font-normal uppercase tracking-[0.02em] leading-[0.92]">
                  LET&apos;S WORK
                </h1>
                <h1 className="font-serif text-3xl min-[380px]:text-4xl sm:text-7xl md:text-8xl lg:text-[96px] font-normal uppercase tracking-[0.02em] leading-[0.92] pl-12 min-[380px]:pl-16 sm:pl-24 md:pl-36">
                  TOGETHER
                </h1>
              </div>

              {/* Integrated Gold CC Logo & Brand Name (Right-aligned to match heading text right edge) */}
              <div className="pt-1 sm:pt-2 flex justify-end pr-1 sm:pr-12 md:pr-20 text-[#C9B07A]">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 sm:gap-3 text-[#C9B07A] hover:text-[#0F0F10] transition-colors duration-300 group"
                >
                  <svg
                    viewBox="249 4 411 245"
                    className="h-5 min-[380px]:h-6 sm:h-9 md:h-11 w-auto fill-[#C9B07A] group-hover:fill-[#0F0F10] transition-colors duration-300"
                  >
                    <path
                      d="M 477.29 112.00 L 476.00 112.68 L 455.00 112.77 L 453.00 112.51 L 452.52 112.00 L 452.50 109.00 L 453.63 103.00 L 457.51 89.00 L 460.61 81.00 L 465.46 71.00 L 469.69 64.00 L 477.69 53.00 L 492.00 38.56 L 501.00 31.74 L 508.00 27.43 L 519.00 21.58 L 527.00 18.54 L 536.00 15.67 L 545.00 13.61 L 552.00 12.65 L 564.00 11.84 L 581.00 12.75 L 587.00 13.59 L 599.00 16.50 L 612.00 21.47 L 618.00 24.64 L 629.00 31.61 L 634.00 35.47 L 642.16 43.00 L 650.91 53.00 L 650.85 54.00 L 650.04 55.00 L 633.00 70.52 L 632.00 70.41 L 631.00 69.47 L 625.00 62.36 L 619.70 57.00 L 610.90 50.00 L 600.77 44.00 L 587.76 39.00 L 579.00 36.95 L 571.00 35.97 L 559.00 35.75 L 549.00 36.95 L 537.10 40.00 L 527.27 44.00 L 518.10 49.00 L 508.50 56.00 L 500.00 64.20 L 493.00 73.02 L 485.92 85.00 L 480.00 100.48 L 477.29 112.00 Z M 378.85 241.00 L 368.00 241.46 L 355.00 240.46 L 344.00 238.62 L 333.00 235.42 L 325.00 232.47 L 315.00 227.43 L 307.00 222.52 L 296.00 214.29 L 288.49 207.00 L 281.59 199.00 L 274.51 189.00 L 269.46 180.00 L 264.42 169.00 L 261.49 160.00 L 258.53 147.00 L 257.51 138.00 L 257.16 126.00 L 257.55 117.00 L 258.51 108.00 L 260.59 98.00 L 263.83 88.00 L 268.71 76.00 L 275.65 64.00 L 280.49 57.00 L 288.34 48.00 L 295.00 41.47 L 305.00 33.57 L 316.00 26.69 L 329.00 20.50 L 341.00 16.49 L 353.00 13.72 L 363.00 12.60 L 380.00 12.45 L 390.00 13.59 L 403.00 16.54 L 414.00 20.43 L 428.00 27.43 L 436.00 32.63 L 442.00 37.38 L 449.00 43.89 L 455.58 51.00 L 456.70 53.00 L 456.00 54.34 L 442.31 68.00 L 439.00 70.54 L 438.00 69.92 L 430.00 60.95 L 420.97 53.00 L 412.00 46.93 L 399.52 41.00 L 388.00 37.91 L 374.00 36.18 L 368.00 36.13 L 360.00 36.77 L 352.36 38.00 L 344.67 40.00 L 334.27 44.00 L 324.84 49.00 L 315.00 55.97 L 307.00 63.45 L 300.00 71.80 L 294.00 81.12 L 289.00 91.78 L 285.00 104.18 L 282.79 118.00 L 282.50 129.00 L 282.93 137.00 L 283.95 144.00 L 286.00 152.68 L 289.00 161.32 L 291.92 168.00 L 301.00 182.55 L 309.16 192.00 L 316.00 198.00 L 324.03 204.00 L 335.14 210.00 L 342.03 213.00 L 348.57 215.00 L 358.00 217.03 L 367.00 217.79 L 375.00 217.88 L 383.00 217.18 L 390.00 216.00 L 397.00 214.10 L 404.64 211.00 L 410.56 208.00 L 418.00 203.14 L 426.00 196.55 L 433.00 189.31 L 438.72 182.00 L 440.00 181.49 L 457.31 199.00 L 457.23 200.00 L 454.00 203.96 L 444.00 214.05 L 435.00 221.40 L 425.00 227.59 L 410.00 234.55 L 401.00 237.47 L 387.00 240.37 L 378.85 241.00 Z M 568.89 241.00 L 560.00 241.13 L 548.00 240.35 L 538.00 238.53 L 527.00 235.39 L 519.00 232.50 L 509.00 227.56 L 499.00 221.49 L 490.00 214.75 L 482.96 208.00 L 475.83 200.00 L 469.55 191.00 L 463.61 181.00 L 457.61 167.00 L 454.44 157.00 L 452.51 147.00 L 451.00 135.18 L 450.00 134.87 L 389.00 134.88 L 387.65 134.00 L 387.42 133.00 L 387.42 125.00 L 388.00 123.11 L 389.00 122.60 L 470.00 122.48 L 499.00 122.52 L 503.00 122.59 L 503.93 123.00 L 504.54 124.00 L 504.66 131.00 L 504.66 133.00 L 504.00 134.48 L 503.00 134.87 L 478.00 134.89 L 477.00 135.57 L 477.90 145.00 L 478.99 150.00 L 484.00 165.15 L 487.94 173.00 L 494.00 182.15 L 501.00 190.60 L 506.64 196.00 L 516.00 203.10 L 524.15 208.00 L 531.00 211.22 L 542.70 215.00 L 555.00 217.22 L 572.00 217.28 L 580.70 216.00 L 594.00 212.01 L 604.24 207.00 L 614.47 200.00 L 623.00 192.15 L 632.30 181.00 L 634.00 180.02 L 636.00 181.35 L 651.57 196.00 L 652.00 197.00 L 651.75 198.00 L 649.40 201.00 L 637.00 213.74 L 627.00 221.64 L 617.00 227.67 L 602.00 234.45 L 592.00 237.60 L 577.00 240.41 L 568.89 241.00 Z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="font-serif italic text-lg min-[380px]:text-xl sm:text-3xl md:text-4xl tracking-wide text-[#C9B07A] group-hover:text-[#0F0F10] transition-colors duration-300">
                    Clarté Club
                  </span>
                </Link>
              </div>
            </div>

          </div>

          {/* Narrative Subtitle (Full Width across bottom matching reference design) */}
          <div className="pt-2 sm:pt-4">
            <p className="w-full text-xs sm:text-base leading-relaxed text-neutral-600 font-light pl-0 sm:pl-16 md:pl-28">
              Say hello. A real person reads these, usually one of us, and we try to reply the same day.<br className="hidden sm:inline" /> Longer if it&apos;s the weekend.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom Editorial Grid */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 md:px-20 pt-12 border-t border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          
          {/* Column 1: General Information */}
          <div className="space-y-8">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-[#0F0F10]">
              General
            </h2>

            <div className="space-y-6 text-xs sm:text-sm font-light">
              <div className="grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Information
                </span>
                <div className="col-span-8 space-y-1.5 font-mono">
                  <p className="text-[#0F0F10] hover:text-[#C9B07A] transition-colors">
                    <a href="mailto:contact@clarte.club">contact@clarte.club</a>
                  </p>
                  <p className="text-[#0F0F10]">
                    <a
                      href="https://wa.me/919898391273?text=Hi%20Clart%C3%A9%20Club%2C%20I%20have%20an%20inquiry"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0F0F10] hover:text-[#25D366] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>+91 98983 91273 (WhatsApp) →</span>
                    </a>
                  </p>
                  <p className="text-[#0F0F10] hover:text-[#C9B07A] transition-colors font-sans">
                    <a href="https://instagram.com/clarteclub.official" target="_blank" rel="noopener noreferrer">@clarteclub.official</a>
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-black/10 grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Operating Hours
                </span>
                <div className="col-span-8 text-[#0F0F10] font-mono">
                  <p>11 am – 8 pm IST</p>
                  <p className="text-[11px] text-neutral-500 font-sans mt-1">
                    Sunday &amp; Public Holidays: Next business day
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Address & Compliance */}
          <div className="space-y-8">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-[#0F0F10]">
              Address &amp; Corporate
            </h2>

            <div className="space-y-6 text-xs sm:text-sm font-light">
              <div className="grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Entity
                </span>
                <div className="col-span-8 space-y-1">
                  <p className="text-[#0F0F10] font-semibold">Clarté Club</p>
                  <p className="text-[#C9B07A] font-mono underline">
                    <a href="mailto:contact@clarte.club">Grievance: contact@clarte.club</a>
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-black/10 grid grid-cols-12 items-baseline gap-4">
                <span className="col-span-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Registered Office
                </span>
                <div className="col-span-8 text-[#0F0F10] font-mono leading-relaxed">
                  <p>J9 Highstreet, Vesu, Surat - 395007</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}
