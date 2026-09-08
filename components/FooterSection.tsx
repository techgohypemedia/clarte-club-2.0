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

function WhatsAppIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.886 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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
    <footer className="relative overflow-hidden font-marquee bg-[#0F0F10] text-[#F6F2EA] pt-10 sm:pt-12 pb-8 border-t border-[#8A8072]/20">
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
                className="flex size-8 items-center justify-center rounded-full border border-[#E2DDD3]/40 text-[#F6F2EA] hover:border-[#C9B07A] hover:text-[#C9B07A] transition-all"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href="https://instagram.com/clarteclub.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full border border-[#E2DDD3]/40 text-[#F6F2EA] hover:border-[#C9B07A] hover:text-[#C9B07A] transition-all"
              >
                <InstagramIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Column 2: CLARTÉ CLUB */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-bold text-xs sm:text-sm uppercase mb-4 tracking-wider text-[#F6F2EA]">CLARTÉ CLUB</h4>
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
            <h4 className="font-bold text-xs sm:text-sm uppercase mb-4 tracking-wider text-[#F6F2EA]">GET SUPPORT</h4>

            <div className="space-y-3.5 text-xs">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#B8B0A2]">CUSTOMER CARE EMAIL</p>
                <p className="text-xs font-semibold text-[#F6F2EA] hover:text-[#C9B07A] transition-colors mt-0.5">
                  <a href="mailto:contact@clarte.club">contact@clarte.club</a>
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#B8B0A2]">WHATSAPP DIRECT</p>
                <a
                  href="https://wa.me/919371083295?text=Hi%20Clart%C3%A9%20Club%2C%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#25D366] transition-all hover:bg-[#25D366] hover:text-black hover:border-[#25D366] cursor-pointer"
                >
                  <WhatsAppIcon className="size-3.5 fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#B8B0A2]">SUPPORT HOURS</p>
                <p className="text-xs font-semibold text-[#F6F2EA] mt-0.5">
                  Mon–Sat, 10am–7pm IST
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
        <span className="block text-[6vw] md:text-[5vw] lg:text-5xl xl:text-6xl font-bold uppercase tracking-[0.45em] text-transparent bg-clip-text bg-gradient-to-b from-[#F6F2EA]/12 to-transparent translate-x-[3.5vw]">
          CLARTÉ CLUB
        </span>
      </div>
    </footer>
  )
}
