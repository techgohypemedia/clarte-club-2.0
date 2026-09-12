"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

const ANNOUNCEMENTS = [
  "FREE SHIPPING ON ORDERS ABOVE RS 2,900 | LAUNCH OFFER 30% OFF",
  "SHIPPING AVAILABLE WORLDWIDE",
  "EASY EXCHANGE ACROSS INDIA",
]

export function ShippingAnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
    }, 3200)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="announcement-bar bg-black text-white overflow-hidden select-none border-b border-white/5">
      <div className="relative flex h-full w-full items-center justify-center px-4 font-marquee text-[8.5px] min-[370px]:text-[9.5px] sm:text-[10.5px] font-normal uppercase tracking-[0.1em] min-[370px]:tracking-[0.16em] sm:tracking-[0.22em] leading-none">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ y: -16, opacity: 0, filter: "blur(2px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 16, opacity: 0, filter: "blur(2px)" }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-center whitespace-nowrap max-w-full truncate px-2"
          >
            {ANNOUNCEMENTS[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  )
}

