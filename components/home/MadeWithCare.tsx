import Image from "next/image"

// Reassures new visitors about quality. Copy is deliberately collection-neutral (acetate and metal frames
// across Noir, Heritage, Crystal and Atelier). Plain server-rendered markup: no client JS, no animation.
const blocks = [
  {
    title: "Materials",
    copy: "Premium-grade acetate and metal, chosen to last.",
    image: "/images/craft/materials.webp",
    alt: "Close-up of a tortoise acetate frame corner with a gold metal detail",
  },
  {
    title: "Lenses",
    copy: "UV 400 protection in every pair.",
    image: "/images/craft/lenses.webp",
    alt: "Close-up of gradient lenses and the frame bridge",
  },
  {
    title: "Hinges",
    copy: "Precise metal hinges with engraved detailing.",
    image: "/images/craft/hinges.webp",
    alt: "Close-up of an engraved gold hinge on a translucent frame",
  },
  {
    title: "Packaging",
    copy: "Arrives in the Clarté Club kit: case, cloth and pouch.",
    image: "/images/craft/packaging.webp",
    alt: "Clarté Club kit with gift box, hard case, cleaning cloth and pouch",
  },
]

export function MadeWithCare() {
  return (
    <section id="made-with-care" className="w-full bg-white px-4 py-14 text-[#0F0F10] sm:px-6 lg:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9B07A]">Craftsmanship</p>
          <h2 className="font-heading text-[22px] font-semibold uppercase leading-none tracking-tight sm:text-3xl md:text-[40px]">
            Made with Care
          </h2>
          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-neutral-600 sm:text-[14px]">
            Every Clarté Club frame is considered down to the smallest detail.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 md:mt-10 lg:grid-cols-4 lg:gap-x-5">
          {blocks.map((block) => (
            <li key={block.title}>
              <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-[#f4f4f4] sm:rounded-[14px]">
                <Image
                  src={block.image}
                  alt={block.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-3 text-[12px] font-semibold uppercase tracking-[0.18em] sm:text-[13px]">{block.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-neutral-600 sm:text-[13px]">{block.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
