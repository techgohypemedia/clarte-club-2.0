import Image from "next/image"

import { cn } from "@/lib/utils"

type DenimPanelProps = {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  sizes?: string
}

function DenimPanel({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 1023px) 100vw, 50vw",
}: DenimPanelProps) {
  return (
    <div className={cn("relative overflow-hidden bg-white", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover object-center", imageClassName)}
      />
    </div>
  )
}

export function DenimEditorialSection() {
  return (
    <section className="w-full bg-white text-black">
      <h2 className="sr-only">Sunglasses editorial</h2>

      <div className="grid grid-cols-1 gap-0 bg-white lg:grid-cols-2">
        <DenimPanel
          src="/images/products/product6.png"
          alt="Model sitting wearing Heritage Oval sunglasses"
          className="aspect-square w-full"
          imageClassName="object-[center_22%]"
        />
        <DenimPanel
          src="/images/products/product7.png"
          alt="Model sitting wearing transparent optical frames beside greenery"
          className="aspect-square w-full"
          imageClassName="object-[center_32%]"
        />
      </div>

      <div className="relative overflow-hidden bg-white aspect-[17/9] md:aspect-[20/9]">
        <Image
          src="/images/products/product8.png"
          alt="Model reclining wearing custom Aviator sunglasses"
          fill
          sizes="100vw"
          className="object-cover object-[center_44%]"
        />

        <div className="absolute left-6 top-6 z-10 sm:left-10 sm:top-9">
        </div>
      </div>
    </section>
  )
}
