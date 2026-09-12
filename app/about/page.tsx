// Clarté Club - Our Story (Smokey White Architectural Layout)
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { TextReveal } from "@/components/ui/text-reveal"
import SecretDesire from "@/components/home/SecretDesire"
import StandardsAccordion from "@/components/about/StandardsAccordion"
import FounderNote from "@/components/about/FounderNote"

export const metadata: Metadata = {
  title: "Our Story | Clarté Club",
  description: "The story behind Clarté Club: built with a clear point of view, obsessive craftsmanship, and quiet distinction.",
}

export default function AboutPage() {
  const highlights = [
    {
      title: "One Honest Price",
      desc: "What you see is the true price, reflecting pure craftsmanship without artificial markups or fake promotional sales. If a price moves, it's a genuine operational change."
    },
    {
      title: "Made to Last & Endure",
      desc: "Built from cured bio-acetate and custom hardware designed for rigorous daily use, not disposable photo props."
    },
    {
      title: "Zero Restocks Policy",
      desc: "When a batch release is complete, we archive the design. We focus on engineering the next evolution rather than endlessly duplicating past drops."
    },
    {
      title: "Direct Commitment & Guarantee",
      desc: "If anything feels remiss with your frame or fit, contact our atelier directly. We repair or replace it without friction or convoluted policy lines."
    }
  ]

  return (
    <main className="flex-1 bg-white text-[#0F0F10] font-sans min-h-screen">
      
      {/* 1. OUR STORY - Header */}
      <section className="w-full px-5 sm:px-12 md:px-20 pt-8 sm:pt-16 pb-8 sm:pb-12 border-b border-black/10 text-center sm:text-left">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between items-center sm:items-start gap-3 sm:gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold tracking-[0.3em] text-neutral-500">
                Our Story
              </span>
              <h1 className="font-heading text-3xl sm:text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em] text-[#0F0F10] mt-1.5 sm:mt-2">
                OUR STORY
              </h1>
            </div>
            <p className="text-[11px] sm:text-[14px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-500 pb-1 sm:pb-2">
              BUILT WITH A CLEAR POINT OF VIEW
            </p>
          </div>
        </div>
      </section>

      {/* 1.1 Story Visual & Narrative Body */}
      <section className="w-full px-5 sm:px-12 md:px-20 py-8 sm:py-16 border-b border-black/10">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          
          {/* Left Panel: Architectural Studio Visual */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3 text-left">
            <div className="relative aspect-[4/4.5] w-full bg-[#efefef] overflow-hidden border border-black/10 shadow-sm">
              <Image
                src="/images/hero-left.png"
                alt="Clarté Club Eyewear Studio"
                fill
                priority
                className="object-cover filter contrast-[1.03]"
              />
            </div>
            <p className="text-[10px] sm:text-[11px] leading-relaxed text-neutral-500 font-light tracking-wide italic text-left">
              Presence over noise. That is the foundational philosophy behind Clarté Club.
            </p>
          </div>

          {/* Right Panel: Genesis Story Narrative */}
          <div className="lg:col-span-7 bg-[#f4f4f4] border border-black/10 p-5 sm:p-8 md:p-12 flex flex-col items-start justify-center space-y-5 sm:space-y-6 text-left">
            <p className="font-heading text-base sm:text-xl md:text-2xl font-medium leading-snug sm:leading-relaxed text-[#0F0F10] text-left">
              <span className="inline-flex items-center justify-start gap-1.5 font-bold text-[#0F0F10] mr-1.5">
                <Image
                  src="/logo.svg"
                  alt="Clarté Club Emblem"
                  width={24}
                  height={15}
                  className="h-3.5 sm:h-5 w-auto object-contain opacity-90 inline-block align-middle -mt-0.5"
                />
                <span>Clarté Club</span>
              </span>
              started with a simple idea. The things we choose to wear every day should feel distinctive, useful and worth keeping.
            </p>
            
            <p className="text-[13px] sm:text-[14px] leading-relaxed sm:leading-[1.85] text-neutral-600 font-light text-left">
              We started by asking a simple question. Why does so much of modern fashion rely on louder logos, faster trends and more products every season? We wanted to take a different path.
            </p>

            <p className="text-[13px] sm:text-[14px] leading-relaxed sm:leading-[1.85] text-neutral-600 font-light text-left">
              We are starting with eyewear because it is one of the most personal things you wear. It becomes part of how people see you. It should feel right every time you put it on.
            </p>

            <p className="text-[13px] sm:text-[14px] leading-relaxed sm:leading-[1.85] text-neutral-600 font-light text-left">
              But Clarté Club was never meant to stop there. Over time, we will introduce more pieces that belong to the same world. Different categories, guided by the same approach and the same standard.
            </p>

            <div className="w-full pt-5 sm:pt-6 border-t border-black/10 grid grid-cols-3 gap-3 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-neutral-500 text-center">
              <div>
                <span className="block text-neutral-400 font-bold text-[8px] sm:text-[9px] mb-0.5 sm:mb-1">Always</span>
                <span className="text-[#0F0F10]">Thoughtfully made</span>
              </div>
              <div>
                <span className="block text-neutral-400 font-bold text-[8px] sm:text-[9px] mb-0.5 sm:mb-1">Starting with</span>
                <span className="text-[#0F0F10]">Eyewear</span>
              </div>
              <div>
                <span className="block text-neutral-400 font-bold text-[8px] sm:text-[9px] mb-0.5 sm:mb-1">Building toward</span>
                <span className="text-[#0F0F10]">A lifestyle brand</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FOUNDER'S NOTE SECTION */}
      <FounderNote />

      {/* Ticker Marquee Bar */}
      <section className="relative w-full overflow-hidden bg-[#f4f4f4] text-[#0F0F10] py-3 sm:py-4 border-b border-black/10">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marqueeLight {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-light {
            display: flex;
            width: max-content;
            animation: marqueeLight 25s linear infinite;
          }
        `}} />
        
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-light flex gap-6 sm:gap-8 text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#0F0F10]/40 whitespace-nowrap select-none">
            {Array(4).fill([
              "DISTINCTIVE DESIGN",
              "PRECISION-POLISHED ACETATE",
              "LIMITED BATCH DROPS",
              "THE CLARTÉ GUARANTEE",
              "QUIET DISTINCTION"
            ]).flat().map((text, idx) => (
              <span key={idx} className="flex items-center gap-4 sm:gap-6">
                <span>{text}</span>
                <span className="opacity-40">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll-Driven Text Reveal Statement */}
      <section className="w-full bg-white border-b border-black/10">
        <TextReveal>
          WE'RE COMMITTED TO **EVERYTHING WE MAKE**, CHOSEN WITH CARE, **CHECKED BEFORE IT EVER REACHES YOU**. THAT'S WHAT WE ACTUALLY **STAND ON**. NOT A CLAIM, JUST THE **WORK BEHIND IT**.
        </TextReveal>
      </section>

      {/* 3. OUR APPROACH Section */}
      <section className="w-full px-5 sm:px-12 md:px-20 py-12 sm:py-20 bg-white border-b border-black/10">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between items-center sm:items-start gap-3 sm:gap-4 border-b border-black/10 pb-5 sm:pb-6 text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold tracking-[0.3em] text-neutral-500">
                Our Approach
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#0F0F10] mt-1.5 sm:mt-2">
                OUR APPROACH
              </h2>
            </div>
            <p className="text-[11px] sm:text-[14px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-500 pb-1">
              FEWER PIECES, CHOSEN WELL
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left Frame Details Grid */}
            <div className="lg:col-span-5 flex items-center gap-3">
              {[
                { img: "/images/products/product6.png", alt: "Frame detail 1" },
                { img: "/images/products/product7.png", alt: "Frame detail 2" },
                { img: "/images/products/product8.png", alt: "Frame detail 3" }
              ].map((item, idx) => (
                <div key={idx} className="relative aspect-square flex-1 bg-white border border-black/10 overflow-hidden group">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Right Approach Narrative */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left flex flex-col items-start">
              <h3 className="font-heading text-lg sm:text-2xl md:text-3xl font-semibold uppercase text-[#0F0F10] leading-snug sm:leading-tight text-left">
                We refuse to flood the market with disposable releases.
              </h3>
              <p className="text-[13px] sm:text-[14px] leading-relaxed sm:leading-[1.85] text-neutral-600 font-light max-w-xl text-left">
                Every release starts with a distinct architectural concept and is honed over months of wear testing. We evaluate frame balance, material weight, hardware tension, and tactile finish.
              </p>
              <div className="pt-3 sm:pt-4 border-t border-black/10 inline-block">
                <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-[#0F0F10] text-left">
                  The category may evolve. The approach will stay unyielding.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Core Values / Secret Desire Section */}
      <SecretDesire />

      {/* 4. THE DIRECTION Section */}
      <section className="relative w-full px-5 sm:px-12 md:px-20 py-12 sm:py-20 bg-white overflow-hidden border-b border-black/10">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between items-center sm:items-start gap-3 sm:gap-4 border-b border-black/10 pb-5 sm:pb-6 text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] sm:text-[11px] uppercase font-semibold tracking-[0.3em] text-neutral-500">
                The Direction
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#0F0F10] mt-1.5 sm:mt-2">
                THE DIRECTION
              </h2>
            </div>
            <p className="text-[11px] sm:text-[14px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-500 pb-1">
              THIS IS ONLY THE BEGINNING
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left Direction Narrative Block */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left flex flex-col items-start">
              <h3 className="font-heading text-lg sm:text-2xl md:text-4xl font-semibold uppercase text-[#0F0F10] leading-snug sm:leading-tight text-left">
                Clarté Club is built slowly, intentionally, and without compromise.
              </h3>
              <p className="text-[13px] sm:text-[14px] leading-relaxed sm:leading-[1.85] text-neutral-600 font-light text-left">
                Starting with eyewear as our anchor, we are expanding into curated leather goods, accessories, and subtle daily objects that embody quiet distinction.
              </p>

              <div className="pt-3 sm:pt-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#0F0F10] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] hover:bg-[#C9B07A] hover:text-[#0F0F10] transition-all duration-300 shadow-md group"
                >
                  <span>Explore the latest collection</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            {/* Right Interactive Card Visual */}
            <div className="lg:col-span-6 flex justify-center items-center py-4 sm:py-6">
              <div className="group/card relative w-full sm:w-[500px] aspect-[16/10] cursor-pointer transform origin-center -rotate-3 hover:rotate-0 hover:scale-[1.02] shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.2)] bg-[#FFFFFF] border border-black/10 hover:border-black/30 p-4 sm:p-6 transition-all duration-700 ease-out">
                <div className="relative size-full overflow-hidden bg-white border border-black/10 flex items-center justify-center">
                  <Image
                    src="/images/products/product5-white.png"
                    alt="Clarté Club frame"
                    fill
                    className="object-contain p-4 filter contrast-[1.05] transition-transform duration-700 ease-out group-hover/card:scale-105"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. STANDARDS & PROMISES */}
      <section className="w-full px-5 sm:px-12 md:px-20 py-16 sm:py-24 bg-white border-b border-black/10">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
          
          <div className="lg:col-span-4 space-y-3 sm:space-y-4 text-left flex flex-col items-start">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-neutral-500 font-semibold">Standards</span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-tight text-[#0F0F10] leading-tight text-left">
              WHAT WE STAND BEHIND
            </h2>
            <div className="h-[2px] w-12 bg-[#0F0F10] my-3 sm:my-4" />
            <p className="text-[13px] sm:text-[14px] leading-relaxed sm:leading-[1.8] text-neutral-600 font-light text-left">
              We design, inspect, and guarantee every piece that leaves our studio. These are our foundational promises to everyone who supports our vision.
            </p>
          </div>

          <div className="lg:col-span-8">
            <StandardsAccordion items={highlights} />
          </div>

        </div>
      </section>

      {/* Closing Brand Statement Banner */}
      <section className="w-full px-5 sm:px-12 md:px-20 py-14 sm:py-20 bg-[#f4f4f4] text-center border-t border-black/10">
        <div className="mx-auto max-w-4xl space-y-3 sm:space-y-4">
          <p className="font-heading text-lg sm:text-2xl md:text-3xl font-medium uppercase tracking-wide text-[#0F0F10]">
            The kind of thing that doesn't ask for attention, and quietly gets it anyway.
          </p>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#C9B07A] font-semibold">
            Clarté Club — Built for Life
          </p>
        </div>
      </section>

    </main>
  )
}
