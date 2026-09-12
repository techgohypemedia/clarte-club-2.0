"use client"

import Image from "next/image"

export default function FounderNote() {
  return (
    <section className="w-full px-5 sm:px-12 md:px-20 py-12 sm:py-24 bg-white border-b border-black/10">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-black/10 pb-5 sm:pb-6 mb-8 sm:mb-12 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[10px] sm:text-[11px] uppercase font-semibold tracking-[0.3em] text-neutral-500">
              A Note From Us
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#0F0F10] mt-1.5 sm:mt-2">
              BEHIND CLARTÉ CLUB
            </h2>
          </div>
          <p className="text-[11px] sm:text-[14px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-500 pb-1">
            AN ANTIDOTE TO NOISE
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column: Visual Studio */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full bg-white overflow-hidden border border-black/10 shadow-sm">
              <Image
                src="/images/hero-right.png"
                alt="Clarté Club Studio"
                fill
                className="object-cover filter grayscale contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6 text-white text-left">
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#C9B07A] mb-0.5 sm:mb-1">
                  Design Studio & Atelier
                </p>
                <p className="font-heading text-base sm:text-lg font-bold uppercase tracking-wide">
                  Clarté Club
                </p>
                <p className="text-[10px] sm:text-[11px] opacity-80 uppercase tracking-widest">
                  Atelier & Studio
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Letter */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 bg-[#f4f4f4] border border-black/10 p-5 sm:p-8 md:p-12 text-left flex flex-col items-start justify-center">
            
            <div className="inline-block px-3 py-1 bg-[#e0e0e0] text-[#0F0F10] text-[10px] uppercase font-bold tracking-[0.25em]">
              A Note From Us
            </div>

            <h3 className="font-heading text-base sm:text-xl md:text-2xl font-medium uppercase text-[#0F0F10] leading-snug sm:leading-relaxed text-left tracking-wide">
              "Clarté Club began with a simple belief. The things we choose to live with should feel considered, useful and worth keeping."
            </h3>

            <div className="space-y-4 text-[14px] sm:text-[15px] leading-relaxed sm:leading-[1.8] text-neutral-800 font-normal text-left">
              <p>
                We didn't set out to build another trend-driven brand. We set out to build something we would be proud to put our name behind.
              </p>
              <p>
                We're starting with eyewear, built the way we intend to build everything that follows.
              </p>
              <p>
                Thank you for being part of the journey from the very beginning.
              </p>
            </div>



          </div>

        </div>

      </div>
    </section>
  )
}
