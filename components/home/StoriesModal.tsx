"use client"

import { useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export type StoryItem = {
  id: string
  category: string
  title: string
  subtitle: string
  image: string
  link: string
  ctaText: string
}

const defaultStories: StoryItem[] = [
  {
    id: "story-1",
    category: "NEW DROP",
    title: "Heritage Oval",
    subtitle: "Signature bio-acetate frames with tinted anti-glare lenses.",
    image: "/images/products/product1.png",
    link: "/collections?type=sunglasses",
    ctaText: "Shop Now",
  },
  {
    id: "story-2",
    category: "BESTSELLER",
    title: "Crystal Atelier",
    subtitle: "Precision engineered transparent optical silhouette.",
    image: "/images/products/product3.png",
    link: "/collections?type=eyeglasses",
    ctaText: "Explore Collection",
  },
  {
    id: "story-3",
    category: "LIMITED EDIT",
    title: "Noir Square",
    subtitle: "Monochrome luxury eyewear designed for modern character.",
    image: "/images/products/product6.png",
    link: "/collections",
    ctaText: "Shop Bestseller",
  },
  {
    id: "story-4",
    category: "EDITORIAL",
    title: "Summer 2026",
    subtitle: "Architectural proportions meet contemporary minimalism.",
    image: "/images/products/product7.png",
    link: "/collections",
    ctaText: "View Lookbook",
  },
]

export function StoriesModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [stories, setStories] = useState<StoryItem[]>(defaultStories)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    import("@/lib/shopify-adapter").then(({ getShopifyStories }) => {
      getShopifyStories().then((liveStories) => {
        if (liveStories && liveStories.length > 0) {
          setStories(liveStories)
        }
      })
    })
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [open])

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setCurrentIndex(0)
      setProgress(0)
      setIsPaused(false)
    }
  }, [open])

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }, [currentIndex, stories.length, onClose])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setProgress(0)
    }
  }, [currentIndex])

  // Timer for auto advancing story progress
  useEffect(() => {
    if (!open || isPaused) return

    const DURATION = 5000 // 5s per story
    const INTERVAL = 50

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return Math.min(100, prev + (INTERVAL / DURATION) * 100)
      })
    }, INTERVAL)

    return () => clearInterval(timer)
  }, [open, isPaused])

  // Auto advance story when progress reaches 100%
  useEffect(() => {
    if (!open) return
    if (progress >= 100) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setProgress(0)
      } else {
        onClose()
      }
    }
  }, [open, progress, currentIndex, stories.length, onClose])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, handleNext, handlePrev, onClose])

  if (!mounted) return null

  const currentStory = stories[currentIndex] || stories[0]

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-md sm:p-6 select-none"
        >
          {/* ── Center Container with Outer Nav Arrows (Desktop) + Main Story Card ── */}
          <div className="relative flex h-full w-full sm:h-auto sm:w-auto items-center justify-center max-w-[580px]">
            {/* Previous Arrow Button (Left of Card, desktop only) */}
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="hidden sm:flex absolute -left-12 sm:-left-16 z-50 size-11 sm:size-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg"
                aria-label="Previous story"
              >
                <ChevronLeft className="size-6" strokeWidth={2.2} />
              </button>
            )}

            {/* ── Main Full-Bleed Story Card ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStory.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="relative flex h-full w-full sm:h-[84vh] sm:max-h-[760px] sm:min-h-[540px] sm:w-[420px] flex-col justify-between overflow-hidden bg-neutral-950 sm:rounded-2xl shadow-2xl select-none sm:border sm:border-white/10"
              >
                {/* ── Top Progress Bars Inside Card ── */}
                <div className="absolute top-0 inset-x-0 z-40 pt-3 sm:pt-4 px-3.5 sm:px-4 flex items-center gap-1.5 pointer-events-auto">
                  {stories.map((s, idx) => {
                    let width = "0%"
                    if (idx < currentIndex) width = "100%"
                    else if (idx === currentIndex) width = `${progress}%`

                    return (
                      <div
                        key={s.id}
                        className="h-1 flex-1 overflow-hidden rounded-full bg-white/30 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentIndex(idx)
                          setProgress(0)
                        }}
                      >
                        <div
                          className="h-full bg-white transition-all duration-75 ease-linear"
                          style={{ width }}
                        />
                      </div>
                    )
                  })}
                </div>

                {/* ── Top Header Row (Logo Left + Controls Right) ── */}
                <div className="relative z-40 flex items-center justify-between pt-7 sm:pt-8 px-4 sm:px-5">
                  <div className="flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md p-1.5 border border-white/20 shadow-md">
                    <Image
                      src="/logo.svg"
                      alt="Clarté Club"
                      width={24}
                      height={16}
                      className="h-4 w-auto object-contain brightness-0 invert"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsPaused((prev) => !prev)
                      }}
                      className="flex size-8 sm:size-8.5 items-center justify-center rounded-full bg-black/40 text-white hover:bg-white/20 transition-colors cursor-pointer backdrop-blur-md border border-white/20"
                      aria-label={isPaused ? "Play story" : "Pause story"}
                    >
                      {isPaused ? (
                        <Play className="size-3.5 fill-white text-white ml-0.5" />
                      ) : (
                        <Pause className="size-3.5 fill-white text-white" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                      }}
                      className="flex size-8 sm:size-8.5 items-center justify-center rounded-full bg-black/40 text-white hover:bg-white/20 transition-colors cursor-pointer backdrop-blur-md border border-white/20"
                      aria-label="Close stories"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Ambient Blurred Atmosphere */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <Image
                    src={currentStory.image}
                    alt=""
                    fill
                    sizes="100px"
                    className="object-cover object-center blur-3xl opacity-20 scale-125"
                  />
                </div>

                {/* Main Product Image (Uncropped & Centered) */}
                <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-10 pointer-events-none">
                  <div className="relative w-full h-full max-h-[60%] sm:max-h-[65%] flex items-center justify-center">
                    <Image
                      src={currentStory.image}
                      alt={currentStory.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, 420px"
                      className="object-contain object-center drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none z-10" />

                {/* Tap Navigation Click Overlays (No title tooltip) */}
                <div
                  className="absolute inset-y-0 left-0 w-[35%] z-20 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                  aria-label="Previous story"
                />
                <div
                  className="absolute inset-y-0 right-0 w-[65%] z-20 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  aria-label="Next story"
                />

                {/* 2. Bottom Floating Glass CTA Button */}
                <div className="relative z-30 flex flex-col items-center justify-center p-6 text-center pb-10 sm:pb-8 gap-3.5">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-md">
                    {currentStory.title}
                  </h3>
                  <Link
                    href={currentStory.link}
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full bg-white/25 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/40 shadow-lg transition-all hover:bg-white hover:text-black active:scale-95 mt-1"
                  >
                    {currentStory.ctaText}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Next Arrow Button (Right of Card, desktop only) */}
            {currentIndex < stories.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="hidden sm:flex absolute -right-12 sm:-right-16 z-50 size-11 sm:size-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg"
                aria-label="Next story"
              >
                <ChevronRight className="size-6" strokeWidth={2.2} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

