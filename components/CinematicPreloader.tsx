"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CinematicPreloader() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Only show on first visit per session
    try {
      const hasSeen = sessionStorage.getItem("clarte_intro_seen")
      if (hasSeen) {
        setIsLoading(false)
        return
      }
      sessionStorage.setItem("clarte_intro_seen", "true")
      setIsLoading(true)
    } catch {
      // If sessionStorage unavailable, show once
      setIsLoading(true)
    }

    // Lock scroll during preloader
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Fallback timer: ensure the preloader always dismisses within 3.4s max
    const maxTimer = setTimeout(() => {
      setIsLoading(false)
    }, 3400)

    // Attempt video playback immediately
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: dismiss quickly if blocked
        setTimeout(() => setIsLoading(false), 1200)
      })
    }

    return () => {
      clearTimeout(maxTimer)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  const handleFinish = () => {
    setIsLoading(false)
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
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#EAE6DF] overflow-hidden select-none pointer-events-auto"
        >
          <div className="relative size-full flex items-center justify-center px-4 py-6 sm:p-0">
            <video
              ref={videoRef}
              src="/video/Video%20Project%202_gwr_video_mvp.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleFinish}
              className="w-full h-full max-h-[100dvh] max-w-[100vw] object-contain object-center"
            />

            {/* Subtle brand watermark & skip action in bottom corner */}
            <div className="absolute bottom-6 right-6 z-10 flex items-center gap-4">
              <button
                type="button"
                onClick={handleFinish}
                className="text-[9px] uppercase tracking-[0.25em] text-black/40 hover:text-black transition-colors font-medium cursor-pointer bg-white/40 px-3 py-1.5 rounded-full backdrop-blur-sm"
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
