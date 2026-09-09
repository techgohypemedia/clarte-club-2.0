"use client"

export function MotionBannerSection() {
  return (
    <section className="relative w-full aspect-video lg:aspect-auto lg:h-screen lg:h-[100dvh] lg:min-h-[100dvh] overflow-hidden bg-black">
      <video
        src="/video/WhatsApp%20Video%202026-09-09%20at%2012.39.26%20PM.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 size-full object-cover object-center"
      />
      {/* Subtle vignette for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
    </section>
  )
}
