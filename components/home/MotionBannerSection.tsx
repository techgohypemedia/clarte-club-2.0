"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function MotionBannerSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoadVideo(true)
          observer.disconnect()
        }
      },
      { rootMargin: "400px" } // Begin loading when within 400px of viewport
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-video lg:aspect-auto lg:h-screen lg:h-[100dvh] lg:min-h-[100dvh] overflow-hidden bg-black"
    >
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          src="/video/WhatsApp%20Video%202026-09-09%20at%2012.39.26%20PM.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 size-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-[#0a0a0c]" />
      )}
      {/* Subtle vignette for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
    </motion.section>
  )
}
