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
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 select-none"
        >
          {/* ── Top Progress Bar (Centered directly above card on desktop, adjusted for mobile) ── */}
          <div className="absolute top-4 left-4 right-28 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 flex items-center gap-1.5 sm:w-full sm:max-w-[420px] sm:px-4">
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

          {/* ── Top Right Action Controls (Pause + Close) ── */}
          <div className="absolute top-3.5 right-4 sm:top-4 sm:right-10 z-50 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsPaused((prev) => !prev)
              }}
              className="flex size-8 sm:size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer backdrop-blur-sm"
              aria-label={isPaused ? "Play story" : "Pause story"}
            >
              {isPaused ? (
                <Play className="size-3.5 sm:size-4 fill-white text-white ml-0.5" />
              ) : (
                <Pause className="size-3.5 sm:size-4 fill-white text-white" />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="flex size-8 sm:size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer backdrop-blur-sm"
              aria-label="Close stories"
            >
              <X className="size-4 sm:size-5" />
            </button>
          </div>

          {/* ── Center Container with Outer Nav Arrows + Main Story Card ── */}
          <div className="relative flex items-center justify-center w-full max-w-[580px] my-auto pt-6">
            {/* Previous Arrow Button (Left of Card, desktop only) */}
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="hidden sm:flex absolute -left-12 sm:-left-14 z-50 size-11 sm:size-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg"
                aria-label="Previous story"
              >
                <ChevronLeft className="size-6" strokeWidth={2.2} />
              </button>
            )}

            {/* ── Main Full-Bleed Story Card ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStory.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="relative flex h-[82vh] max-h-[740px] min-h-[520px] w-full max-w-[420px] flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl select-none border border-white/10"
              >
                {/* Background Full-Bleed Editorial Photo */}
                <Image
                  src={currentStory.image}
                  alt={currentStory.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="object-cover object-center"
                />

                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none" />

                {/* 1. Top Overlays Inside Card (Logo Only) */}
                <div className="relative z-30 flex items-center justify-between p-5 sm:p-6">
                  <div className="flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md p-1.5 border border-white/20 shadow-md">
                    <Image
                      src="/logo.svg"
                      alt="Clarté Club"
                      width={24}
                      height={16}
                      className="h-4 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                </div>

                {/* Tap Navigation Click Overlays */}
                <div
                  className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                  title="Previous Story"
                />
                <div
                  className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  title="Next Story"
                />

                {/* 2. Bottom Floating Glass CTA Button */}
                <div className="relative z-30 flex flex-col items-center justify-center p-6 text-center pb-8 gap-3.5">
                  <h3 className="font-heading text-xl font-bold text-white tracking-wide drop-shadow-md">
                    {currentStory.title}
                  </h3>
                  <Link
                    href={currentStory.link}
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full bg-white/30 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/40 shadow-lg transition-all hover:bg-white hover:text-black active:scale-95 mt-1"
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
                className="hidden sm:flex absolute -right-12 sm:-right-14 z-50 size-11 sm:size-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg"
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

