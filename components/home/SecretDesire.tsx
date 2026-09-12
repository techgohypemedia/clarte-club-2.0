"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const desires = [
  {
    id: "precision",
    title: "Precision",
    text: "Tested against our own standard, every time.",
    imageDesktop: "/images/products/product1.png",
    imageMobile: "/images/products/product1.png"
  },
  {
    id: "longevity",
    title: "Longevity",
    text: "Built for daily use, not just good photos",
    imageDesktop: "/images/products/product6.png",
    imageMobile: "/images/products/product6.png"
  },
  {
    id: "consistency",
    title: "Consistency",
    text: "One standard. No exceptions.",
    imageDesktop: "/images/products/product4.png",
    imageMobile: "/images/products/product4.png"
  },
  {
    id: "exclusivity",
    title: "Exclusivity",
    text: "Small runs, by choice. Considered over crowded.",
    imageDesktop: "/images/products/product12.png",
    imageMobile: "/images/products/product12.png"
  }
];

export default function SecretDesire() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full bg-[#0F0F10] text-white py-20 sm:py-28 md:py-32 overflow-hidden border-b border-white/10">
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-12 z-10 flex flex-col items-center text-center">

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C9B07A]/40 bg-[#C9B07A]/10 text-[#C9B07A] text-[11px] font-bold uppercase tracking-[0.25em]">
          <span>The Core Pillars</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.8rem] font-heading font-extrabold uppercase leading-[1.08] tracking-tight mb-16 max-w-[900px]">
          Every piece, built to <span className="text-[#C9B07A] underline decoration-[#C9B07A]/30 underline-offset-8">the same standard.</span>
        </h2>

        {/* Expanding Cards Container */}
        <div className="flex flex-col md:flex-row w-full max-w-[1200px] h-[540px] md:h-[440px] gap-3 md:gap-4 select-none">
          {desires.map((desire, idx) => {
            const isActive = activeIndex === idx;
            return (
              <motion.div
                key={desire.id}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                initial={false}
                animate={{
                  flex: isActive ? 3.8 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 22,
                  mass: 0.8,
                }}
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900 border transition-colors duration-500 group will-change-[flex-grow]",
                  isActive
                    ? "border-[#C9B07A]/60 shadow-[0_30px_70px_rgba(0,0,0,0.85)]"
                    : "border-white/10 hover:border-white/30 shadow-md"
                )}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src={desire.imageDesktop}
                    alt={desire.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="hidden md:block object-cover object-top"
                  />
                  <Image
                    src={desire.imageMobile}
                    alt={desire.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="block md:hidden object-cover object-top"
                  />
                  {/* Dark Gradient Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700",
                      isActive
                        ? "bg-gradient-to-t from-black/90 via-black/45 to-black/15"
                        : "bg-black/50 group-hover:bg-black/40"
                    )}
                  />
                </div>

                {/* Collapsed State: Fast CSS Faded Vertical Title */}
                <div
                  className={cn(
                    "absolute inset-0 z-10 flex flex-row md:flex-col items-center justify-center md:justify-end p-6 md:pb-10 pointer-events-none transition-all duration-150 ease-out",
                    isActive ? "opacity-0 scale-95" : "opacity-100 scale-100 delay-150"
                  )}
                >
                  <h4
                    className="text-base sm:text-lg font-heading font-extrabold uppercase text-white/90 tracking-widest whitespace-nowrap hidden md:block"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
                  >
                    {desire.title}
                  </h4>
                  <h4 className="text-base font-heading font-extrabold uppercase text-white/90 tracking-widest md:hidden">
                    {desire.title}
                  </h4>
                </div>

                {/* Expanded State: Pure CSS Faded Content */}
                <div
                  className={cn(
                    "absolute inset-0 z-10 flex flex-col items-start justify-end p-8 md:p-10 text-left pointer-events-none transition-all duration-500 ease-out",
                    isActive ? "opacity-100 translate-y-0 delay-100" : "opacity-0 translate-y-4"
                  )}
                >
                  <div className="w-[320px] sm:w-[380px] md:w-[400px]">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold uppercase text-white tracking-wide mb-2.5 whitespace-nowrap">
                      {desire.title}
                    </h3>
                    <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed">
                      {desire.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Sub-text */}
        <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-[700px]">
          <p className="text-lg sm:text-xl font-heading uppercase font-semibold text-neutral-300 tracking-wide leading-snug">
            Clarté Club transforms daily eyewear into an architectural statement of quiet confidence.
          </p>
        </div>

      </div>
    </section>
  );
}
