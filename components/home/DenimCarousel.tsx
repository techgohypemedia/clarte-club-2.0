"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type DenimSlide = {
  title: string
  subtitle: string
  categorySlug: string
  image: string
  alt: string
}

const denimSlides: DenimSlide[] = [
  {
    title: "NOIR COLLECTION",
    subtitle: "Deep, Structural Blacks & Architectural Lines",
    categorySlug: "noir",
    image: "/images/products/product1.png",
    alt: "Noir Collection featured eyewear",
  },
  {
    title: "HERITAGE COLLECTION",
    subtitle: "Warm Tortoise Tones & Classic Craftsmanship",
    categorySlug: "heritage",
    image: "/images/products/product4.png",
    alt: "Heritage Collection featured eyewear",
  },
  {
    title: "CRYSTAL COLLECTION",
    subtitle: "Translucent Smoke & Clear Bio-Acetate Silhouettes",
    categorySlug: "crystal",
    image: "/images/products/product3.png",
    alt: "Crystal Collection featured eyewear",
  },
  {
    title: "ATELIER COLLECTION",
    subtitle: "Limited-Batch Precision Hardware & Bold Profiles",
    categorySlug: "atelier",
    image: "/images/products/product2.png",
    alt: "Atelier Collection featured eyewear",
  },
]

function DenimSlideCard({ slide }: { slide: DenimSlide }) {
  return (
    <Link
      href={`/collections?category=${slide.categorySlug}`}
      className="group relative block h-[500px] w-full overflow-hidden bg-white sm:h-[580px] md:h-[640px] lg:h-[700px]"
    >
      <Image
        src={slide.image}
        alt={slide.alt}
        fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 64vw, 627px"
        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
        priority={false}
      />

      {/* Vignette Overlay for readability */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
      />

      <div className="absolute inset-x-6 bottom-14 z-10 text-white space-y-1">
        <h3
          className="font-semibold uppercase tracking-[0.1em]"
          style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.75rem)" }}
        >
          {slide.title}
        </h3>
      </div>
    </Link>
  )
}

export function DenimCarousel() {
  const [slides, setSlides] = useState<DenimSlide[]>(denimSlides)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    let isMounted = true
    import("@/lib/shopify-adapter").then(({ getShopifyCollectionBanners }) => {
      getShopifyCollectionBanners().then((liveBanners) => {
        if (!isMounted || !liveBanners || liveBanners.length === 0) return
        setSlides((prev) =>
          prev.map((defaultSlide) => {
            const match = liveBanners.find(
              (b) => b.categorySlug.toLowerCase() === defaultSlide.categorySlug.toLowerCase()
            )
            if (match && match.image) {
              return {
                ...defaultSlide,
                image: match.image,
                alt: match.alt || defaultSlide.alt,
                title: match.title || defaultSlide.title,
                subtitle: match.subtitle || defaultSlide.subtitle,
              }
            }
            return defaultSlide
          })
        )
      })
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [api, current])

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-white pb-16 pt-10 text-black md:pb-20"
    >
      <div className="relative w-full">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          aria-label="Eyewear collection carousel"
        >
          <CarouselContent className="-ml-1.5">
            {slides.map((slide) => (
              <CarouselItem
                key={slide.title}
                className="basis-[92%] pl-1.5 sm:basis-[72%] md:basis-[48%] lg:basis-1/3"
              >
                <DenimSlideCard slide={slide} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Progress Indicators overlaying the bottom center */}
        {count > 0 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
            {Array.from({ length: count }).map((_, index) => {
              const isActive = index === current
              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-pressed={isActive}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "relative overflow-hidden transition-all duration-300",
                    isActive
                      ? "h-[2.5px] w-8 rounded-full bg-white/30"
                      : "h-1.5 w-1.5 rounded-full bg-white/45 hover:bg-white/70"
                  )}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-0 bottom-0 bg-[#C9B07A]"
                      style={{
                        animation: "hero-progress 5000ms linear forwards",
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </motion.section>
  )
}

