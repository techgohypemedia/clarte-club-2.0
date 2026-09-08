"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { ProductCardView } from "@/components/home/TrendingSection"
import type { ProductCard } from "@/components/product/productData"

export function YouMayAlsoLikeSection({
  currentHandle = "",
}: {
  currentHandle?: string
}) {
  const [products, setProducts] = useState<ProductCard[]>([])

  useEffect(() => {
    let isMounted = true
    import("@/lib/shopify-adapter").then(({ getShopifyProducts }) => {
      getShopifyProducts(8).then((liveProducts) => {
        if (isMounted && liveProducts && liveProducts.length > 0) {
          const filtered = liveProducts.filter((p) => p.handle !== currentHandle).slice(0, 4)
          setProducts(filtered.length > 0 ? filtered : liveProducts.slice(0, 4))
        }
      })
    })
    return () => {
      isMounted = false
    }
  }, [currentHandle])

  if (products.length === 0) return null

  return (
    <section className="w-full bg-white px-4 pb-14 pt-12 sm:pt-16 text-black sm:px-6 lg:px-8 border-t border-black/15">
      <div className="w-full">
        {/* Section Title */}
        <div className="text-center mb-10 sm:mb-12 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Recommendations
          </p>
          <h2 className="font-heading text-[22px] sm:text-3xl md:text-[40px] font-semibold uppercase leading-none tracking-tight">
            You May Also Like
          </h2>
          <div className="mx-auto h-[1px] w-16 bg-black/10 pt-1" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCardView key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/collections"
            className="inline-flex h-9 min-w-[102px] items-center justify-center border border-black px-6 text-[0.75rem] uppercase tracking-[0.08em] transition-colors hover:bg-black hover:text-white font-medium"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}
