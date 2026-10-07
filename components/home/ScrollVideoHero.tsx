"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useScroll, useTransform, useMotionValue, animate, motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

const DESKTOP_TOTAL_FRAMES = 201
const DESKTOP_PREFIX = "/video frame/video_frames_webp_1280x720/frame_"
const DESKTOP_SUFFIX = ".webp"

const MOBILE_TOTAL_FRAMES = 108
const MOBILE_PREFIX = "https://pub-cc1aedfde6bb4a59bc28137b88a01290.r2.dev/mobile%20mobile%20frames/frame_"
const MOBILE_SUFFIX = ".webp"

// Mobile loader waits only for the opening frames (not all of them) before revealing the hero
const GATE_FRAMES = 24
const LOADER_SEEN_KEY = "clarte-hero-loader-seen-v1"
const LOADER_FAILSAFE_MS = 8000
const LOGO_MASK = {
  WebkitMaskImage: "url(/clarte-club-full-logo.svg)",
  maskImage: "url(/clarte-club-full-logo.svg)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const

const DESKTOP_POSTER = `${DESKTOP_PREFIX}0001${DESKTOP_SUFFIX}`
const MOBILE_POSTER = `${MOBILE_PREFIX}0001${MOBILE_SUFFIX}`

function formatDesktopFrameIndex(index: number): string {
  return String(index + 1).padStart(4, "0")
}

function formatMobileFrameIndex(index: number): string {
  return String(index + 1).padStart(4, "0")
}

export function ScrollVideoHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Screen size detection
  // null until measured on the client, so we never download the wrong frame set first
  const [isMobileState, setIsMobile] = useState<boolean | null>(null)
  const isMobile = isMobileState === true
  const [showScrollCue, setShowScrollCue] = useState(true)
  const [showCTA, setShowCTA] = useState(false)

  // Mobile loading phase: real progress of the opening frames, eased for a smooth premium fill
  const [loadProgress, setLoadProgress] = useState(0)
  const [loaderDone, setLoaderDone] = useState(false)
  const progressMV = useMotionValue(0)
  const logoClip = useTransform(progressMV, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`)
  const percentText = useTransform(progressMV, (v) => `${String(Math.round(v * 100)).padStart(2, "0")}%`)
  const showLoader = isMobileState !== false && !loaderDone

  // Preloading & Frame Cache
  const desktopImagesRef = useRef<HTMLImageElement[]>([])
  const mobileImagesRef = useRef<HTMLImageElement[]>([])

  // Continuous physics frame tracking
  const currentFrameRef = useRef<number>(0)
  const targetFrameRef = useRef<number>(0)
  const lastScrollTargetRef = useRef<number>(0)
  const scrollVelocityRef = useRef<number>(0)
  
  // Active frame count depending on mobile vs desktop
  const activeTotalFrames = isMobile ? MOBILE_TOTAL_FRAMES : DESKTOP_TOTAL_FRAMES

  // Track scroll position across container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Frame target calculation based on scroll progress
  const rawFrameIndex = useTransform(scrollYProgress, [0, 1], [0, activeTotalFrames - 1])

  useEffect(() => {
    const unsubscribe = rawFrameIndex.on("change", (latest) => {
      targetFrameRef.current = latest
      // Hide scroll cue on mobile as soon as user begins scrolling
      if (isMobile && Math.abs(latest - lastScrollTargetRef.current) > 0.3) {
        setShowScrollCue(false)
      }

      // Show CTA when reaching the end of the video sequence
      setShowCTA(latest > activeTotalFrames - 15)

      lastScrollTargetRef.current = latest
    })

    return () => {
      unsubscribe()
    }
  }, [rawFrameIndex, isMobile])

  // Timer to animate scroll cue for 2 seconds on mobile on initial load, then hide
  useEffect(() => {
    if (!isMobile || !loaderDone) return
    const timer = setTimeout(() => {
      setShowScrollCue(false)
    }, 2200)

    return () => clearTimeout(timer)
  }, [isMobile, loaderDone])

  // Screen size listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Loader is first-visit only: if this browser has already seen it, drop it right away
  useEffect(() => {
    try {
      if (localStorage.getItem(LOADER_SEEN_KEY) === "1") setLoaderDone(true)
    } catch {}
  }, [])

  // Loader: ease the displayed progress toward the real one for a smooth premium fill
  useEffect(() => {
    if (isMobileState !== true) return
    const controls = animate(progressMV, loadProgress, {
      duration: loadProgress >= 1 ? 0.7 : 1.1,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [loadProgress, isMobileState, progressMV])

  // Loader: dismiss once the fill completes (short beat on 100%), with a failsafe so it can never get stuck
  useEffect(() => {
    if (isMobileState !== true || loaderDone) return
    let doneTimer: ReturnType<typeof setTimeout> | undefined
    const finish = () => {
      try {
        localStorage.setItem(LOADER_SEEN_KEY, "1")
      } catch {}
      setLoaderDone(true)
    }
    const unsub = progressMV.on("change", (v) => {
      if (v >= 0.999 && !doneTimer) doneTimer = setTimeout(finish, 350)
    })
    const failsafe = setTimeout(finish, LOADER_FAILSAFE_MS)
    return () => {
      unsub()
      clearTimeout(failsafe)
      if (doneTimer) clearTimeout(doneTimer)
    }
  }, [isMobileState, loaderDone, progressMV])

  // Loader: lock page scroll while it is on screen
  useEffect(() => {
    if (!showLoader) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = "hidden"
    return () => {
      html.style.overflow = prev
    }
  }, [showLoader])

  // Optimized Async Progressive Preloader (Instant First Frame + Accelerated Decode + Background Streaming)
  useEffect(() => {
    if (isMobileState === null) return
    let mounted = true

    const images: HTMLImageElement[] = []

    // Helper to load and decode single image asynchronously
    // On mobile only the first frames are decoded up front; the rest are decoded near the playhead
    // (see render loop) so we never hold hundreds of full-size bitmaps in memory.
    const loadImage = (src: string, highPriority = false, decodeNow = true): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image()
        if (highPriority) {
          img.fetchPriority = "high"
        }
        img.src = src

        const handleReady = () => {
          if (decodeNow && "decode" in img) {
            img.decode().then(() => resolve(img)).catch(() => resolve(img))
          } else {
            resolve(img)
          }
        }

        if (img.complete && img.naturalWidth > 0) {
          handleReady()
        } else {
          img.onload = handleReady
          img.onerror = () => resolve(img)
        }
      })
    }

    const streamFrames = async () => {
      const activePrefix = isMobile ? MOBILE_PREFIX : DESKTOP_PREFIX
      const activeSuffix = isMobile ? MOBILE_SUFFIX : DESKTOP_SUFFIX
      const activeTotal = isMobile ? MOBILE_TOTAL_FRAMES : DESKTOP_TOTAL_FRAMES
      const activeRef = isMobile ? mobileImagesRef : desktopImagesRef
      const formatFn = isMobile ? formatMobileFrameIndex : formatDesktopFrameIndex

      // 1. Instant load first frame for immediate zero-latency render (high priority)
      const firstFrame = await loadImage(`${activePrefix}${formatFn(0)}${activeSuffix}`, true)
      if (!mounted) return
      images[0] = firstFrame
      activeRef.current = images
      let gateLoaded = 1
      setLoadProgress(gateLoaded / GATE_FRAMES)

      // 2. Load order: the opening frames first (where every visit starts scrolling), then a sparse
      //    "keyframe" pass (every 6th) so scrubbing anywhere shows a nearby frame, then the gaps.
      const STEP = 6
      const HEAD = isMobile ? GATE_FRAMES : 12
      const order: number[] = []
      const queued = new Set<number>([0])
      const push = (i: number) => {
        if (i < activeTotal && !queued.has(i)) {
          queued.add(i)
          order.push(i)
        }
      }
      for (let i = 1; i < HEAD; i++) push(i)
      for (let i = STEP; i < activeTotal; i += STEP) push(i)
      for (let i = 1; i < activeTotal; i++) push(i)

      // 3. Bounded-concurrency pool (fewer parallel requests on mobile so the opening frames aren't starved)
      const CONCURRENCY = isMobile ? 4 : 6
      let cursor = 0
      const worker = async () => {
        while (mounted && cursor < order.length) {
          const idx = order[cursor++]
          const img = await loadImage(
            `${activePrefix}${formatFn(idx)}${activeSuffix}`,
            idx < HEAD,
            !isMobile || idx < HEAD
          )
          if (!mounted) return
          images[idx] = img
          activeRef.current = images
          if (idx < GATE_FRAMES) {
            gateLoaded++
            setLoadProgress(Math.min(1, gateLoaded / GATE_FRAMES))
          }
        }
      }
      await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    }

    streamFrames()

    return () => {
      mounted = false
    }
  }, [isMobile, isMobileState])

  // Canvas drawing & Seamless Coasting Physics (Zero-Reflow 60fps Canvas Render)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const decodedRef = new WeakSet<HTMLImageElement>()

    // Cached layout dimensions to prevent DOM reflow thrashing inside RAF
    let cachedWidth = 0
    let cachedHeight = 0
    let dpr = 1

    // Track last drawn state to short-circuit identical frames (massive GPU save)
    let lastDrawnImg: HTMLImageElement | null = null
    let lastDrawnWidth = 0
    let lastDrawnHeight = 0

    const resizeCanvas = () => {
      // Lower cap on mobile: extra canvas pixels beyond ~1.5x just cost GPU
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
      cachedWidth = canvas.clientWidth
      cachedHeight = canvas.clientHeight
      canvas.width = cachedWidth * dpr
      canvas.height = cachedHeight * dpr
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Helper to find closest available loaded frame if targeted frame is still downloading
    const getBestAvailableImage = (targetIndex: number, images: HTMLImageElement[]): HTMLImageElement | null => {
      if (images[targetIndex]?.complete && images[targetIndex]?.naturalWidth > 0) {
        return images[targetIndex]
      }
      // Search backwards for nearest loaded frame
      for (let i = targetIndex - 1; i >= 0; i--) {
        if (images[i]?.complete && images[i]?.naturalWidth > 0) {
          return images[i]
        }
      }
      // Fallback search forwards
      for (let i = targetIndex + 1; i < images.length; i++) {
        if (images[i]?.complete && images[i]?.naturalWidth > 0) {
          return images[i]
        }
      }
      return images[0] || null
    }

    let inView = true
    let running = true

    const render = () => {
      if (!inView) {
        running = false
        return
      }
      const activeFramesCount = isMobile ? MOBILE_TOTAL_FRAMES : DESKTOP_TOTAL_FRAMES
      const activeImages = isMobile ? mobileImagesRef.current : desktopImagesRef.current

      const target = targetFrameRef.current
      const diff = target - currentFrameRef.current

      // Fast responsive lerp tracking with instant crisp snap when near target to eliminate floaty drift on scroll stop
      if (Math.abs(diff) < 0.5) {
        currentFrameRef.current = target
      } else {
        currentFrameRef.current += diff * 0.08 // Lowered from 0.35 for much smoother dampening (fixes glitching)
      }

      // Clamp current frame position within valid bounds [0, activeFramesCount - 1]
      const rawCurrent = Math.max(0, Math.min(activeFramesCount - 1, currentFrameRef.current))
      currentFrameRef.current = rawCurrent

      // Use exact rounded frame index for clean single-frame rendering (eliminates ghosting / double-image outlines)
      const frameIndex = Math.round(rawCurrent)
      const img = getBestAvailableImage(frameIndex, activeImages)

      // Mobile: pre-decode only the frames just ahead of / behind the playhead, off the draw path
      if (isMobile) {
        for (let i = frameIndex - 2; i <= frameIndex + 8; i++) {
          const near = activeImages[i]
          if (near && near.complete && near.naturalWidth > 0 && !decodedRef.has(near)) {
            decodedRef.add(near)
            near.decode().catch(() => {})
          }
        }
      }

      // Short-circuit: do not burn CPU/GPU if the exact same frame is already on the canvas
      if (
        img === lastDrawnImg &&
        cachedWidth === lastDrawnWidth &&
        cachedHeight === lastDrawnHeight
      ) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      if (img && img.complete && img.naturalWidth > 0 && cachedWidth > 0 && cachedHeight > 0) {
        ctx.save()
        ctx.scale(dpr, dpr)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.clearRect(0, 0, cachedWidth, cachedHeight)

        const imgRatio = img.naturalWidth / img.naturalHeight
        const canvasRatio = cachedWidth / cachedHeight

        let drawWidth = cachedWidth
        let drawHeight = cachedHeight
        let offsetX = 0
        let offsetY = 0

        // Cover mode: Fills 100% of the screen edge-to-edge on mobile and desktop
        if (canvasRatio > imgRatio) {
          drawWidth = cachedWidth
          drawHeight = cachedWidth / imgRatio
          offsetX = 0
          offsetY = (cachedHeight - drawHeight) / 2
        } else {
          drawWidth = cachedHeight * imgRatio
          drawHeight = cachedHeight
          offsetX = (cachedWidth - drawWidth) / 2
          offsetY = 0
        }

        // Round coordinates to prevent subpixel anti-aliasing blur
        const rOffsetX = Math.round(offsetX)
        const rOffsetY = Math.round(offsetY)
        const rDrawWidth = Math.round(drawWidth)
        const rDrawHeight = Math.round(drawHeight)

        ctx.globalAlpha = 1.0

        // Draw crisp single frame main image (captures 100% of viewport)
        ctx.drawImage(img, rOffsetX, rOffsetY, rDrawWidth, rDrawHeight)

        ctx.restore()

        lastDrawnImg = img
        lastDrawnWidth = cachedWidth
        lastDrawnHeight = cachedHeight
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    // Stop the draw loop entirely while the hero is off screen; restart when it scrolls back in
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView && !running) {
          running = true
          animationFrameId = requestAnimationFrame(render)
        }
      },
      { rootMargin: "200px" }
    )
    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  const isCueVisible = (!isMobile || showScrollCue) && !showCTA

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-black">
      {/* Premium mobile loading phase: logo fills with champagne gold as the opening frames arrive.
          md:hidden keeps it out of desktop even before JS decides which layout applies. */}
      {/* Runs before first paint: marks <html> for returning visitors so the server-rendered loader never flashes */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem(${JSON.stringify(LOADER_SEEN_KEY)})==="1")document.documentElement.setAttribute("data-hero-seen","1")}catch(e){}`,
        }}
      />
      <style>{`html[data-hero-seen] .hero-loader{display:none!important}`}</style>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="hero-loader"
            className="hero-loader fixed inset-0 z-100 md:hidden flex flex-col items-center justify-center bg-[#0A0A0B]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            aria-label="Loading"
          >
            {/* Soft champagne glow behind the mark */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 40% at 50% 50%, rgba(201,176,122,0.10) 0%, rgba(201,176,122,0.03) 45%, transparent 75%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[64vw] max-w-[300px] aspect-[926/394]"
            >
              {/* Dim base mark */}
              <div aria-hidden className="absolute inset-0 bg-white/12" style={LOGO_MASK} />
              {/* Gold fill, revealed left to right with real progress */}
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{
                  ...LOGO_MASK,
                  clipPath: logoClip,
                  background: "linear-gradient(90deg, #F4EBD7 0%, #DFC893 45%, #C9B07A 100%)",
                }}
              />
              {/* Slow light sweep across the whole mark */}
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{
                  ...LOGO_MASK,
                  backgroundImage:
                    "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
                  backgroundSize: "250% 100%",
                }}
                animate={{ backgroundPosition: ["150% 0%", "-50% 0%"] }}
                transition={{ duration: 2.6, ease: "linear", repeat: Infinity }}
              />
            </motion.div>

            {/* Hairline progress + percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <div className="relative h-px w-[42vw] max-w-[190px] overflow-hidden bg-white/10">
                <motion.div
                  className="absolute inset-0 origin-left bg-[#C9B07A]"
                  style={{ scaleX: progressMV }}
                />
              </div>
              <motion.span className="font-heading text-[9px] font-medium tracking-[0.4em] text-white/45 tabular-nums">
                {percentText}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Container pinning canvas over 300vh container track */}
      <div className="sticky top-0 h-[100dvh] min-h-[100dvh] w-full overflow-hidden">
        
        {/* High Performance Pure Video Canvas (Instant Hydration, Zero Loading Screen) */}
        {/* Server-rendered poster: visible instantly (before JS/frames load), covered by the canvas once drawing starts */}
        <picture>
          <source media="(max-width: 767px)" srcSet={MOBILE_POSTER} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DESKTOP_POSTER}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover z-0 pointer-events-none"
          />
        </picture>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full z-0 pointer-events-none"
        />

        {/* Subtle Vignette Gradient for Depth */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

        {/* Minimal Subtle Bottom Scroll Cue */}
        <div className="relative z-10 size-full flex flex-col justify-end px-6 pb-24 md:pb-12 pointer-events-none">
          <div className="flex items-center justify-center w-full text-white font-mono text-[10px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] min-h-[40px] relative">
            <AnimatePresence>
              {isCueVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-1.5 absolute"
                >
                  <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-white/90">SCROLL</span>
                  <svg className="w-4 h-4 text-white animate-bounce opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showCTA && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute pointer-events-auto"
                >
                  <Link 
                    href="/collections" 
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-black/85 px-6 py-2.5 sm:px-9 sm:py-3.5 md:px-10 md:py-4 text-white backdrop-blur-xl border border-[#C9B07A]/50 transition-all duration-500 hover:border-[#C9B07A] active:scale-95 whitespace-nowrap"
                  >
                    {/* Champagne Gold Shimmer Fill on Hover */}
                    <span 
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#C9B07A] via-[#dfc893] to-[#C9B07A] transition-transform duration-500 ease-out group-hover:translate-x-0" 
                    />
                    
                    <span className="relative z-10 font-heading text-[10px] sm:text-[11.5px] md:text-[12px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white transition-colors duration-300 group-hover:text-[#0A0A0B]">
                      Explore Collections
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  )
}
