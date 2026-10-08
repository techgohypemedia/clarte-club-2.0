// Shared page-scroll lock for overlays that can be on screen at the same time (cinematic intro + hero loader).
// Counted, so one overlay closing never unlocks scroll while another is still showing.
// overflow:hidden alone is not enough: Lenis scrolls programmatically, so it is stopped as well.

import type Lenis from "lenis"

let locks = 0

export function getLenis(): Lenis | null {
  return typeof window === "undefined" ? null : ((window as unknown as { lenis?: Lenis | null }).lenis ?? null)
}

export function lockPageScroll(): () => void {
  locks++
  document.documentElement.style.overflow = "hidden"
  getLenis()?.stop()
  // Lenis may be created by a sibling effect that runs after the caller's; stop it once it exists
  const raf = requestAnimationFrame(() => {
    if (locks > 0) getLenis()?.stop()
  })

  let released = false
  return () => {
    if (released) return
    released = true
    cancelAnimationFrame(raf)
    locks = Math.max(0, locks - 1)
    if (locks === 0) {
      document.documentElement.style.overflow = ""
      getLenis()?.start()
    }
  }
}
