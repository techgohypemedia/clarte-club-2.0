import Image from "next/image"

// Craftsmanship section: the client's frame-detail sheet (photos, measurements, hinge / lens / signature
// close-ups). The sheet is a wide collage with small text baked in, so on phones it is shown as two stacked
// parts at full width (photos, then measurements and details) to keep that text readable; desktop shows the
// whole sheet. Files are pre-sized WebP, served as-is ("unoptimized") so the fine text is not re-compressed.
const ALT_PHOTOS =
  "Clarté Club round frame in translucent blue acetate with dark lenses, with close-ups of the engraved metal hinge and the CC logo on the temple tip"
const ALT_SPECS =
  "Frame dimensions in millimetres: lens width 49, bridge width 22, temple length 145, frame width 138, lens height 46. Details: precision hinge, UV 400 protection, signature CC detail"

export function MadeWithCare() {
  return (
    <section id="made-with-care" className="w-full bg-white px-4 py-14 text-[#0F0F10] sm:px-6 lg:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9B07A]">Craftsmanship</p>
          <h2 className="font-heading text-[22px] font-semibold uppercase leading-none tracking-tight sm:text-3xl md:text-[40px]">
            Made with Care
          </h2>
        </div>

        {/* Phones and tablets: two stacked parts */}
        <div className="mt-8 space-y-2 overflow-hidden rounded-[12px] sm:rounded-[14px] lg:hidden">
          <Image
            src="/images/craft/frame-details-photos.webp"
            alt={ALT_PHOTOS}
            width={838}
            height={1024}
            sizes="100vw"
            unoptimized
            className="h-auto w-full"
          />
          <Image
            src="/images/craft/frame-details-specs.webp"
            alt={ALT_SPECS}
            width={698}
            height={810}
            sizes="100vw"
            unoptimized
            className="h-auto w-full"
          />
        </div>

        {/* Desktop: the full sheet */}
        <div className="mt-10 hidden overflow-hidden rounded-[14px] lg:block">
          <Image
            src="/images/craft/frame-details.webp"
            alt={`${ALT_PHOTOS}. ${ALT_SPECS}`}
            width={1536}
            height={1024}
            sizes="(max-width: 1280px) 100vw, 1280px"
            unoptimized
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  )
}
