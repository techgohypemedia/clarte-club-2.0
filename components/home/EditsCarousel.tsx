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

export const curatedEditsProducts: ProductCard[] = [
  {
    id: "edit-atelier-hexagon",
    name: "Atelier Hexagon",
    price: "₹ 12,500",
    category: "Atelier",
    type: "Sunglasses",
    shape: "hexagon",
    material: "titanium",
    colorGroup: "monochrome",
    image: "/images/products/product7.png",
    alt: "Atelier Hexagon sculpted titanium frame in noir finish",
    badge: "CURATED EDIT",
    swatches: ["#111722", "#6f5639"],
    gallery: [
      "/images/products/product7.png",
      "/images/products/product11.png",
      "/images/products/product15.png",
      "/images/products/product3.png",
    ],
  },
  {
    id: "edit-crystal-cateye",
    name: "Crystal Cateye",
    price: "₹ 9,800",
    category: "Crystal",
    type: "Sunglasses",
    shape: "cat-eye",
    material: "clear crystal",
    colorGroup: "gold",
    image: "/images/products/product6.png",
    alt: "Crystal Cateye sunglasses in translucent smoke finish",
    badge: "LIMITED RELEASE",
    swatches: ["#ebe8e1", "#111722"],
    gallery: [
      "/images/products/product6.png",
      "/images/products/product10.png",
      "/images/products/product14.png",
      "/images/products/product2.png",
    ],
  },
  {
    id: "edit-atelier-panto",
    name: "Atelier Panto",
    price: "₹ 13,000",
    category: "Atelier",
    type: "Optical",
    shape: "round",
    material: "titanium",
    colorGroup: "monochrome",
    image: "/images/products/product8.png",
    alt: "Atelier Panto architectural titanium optical frames",
    badge: "ATELIER PIECE",
    swatches: ["#000000", "#ebe8e1"],
    gallery: [
      "/images/products/product8.png",
      "/images/products/product12.png",
      "/images/products/product4.png",
      "/images/products/product1.png",
    ],
  },
  {
    id: "edit-crystal-round",
    name: "Crystal Round",
    price: "₹ 9,200",
    category: "Crystal",
    type: "Optical",
    shape: "round",
    material: "clear crystal",
    colorGroup: "crystal",
    image: "/images/products/product5.png",
    alt: "Crystal Round transparent bio-acetate optical frames",
    badge: "EDITORIAL EDIT",
    swatches: ["#ebe8e1", "#5b82ab"],
    gallery: [
      "/images/products/product5.png",
      "/images/products/product9.png",
      "/images/products/product13.png",
      "/images/products/product1.png",
    ],
  },
  {
    id: "edit-noir-dframe",
    name: "Noir D-Frame",
    price: "₹ 11,000",
    category: "Noir",
    type: "Sunglasses",
    shape: "d-frame",
    material: "acetate",
    colorGroup: "tortoiseshell",
    image: "/images/products/product4.png",
    alt: "Noir D-Frame acetate sunglasses in tortoiseshell",
    badge: "SIGNATURE",
    swatches: ["#6f5639", "#000000"],
    gallery: [
      "/images/products/product4.png",
      "/images/products/product8.png",
      "/images/products/product12.png",
      "/images/products/product5-white.png",
    ],
  },
  {
    id: "edit-heritage-aviator",
    name: "Heritage Aviator",
    price: "₹ 9,500",
    category: "Heritage",
    type: "Sunglasses",
    shape: "aviator",
    material: "titanium",
    colorGroup: "blue",
    image: "/images/products/product2.png",
    alt: "Heritage Aviator sunglasses with dark metal frame",
    badge: "COLLECTOR",
    swatches: ["#5b82ab", "#111722"],
    gallery: [
      "/images/products/product2.png",
      "/images/products/product6.png",
      "/images/products/product10.png",
      "/images/products/product14.png",
    ],
  },
]

export function EditsCarousel() {
  const [products, setProducts] = useState<ProductCard[]>([])
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  useEffect(() => {
    let isMounted = true
    import("@/lib/shopify-adapter").then(({ getShopifyProducts }) => {
      getShopifyProducts(16).then((liveProducts) => {
        if (isMounted && liveProducts && liveProducts.length > 0) {
          // Use products for curated edits
          const curatedSlice = liveProducts.length > 4 ? liveProducts.slice(4) : liveProducts
          if (curatedSlice.length > 0) {
            setProducts(curatedSlice)
          }
        }
      })
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
      <div className="mb-8 flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between text-center sm:text-left items-center sm:items-start">
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
      </div>

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
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-3 sm:pl-4 basis-[74%] sm:basis-[48%] md:basis-[36%] lg:basis-[25%]"
            >
              <ProductCardView product={product} theme="dark" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Bottom CTA to view full curated collection */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/collections?category=edits"
          className="inline-flex h-9 items-center justify-center border border-white/30 text-white px-6 text-[0.6875rem] uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-black hover:border-white font-medium cursor-pointer"
        >
          Explore All Curations
        </Link>
      </div>
    </section>
  )
}
