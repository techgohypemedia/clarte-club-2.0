import Image from "next/image"

// Craftsmanship section: the client's detail sheet, shown exactly as designed and as ONE image on every screen
// size (the client asked for the whole sheet to be visible in a single view on phones too). The sheet carries its
// own "CLARTÉ CLUB" title and captions, so there is no separate visible heading. On phones it runs edge to edge
// so it is as large as the screen allows. Pre-sized WebP served as-is ("unoptimized") to keep the captions crisp.
export function MadeWithCare() {
  return (
    <section id="made-with-care" className="w-full bg-white py-10 text-[#0F0F10] sm:px-6 lg:px-8 md:py-16">
      <h2 className="sr-only">Craftsmanship: made with care</h2>
      <div className="mx-auto max-w-7xl overflow-hidden sm:rounded-[14px]">
        <Image
          src="/images/craft/craft-details.webp"
          alt="Clarté Club craftsmanship details on a translucent blue round frame: UV 400 lenses, precision hinge, premium-grade materials, and the signature CC detail on the temple tip"
          width={1536}
          height={1024}
          sizes="(max-width: 1280px) 100vw, 1280px"
          unoptimized
          className="h-auto w-full"
        />
      </div>
    </section>
  )
}
