"use client"

import { useEffect, useState, Fragment } from "react"

type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getCountdownParts(target: number, now: number): CountdownParts {
  const total = Math.max(0, Math.floor((target - now) / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const [displayed, setDisplayed] = useState(value)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (value !== displayed) {
      setFlip(true)
      const t = setTimeout(() => {
        setDisplayed(value)
        setFlip(false)
      }, 180)
      return () => clearTimeout(t)
    }
  }, [value, displayed])

  return (
    <div className="flex flex-col items-center" style={{ minWidth: "2.4rem" }}>
      <span
        suppressHydrationWarning
        className="block text-center font-semibold tabular-nums leading-none"
        style={{
          fontSize: "clamp(1.35rem, 2.6vw, 2.1rem)",
          letterSpacing: "-0.04em",
          color: "#ffffff",
          opacity: flip ? 0 : 1,
          transform: flip ? "translateY(-6px)" : "translateY(0)",
          transition: "opacity 180ms ease, transform 180ms ease",
        }}
      >
        {pad(displayed)}
      </span>
      <span
        className="mt-1 font-semibold uppercase text-center block w-full"
        style={{ fontSize: "0.55rem", color: "#C9B07A", letterSpacing: "0.18em" }}
      >
        {label}
      </span>
    </div>
  )
}

export function LaunchOfferCountdown({
  targetTimestamp,
  initialNow,
}: {
  targetTimestamp: number
  initialNow: number
}) {
  const [c, setC] = useState(() =>
    getCountdownParts(targetTimestamp, initialNow)
  )

  useEffect(() => {
    const tick = () => setC(getCountdownParts(targetTimestamp, Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetTimestamp])

  const parts = [
    { label: "Days", value: c.days },
    { label: "Hrs", value: c.hours },
    { label: "Min", value: c.minutes },
    { label: "Sec", value: c.seconds },
  ]

  return (
    <div
      suppressHydrationWarning
      className="flex items-start justify-center"
      style={{ gap: "clamp(0.15rem, 0.5vw, 0.4rem)" }}
      aria-label={`${c.days} days ${c.hours} hours ${c.minutes} minutes ${c.seconds} seconds remaining`}
      aria-live="off"
    >
      {parts.map((p, i) => (
        <Fragment key={p.label}>
          {i > 0 && (
            <span
              aria-hidden
              className="font-light select-none"
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.6rem)",
                color: "#C9B07A",
                lineHeight: 1,
                opacity: 0.65,
                alignSelf: "flex-start",
                marginTop: "0.1em",
                marginInline: "clamp(0.05rem, 0.1vw, 0.15rem)",
              }}
            >
              :
            </span>
          )}
          <CountdownDigit value={p.value} label={p.label} />
        </Fragment>
      ))}
    </div>
  )
}
