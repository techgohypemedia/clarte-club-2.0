"use client"

import { useEffect, useRef } from "react"

type ViewportVideoProps = Omit<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  "autoPlay" | "preload"
> & {
  src: string
  /** How far outside the viewport (px) to start playing */
  rootMargin?: number
}

/**
 * Autoplaying, muted, looping video that only fetches its metadata up front (so layout is stable),
 * starts playing/downloading when it nears the viewport, and pauses while off screen so it never
 * competes with images or scrolling for CPU and bandwidth.
 */
export function ViewportVideo({ src, rootMargin = 300, ...props }: ViewportVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: `${rootMargin}px` }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [rootMargin])

  return <video ref={ref} src={src} muted loop playsInline preload="metadata" {...props} />
}
