"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ViewportVideo } from "@/components/ui/ViewportVideo"

export function ComingSoonMarquee() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <Link
        href="/collections"
        aria-label="The Club Is Expanding - Discover Collections"
        className="w-full relative block overflow-hidden bg-black text-white border-y border-white/10 group cursor-pointer select-none"
      >
        {/* Cinematic Animation Video (Renders full native frame with 0 cropping) */}
        <ViewportVideo
          src="/video/Luxury_cinematic_animation_display_202607291348.mp4"
          className="w-full h-auto block filter brightness-100 contrast-[1.02] transition-transform duration-1000 group-hover:scale-[1.01]"
        />
      </Link>
    </motion.div>
  )
}


