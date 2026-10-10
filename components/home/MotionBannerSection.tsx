"use client"

import { motion } from "framer-motion"
import { ViewportVideo } from "@/components/ui/ViewportVideo"

export function MotionBannerSection() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-video lg:aspect-auto lg:h-screen lg:h-[100dvh] lg:min-h-[100dvh] overflow-hidden bg-[#0a0a0c]"
    >
      {/* Downloads/plays only near the viewport and pauses when scrolled away */}
      <ViewportVideo
        src="/video/clarte-brand-film.mp4"
        rootMargin={400}
        className="absolute inset-0 size-full object-cover object-center"
      />
      {/* Subtle vignette for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
    </motion.section>
  )
}
