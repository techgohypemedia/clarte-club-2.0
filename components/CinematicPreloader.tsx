"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CinematicPreloader() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // 1. Completely disable on mobile devices (< 768px)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return
    }

    // 2. Only show on the first visit (prevent showing on every refresh)
    try {
      const hasSeen = sessionStorage.getItem("clarte_preloader_seen")
      if (hasSeen) {
        return
      }
      sessionStorage.setItem("clarte_preloader_seen", "true")
    } catch {
      // Storage access fallback
    }

    // Only set loading to true for first desktop visit
    setIsLoading(true)

    // Lock scroll during preloader
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Fallback timer: ensure preloader dismisses within 3.5s max
    const maxTimer = setTimeout(() => {
      setIsLoading(false)
      document.body.style.overflow = prevOverflow
    }, 3500)

    return () => {
      clearTimeout(maxTimer)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  // Start video playback when isLoading activates
  useEffect(() => {
    if (isLoading && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {
        setTimeout(() => setIsLoading(false), 1200)
      })
    }
  }, [isLoading])

  const handleFinish = () => {
    setIsLoading(false)
    document.body.style.overflow = ""
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="cinematic-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            document.body.style.overflow = ""
          }}
          className="hidden md:flex fixed inset-0 z-[999999] items-center justify-center bg-black overflow-hidden select-none pointer-events-auto w-screen h-[100dvh]"
        >
          <div className="relative size-full w-full h-full flex items-center justify-center p-0 m-0 overflow-hidden">
            <video
              ref={videoRef}
              src="/video/use_black_and_gold_or_blac_gwr_video_mvp.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleFinish}
              className="absolute inset-0 size-full w-full h-full object-contain sm:object-cover object-center pointer-events-none"
            />

            {/* Subtle brand watermark & skip action in bottom corner */}
            <div className="absolute bottom-6 right-6 z-10 flex items-center gap-4">
              <button
                type="button"
                onClick={handleFinish}
                className="text-[9.5px] uppercase tracking-[0.25em] text-white/70 hover:text-white transition-all font-semibold cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg active:scale-95"
              >
                Skip →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

