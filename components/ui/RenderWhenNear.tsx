"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

// Renders its children only once they come within `margin` of the viewport. Used for below-the-fold sections
// so opening a page only has to render what is on screen first (big win on phones), while the rest mounts
// before the customer scrolls to it.
export function RenderWhenNear({
  children,
  minHeight = 400,
  margin = "800px",
}: {
  children: ReactNode
  minHeight?: number
  margin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: margin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [near, margin])

  if (near) return <>{children}</>
  return <div ref={ref} style={{ minHeight }} aria-hidden />
}
