"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { ProductCardView } from "@/components/home/TrendingSection"
import type { ProductCard } from "@/components/product/productData"
import { motion } from "framer-motion"

export function EditsCarousel() {
  // Starts empty (placeholder cards below) and is filled only with real Shopify products. It used to start with
  // six made-up sample products, which ended up in the page HTML and in Google as links to pages that 404.
  const [products, setProducts] = useState<ProductCard[]>([])
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  useEffect(() => {
    let isMounted = true
    import("@/lib/shopify-adapter").then(async ({ getShopifyCollectionProducts, getShopifyProducts }) => {
      // The Shopify "edits" collection, so this carousel and its "View all" (/collections?category=edits) match
      const edits = await getShopifyCollectionProducts("edits", 16)
      if (!isMounted) return
      if (edits.length > 0) {
        setProducts(edits)
        return
      }
      // Fallback if the collection can't be loaded: part of the catalogue, as before
      const liveProducts = await getShopifyProducts(16)
      if (isMounted && liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts.length > 4 ? liveProducts.slice(4) : liveProducts)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!api) return

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    updateScrollState()
    api.on("select", updateScrollState)
    api.on("reInit", updateScrollState)

    return () => {
      api.off("select", updateScrollState)
      api.off("reInit", updateScrollState)
    }
  }, [api])

  return (
    <section
      id="curated-edits"
      className="w-full bg-[#0F0F10] px-4 pt-14 pb-12 sm:px-6 lg:px-8 md:pt-16 md:pb-16 text-white"
    >
      {/* Section header with Prev/Next Controls */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between text-center sm:text-left items-center sm:items-start"
      >
        <div className="flex flex-col items-center sm:items-start">
          <p className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#C9B07A] mb-1">
            Curated Selections
          </p>
          <h2 className="font-heading text-[22px] sm:text-3xl md:text-[40px] font-semibold uppercase leading-none tracking-tight text-white flex items-center">
            Edits
            <span className="inline-block size-2 rounded-full bg-[#C9B07A] ml-2 align-middle" />
          </h2>
        </div>

        {/* Carousel Arrow Controls for Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous curated edit"
            disabled={!canScrollPrev}
            onClick={() => api?.scrollPrev()}
            className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:bg-white hover:text-black hover:border-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft className="size-4 stroke-[1.8]" />
          </button>
          <button
            type="button"
            aria-label="Next curated edit"
            disabled={!canScrollNext}
            onClick={() => api?.scrollNext()}
            className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:bg-white hover:text-black hover:border-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowRight className="size-4 stroke-[1.8]" />
          </button>
        </div>
      </motion.div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
        aria-label="Curated Edits product carousel"
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {products.length === 0
            ? Array.from({ length: 4 }).map((_, idx) => (
                <CarouselItem
                  key={`edits-skeleton-${idx}`}
                  className="pl-3 sm:pl-4 basis-[74%] sm:basis-[48%] md:basis-[36%] lg:basis-[25%]"
                  aria-hidden
                >
                  <div className="animate-pulse">
                    <div className="aspect-square w-full rounded-[12px] sm:rounded-[14px] bg-white/[0.06]" />
                    <div className="mt-2.5 space-y-1.5 px-0.5">
                      <div className="h-3.5 w-3/4 rounded-sm bg-white/[0.06]" />
                      <div className="h-3 w-1/3 rounded-sm bg-white/[0.06]" />
                    </div>
                  </div>
                </CarouselItem>
              ))
            : null}
          {products.map((product, idx) => (
            <CarouselItem
              key={product.id}
              className="pl-3 sm:pl-4 basis-[74%] sm:basis-[48%] md:basis-[36%] lg:basis-[25%]"
            >
              <ProductCardView product={product} theme="dark" index={idx} verticalNavigation={true} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Bottom CTA to view full curated collection */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 flex justify-center"
      >
        <Link
          href="/collections?category=edits"
          className="inline-flex h-9 items-center justify-center border border-white/30 text-white px-6 text-[0.6875rem] uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-black hover:border-white font-medium cursor-pointer"
        >
          Explore All Curations
        </Link>
      </motion.div>
    </section>
  )
}
