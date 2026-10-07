"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const Footer3DCanvas = dynamic(
  () => import("@/components/footer/Footer3DCanvas").then((m) => m.Footer3DCanvas),
  { ssr: false }
)

// Loads three.js and the 3D model only when the footer is close to the viewport,
// so they never compete with the hero frames for bandwidth.
export function LazyFooter3D({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "400px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={className}>{visible ? <Footer3DCanvas className="size-full" /> : null}</div>
}
