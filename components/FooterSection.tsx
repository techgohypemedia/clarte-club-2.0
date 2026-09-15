"use client"

import Image from "next/image"
import Link from "next/link"

import { Footer3DCanvas } from "@/components/footer/Footer3DCanvas"

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




const clarteClubLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Easy Exchange", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ's", href: "/faq" },
] as const

export function FooterSection() {
  return (
    <footer className="relative overflow-hidden font-marquee bg-[#0F0F10] text-white pt-10 sm:pt-12 pb-8 border-t border-[#8A8072]/20">
      <div className="w-full px-6 md:px-12 2xl:px-24 mx-auto relative z-10">
        <div className="grid grid-cols-2 gap-8 mb-8 relative z-10 md:grid-cols-12">

          {/* Column 1: Brand Logo, Desc & Social */}
          <div className="col-span-2 md:col-span-3">
            <Link href="/" className="block w-32 sm:w-36 md:w-44 -ml-4 -mt-8 -mb-8 sm:-mt-10 sm:-mb-10 hover:opacity-80 transition-opacity">
              <Image
                src="/cartellogo.png"
                alt="Clarté Club"
                width={400}
                height={400}
                className="w-full h-auto object-contain pointer-events-none brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-[#E2DDD3] leading-relaxed pr-4 font-light mt-0">
              Clarté Club is the destination for premium eyewear and future fashion.
              Elevating your lifestyle through vision.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-full border border-[#E2DDD3]/40 text-white hover:border-[#C9B07A] hover:text-[#C9B07A] transition-all"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href="https://instagram.com/clarteclub.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full border border-[#E2DDD3]/40 text-white hover:border-[#C9B07A] hover:text-[#C9B07A] transition-all"
              >
                <InstagramIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Column 2: CLARTÉ CLUB */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-bold text-xs sm:text-sm uppercase mb-4 tracking-wider text-white">CLARTÉ CLUB</h4>
            <ul className="space-y-2.5 text-xs text-[#E2DDD3] tracking-wider">
              {clarteClubLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#C9B07A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: GET SUPPORT */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-bold text-xs sm:text-sm uppercase mb-4 tracking-wider text-white">GET SUPPORT</h4>

            <div className="space-y-3.5 text-xs">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#B8B0A2]">CUSTOMER CARE EMAIL</p>
                <p className="text-xs font-semibold text-white hover:text-[#C9B07A] transition-colors mt-0.5">
                  <a href="mailto:contact@clarte.club">contact@clarte.club</a>
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#B8B0A2]">WHATSAPP DIRECT</p>
                <p className="text-xs font-semibold text-white hover:text-[#C9B07A] transition-colors mt-0.5">
                  <a
                    href="https://wa.me/919898391273?text=Hi%20Clart%C3%A9%20Club%2C%20I%20have%20an%20inquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Whatsapp Support
                  </a>
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#B8B0A2]">RETURNS &amp; EXCHANGES</p>
                <p className="text-xs font-semibold text-[#C9B07A] hover:text-white transition-colors mt-0.5">
                  <a
                    href="https://returns.logisy.tech/returns?encipherencode=gAAAAABqqO4dZ_aHEgfDSgFjtzNTqFToTfjUov-gutfGRmGEnxV9zNALDW_8I3vsRe-FCSRd_e17ZDiNVjxpA4KgBtoGryMgUQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 group"
                  >
                    <span>Raise Request (RMS Portal)</span>
                    <span className="text-[10px] transition-transform group-hover:translate-x-0.5">&rarr;</span>
                  </a>
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#B8B0A2]">SUPPORT HOURS</p>
                <p className="text-xs font-semibold text-white mt-0.5">
                  11 am – 8 pm IST
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: 3D Shopping Bag Model */}
          <div className="col-span-2 md:col-span-3 flex flex-col items-center md:items-start justify-center">
            <Footer3DCanvas className="w-full h-[200px] sm:h-[220px]" />
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-[#8A8072]/20 flex flex-row justify-between items-center relative z-10 w-full">
          <p className="text-[8px] sm:text-[9px] text-[#B8B0A2] uppercase tracking-widest font-medium">
            &copy; {new Date().getFullYear()} CLARTÉ CLUB. ALL RIGHTS RESERVED.
          </p>
          <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#B8B0A2]">
            PRESENCE OVER NOISE
          </div>
        </div>

      </div>

      {/* Faded Background Text Watermark */}
      <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none z-0 select-none overflow-hidden leading-none">
        <span className="block text-[6vw] md:text-[5vw] lg:text-5xl xl:text-6xl font-bold uppercase tracking-[0.45em] text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent translate-x-[3.5vw]">
          CLARTÉ CLUB
        </span>
      </div>
    </footer>
  )
}
