"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

import { LaunchOfferCountdown } from "@/components/home/LaunchOfferCountdown"
import { getServerTimestamp } from "@/lib/server-time"

import { cn } from "@/lib/utils"

// Launch date: 30th of September 2026
const LAUNCH_DATE = new Date("2026-09-30T23:59:59+05:30").getTime()

export function LaunchOfferBar({ className }: { className?: string }) {
  const initialNow = getServerTimestamp()
  const [isExpired, setIsExpired] = useState(() => initialNow >= LAUNCH_DATE)

  useEffect(() => {
    if (Date.now() >= LAUNCH_DATE) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      if (Date.now() >= LAUNCH_DATE) {
        setIsExpired(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Once the launch date has passed, remove the countdown offer bar
  if (isExpired) {
    return null
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative w-full overflow-hidden", className)}
      style={!className ? {
        background: "linear-gradient(90deg, #0a0a0b 0%, #141415 50%, #0a0a0b 100%)",
        borderTop: "1px solid rgba(201,176,122,0.25)",
        borderBottom: "1px solid rgba(201,176,122,0.10)",
      } : undefined}
    >
      {/* Subtle gold noise texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(201,176,122,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex sm:grid sm:grid-cols-[1fr_auto_1fr] h-[68px] sm:h-[76px] md:h-[84px] w-full max-w-[1268px] items-center justify-between gap-2 sm:gap-3 px-3 sm:px-8">

        {/* Left: Headline */}
        <div className="hidden sm:flex items-center justify-self-start min-w-0">
          <span
            className="block font-semibold uppercase leading-none whitespace-nowrap text-[#C9B07A]"
            style={{
              fontSize: "clamp(0.85rem, 1.6vw, 1.2rem)",
              letterSpacing: "0.08em",
              borderBottom: "1.5px solid rgba(201,176,122,0.55)",
              paddingBottom: "1px",
            }}
          >
            Live Now
          </span>
        </div>

        {/* Center: Countdown (Guaranteed Dead-Center on desktop) */}
        <div className="flex items-center justify-center justify-self-center">
          {/* Thin vertical rule left */}
          <div
            aria-hidden
            className="mr-4 hidden shrink-0 sm:block"
            style={{ width: "1px", height: "36px", background: "rgba(201,176,122,0.2)" }}
          />

          <LaunchOfferCountdown
            targetTimestamp={LAUNCH_DATE}
            initialNow={initialNow}
          />

          {/* Thin vertical rule right */}
          <div
            aria-hidden
            className="ml-4 hidden shrink-0 sm:block"
            style={{ width: "1px", height: "36px", background: "rgba(201,176,122,0.2)" }}
          />
        </div>

        {/* Right: CTA */}
        <div className="flex items-center justify-self-end">
          <Link
            href="/collections"
            className="group relative shrink-0 overflow-hidden"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "clamp(2rem, 4vw, 2.6rem)",
              paddingInline: "clamp(0.9rem, 2vw, 1.75rem)",
              border: "1px solid rgba(201,176,122,0.55)",
              fontSize: "clamp(0.5rem, 0.9vw, 0.7rem)",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C9B07A",
              textDecoration: "none",
              transition: "color 280ms ease",
              whiteSpace: "nowrap",
            }}
          >
            {/* Hover fill */}
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0"
              style={{ background: "rgba(201,176,122,0.12)" }}
            />
            <span className="relative">Shop Now</span>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
