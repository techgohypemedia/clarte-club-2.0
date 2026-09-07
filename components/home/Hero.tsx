"use client"

import { ScrollVideoHero } from "./ScrollVideoHero"

export function Hero() {
  return (
    <div className="relative w-full bg-black text-white">
      <ScrollVideoHero />

      {/* Accessibility Anchors */}
      <span id="shop" className="sr-only">
        Shop
      </span>
      <span id="bestsellers" className="sr-only">
        Bestsellers
      </span>
      <span id="contact" className="sr-only">
        Contact Us
      </span>
      <span id="collections" className="sr-only">
        Collection
      </span>
    </div>
  )
}

