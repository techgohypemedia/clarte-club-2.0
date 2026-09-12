"use client"

import Image from "next/image"
import { Layers, ShieldCheck, Sparkles, Gem } from "lucide-react"

export default function CraftsmanshipSection() {
  const pillars = [
    {
      icon: Layers,
      number: "01",
      title: "Japanese & Italian Acetate",
      desc: "Constructed from cured cellulose acetate derived from cotton and wood pulp. High density delivers richer depth of tone, structural stability, and a warm tactile feel."
    },
    {
      icon: ShieldCheck,
      number: "02",
      title: "Engineered Core Hardware",
      desc: "Fitted with custom 5-barrel and 7-barrel stainless steel hinges and wire core inserts. Engineered for smooth resistance and long-lasting alignment."
    },
    {
      icon: Sparkles,
      number: "03",
      title: "Precision Optical Lenses",
      desc: "Outfitted with scratch-resistant, anti-reflective optical lenses providing 100% UVA/UVB filtering and maximum clarity across all lighting environments."
    },
    {
      icon: Gem,
      number: "04",
      title: "Multi-Stage Precision Polish",
      desc: "Every frame undergoes a multi-stage tumbling process in teakwood chips followed by meticulous precision buffing for a silky glass finish."
    }
  ]

  return (
    <section className="w-full px-6 sm:px-12 md:px-20 py-20 bg-white border-b border-black/10">
      <div className="mx-auto max-w-7xl space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-6">
          <div>
            <span className="text-[11px] uppercase font-semibold tracking-[0.3em] text-[#C9B07A]">
              03 / Craftsmanship
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0F0F10] mt-2">
              MATERIAL STANDARDS
            </h2>
          </div>
          <p className="text-[12px] sm:text-[14px] font-semibold uppercase tracking-[0.25em] text-neutral-500 pb-1">
            BUILT TO OUTLAST TRENDS
          </p>
        </div>

        {/* 4 Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div
                key={idx}
                className="bg-white border border-black/10 p-8 flex flex-col justify-between space-y-6 hover:border-[#C9B07A] transition-all duration-300 group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#C9B07A]">
                      [{pillar.number}]
                    </span>
                    <div className="p-2.5 bg-white border border-black/10 text-[#0F0F10] group-hover:bg-[#0F0F10] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-bold uppercase text-[#0F0F10] tracking-wide mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-[13px] leading-[1.8] text-neutral-600 font-light">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/10 flex items-center justify-between text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                  <span>Standard</span>
                  <span className="text-[#C9B07A]">Inspected</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Visual Craftsmanship Highlight Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-black/10 p-8 sm:p-12 shadow-xs">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9B07A]">
              THE ANATOMY OF A CLARTÉ FRAME
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-[#0F0F10]">
              ZERO COMPROMISE ON WEIGHT & BALANCE
            </h3>
            <p className="text-[13.5px] leading-relaxed text-neutral-600 font-light">
              A frame shouldn't slide down your nose or pinch behind your ears. We calculate weight distribution down to the fraction of a gram, pairing custom nose pads with sculptured temple tips for an effortlessly balanced fit.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] bg-white border border-black/10 overflow-hidden">
              <Image
                src="/images/products/product1.png"
                alt="Frame hinge detail"
                fill
                className="object-cover filter contrast-[1.05]"
              />
            </div>
            <div className="relative aspect-[4/3] bg-white border border-black/10 overflow-hidden">
              <Image
                src="/images/products/product4.png"
                alt="Acetate polish detail"
                fill
                className="object-cover filter contrast-[1.05]"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
