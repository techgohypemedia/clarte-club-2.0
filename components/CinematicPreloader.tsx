"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { lockPageScroll } from "@/lib/scroll-lock"

export function CinematicPreloader() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // If not on the home page, never show the preloader and mark session as seen
    if (!isHomePage) {
      try {
        sessionStorage.setItem("clarte_preloader_seen", "true")
      } catch {
        // Storage access fallback
      }
      return
    }

    // 1. Detect if viewport or device is mobile (< 768px or mobile user agent)
    const checkIsMobile = () => {
      if (typeof window === "undefined") return false
      const isMobileWidth =
        window.innerWidth < 768 ||
        window.matchMedia("(max-width: 767px)").matches
      const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent || ""
        )
      return isMobileWidth || isMobileUA
    }

    // Mobile users: immediately bypass preloader
    if (checkIsMobile()) {
      try {
        sessionStorage.setItem("clarte_preloader_seen", "true")
      } catch {
        // Storage access fallback
      }
      return
    }

    // 2. Only show on the first visit of the session for desktop users
    try {
      const hasSeen = sessionStorage.getItem("clarte_preloader_seen")
      if (hasSeen) {
        return
      }
      sessionStorage.setItem("clarte_preloader_seen", "true")
    } catch {
      // Storage access fallback
    }

    // Activate preloader for desktop users
    setIsLoading(true)

    // Lock scroll during preloader
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Resize listener: if resized to mobile viewport, immediately dismiss
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsLoading(false)
        document.body.style.overflow = ""
      }
    }
    window.addEventListener("resize", handleResize)

    // Fallback timer: ensure preloader dismisses if video fails to load (adjusted for 1.5x playback)
    const maxTimer = setTimeout(() => {
      setIsLoading(false)
      document.body.style.overflow = prevOverflow
    }, 4000)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(maxTimer)
      document.body.style.overflow = prevOverflow
    }
  }, [isHomePage])

  // body overflow:hidden does not stop Lenis (it scrolls programmatically), so take the shared lock while the
  // intro is up. Otherwise wheel input scrolls the hero behind the intro before its frames have loaded.
  useEffect(() => {
    if (!isLoading) return
    return lockPageScroll()
  }, [isLoading])

  // Start video playback when isLoading activates & enforce 1.5x speed
  useEffect(() => {
    if (isLoading && videoRef.current) {
      const vid = videoRef.current
      vid.playbackRate = 1.5
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
  }, [isLoading])

  const handleFinish = () => {
    setIsLoading(false)
    document.body.style.overflow = ""
  }

  // Preloader should ONLY ever exist on the home page
  if (!isHomePage) {
    return null
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
          className="fixed inset-0 z-[999999] hidden md:flex items-center justify-center bg-black overflow-hidden select-none pointer-events-auto w-screen h-[100dvh] cursor-pointer"
        >
          <div className="relative size-full w-full h-full flex items-center justify-center p-0 m-0 overflow-hidden">
            <video
              ref={videoRef}
              key="preloader-desktop-video"
              src="/video/clarte-intro.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onPlay={(e) => {
                e.currentTarget.playbackRate = 1.5
              }}
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = 1.5
              }}
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


