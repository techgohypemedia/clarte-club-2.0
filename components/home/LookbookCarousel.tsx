"use client"

import Image from "next/image"



import SimpleMarquee from "@/components/fancy/blocks/simple-marquee"

type LookbookSlide = {
  id: string
  image: string
  alt: string
  username: string
  caption: string
  time: string
  imagePos?: string
}

const track1: LookbookSlide[] = [
  { id: "t1-1", image: "/images/products/product9.png",       alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "2 hours ago",  imagePos: "center 16%" },
  { id: "t1-2", image: "/images/products/product10.png",      alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "5 hours ago",  imagePos: "center 14%" },
  { id: "t1-3", image: "/images/products/product11.png",      alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "10 hours ago", imagePos: "center 20%" },
  { id: "t1-4", image: "/images/products/product12.png",      alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "23 hours ago", imagePos: "center 22%" },
  { id: "t1-5", image: "/images/products/product13.png",      alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "1 hour ago",   imagePos: "center 18%" },
  { id: "t1-6", image: "/images/products/product14.png",      alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "8 hours ago",  imagePos: "center 24%" },
]

const track2: LookbookSlide[] = [
  { id: "t2-1", image: "/images/products/product14.png",      alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "3 hours ago",  imagePos: "center 24%" },
  { id: "t2-2", image: "/images/products/product5-white.png", alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "15 hours ago", imagePos: "center 32%" },
  { id: "t2-3", image: "/images/products/product9.png",       alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "20 hours ago", imagePos: "center 44%" },
  { id: "t2-4", image: "/images/products/product10.png",      alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "7 hours ago",  imagePos: "center 14%" },
  { id: "t2-5", image: "/images/products/product11.png",      alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "12 hours ago", imagePos: "center 20%" },
  { id: "t2-6", image: "/images/products/product12.png",      alt: "Style with Clarté frames", username: "street_style", caption: "Loving my new shades from @clarteclub", time: "18 hours ago", imagePos: "center 22%" },
]



function SocialCard({ slide }: { slide: LookbookSlide }) {
  return (
    <article
      className="group relative mx-2 h-[370px] w-[210px] shrink-0 overflow-hidden rounded-xl bg-zinc-950"
    >
      <Image
        src={slide.image}
        alt={slide.alt}
        fill
        sizes="210px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ objectPosition: slide.imagePos ?? "center" }}
      />

    </article>
  )
}

export function LookbookCarousel() {
  return (
    <section
      className="w-full overflow-hidden py-12 md:py-16"
      style={{ background: "#0F0F10" }}
    >
      {/* Heading */}
      <div className="mb-10 text-center">
        <p
          className="mb-2 uppercase"
          style={{ fontSize: "0.5rem", letterSpacing: "0.32em", color: "#8A8072" }}
        >
          Community
        </p>
        <h2 className="font-heading text-[22px] sm:text-3xl md:text-[40px] font-semibold uppercase leading-none tracking-tight text-white">
          As Seen On
        </h2>
        <div
          className="mx-auto mt-3"
          style={{ width: "32px", height: "1px", background: "#C9B07A" }}
        />
      </div>

      {/* Row 1 — scrolls LEFT */}
      <SimpleMarquee
        direction="left"
        baseVelocity={20}
        slowdownOnHover
        slowDownFactor={0}
        useScrollVelocity={false}
        scrollAwareDirection={false}
        scrollSpringConfig={{ damping: 40, stiffness: 200 }}
        repeat={4}
        className="overflow-hidden"
      >
        {track1.map((slide) => (
          <SocialCard key={slide.id} slide={slide} />
        ))}
      </SimpleMarquee>

      <div className="mt-3" />

      {/* Row 2 — scrolls RIGHT */}
      <SimpleMarquee
        direction="right"
        baseVelocity={16}
        slowdownOnHover
        slowDownFactor={0}
        useScrollVelocity={false}
        scrollAwareDirection={false}
        scrollSpringConfig={{ damping: 40, stiffness: 200 }}
        repeat={4}
        className="overflow-hidden"
      >
        {track2.map((slide) => (
          <SocialCard key={slide.id} slide={slide} />
        ))}
      </SimpleMarquee>
    </section>
  )
}
