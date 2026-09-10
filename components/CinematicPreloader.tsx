"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CinematicPreloader() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Lock scroll during preloader
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Attempt video playback immediately
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: dismiss smoothly if blocked
        setTimeout(() => setIsLoading(false), 1200)
      })
    }

    // Fallback timer: ensure the preloader always dismisses within 3.5s max
    const maxTimer = setTimeout(() => {
      setIsLoading(false)
    }, 3500)

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
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black overflow-hidden select-none pointer-events-auto w-screen h-[100dvh]"
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
