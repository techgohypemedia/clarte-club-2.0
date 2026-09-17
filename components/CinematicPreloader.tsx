"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CinematicPreloader() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // 1. Detect if viewport is mobile (< 768px)
    const checkIsMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768)
      }
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    // 2. Only show on the first visit of the session
    try {
      const hasSeen = sessionStorage.getItem("clarte_preloader_seen")
      if (hasSeen) {
        return () => window.removeEventListener("resize", checkIsMobile)
      }
      sessionStorage.setItem("clarte_preloader_seen", "true")
    } catch {
      // Storage access fallback
    }

    // Activate preloader
    setIsLoading(true)

    // Lock scroll during preloader
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Fallback timer: ensure preloader dismisses if video fails to load (extended to 5s for full playback)
    const maxTimer = setTimeout(() => {
      setIsLoading(false)
      document.body.style.overflow = prevOverflow
    }, 5000)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
      clearTimeout(maxTimer)
      document.body.style.overflow = prevOverflow
    }
  }, [])

  // Start video playback when isLoading activates
  useEffect(() => {
    if (isLoading && videoRef.current) {
      const vid = videoRef.current
      vid.muted = true
      vid.defaultMuted = true
      vid.currentTime = 0
      const playPromise = vid.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Preloader video autoplay prevented:", err)
        })
      }
    }
  }, [isLoading, isMobile])

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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            document.body.style.overflow = ""
          }}
          onClick={handleFinish}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black overflow-hidden select-none pointer-events-auto w-screen h-[100dvh] cursor-pointer"
        >
          <div className="relative size-full w-full h-full flex items-center justify-center p-0 m-0 overflow-hidden">
            <video
              ref={videoRef}
              key={isMobile ? "preloader-mobile-video" : "preloader-desktop-video"}
              src={
                isMobile
                  ? "/video/clarte%20logo%20%20animation_gwr_video_mvp.mp4"
                  : "/video/use_black_and_gold_or_blac_gwr_video_mvp.mp4"
              }
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleFinish}
              className="absolute inset-0 size-full w-full h-full pointer-events-none object-cover object-center scale-[1.08] transform-gpu"
            />

            {/* Conceal bottom-right corner video watermark */}
            <div className="pointer-events-none absolute -bottom-2 -right-2 w-44 h-44 bg-gradient-to-tl from-black via-black/95 to-transparent blur-md z-[5]" />

            {/* Skip action in bottom corner */}
            <div className="absolute bottom-6 right-6 pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)] z-10 flex items-center gap-4">
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

