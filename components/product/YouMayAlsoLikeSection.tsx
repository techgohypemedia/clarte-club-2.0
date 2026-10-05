"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

import { ProductCardView } from "@/components/home/TrendingSection"
import type { ProductCard } from "@/components/product/productData"

export function YouMayAlsoLikeSection({
  currentHandle = "",
  currentId = "",
  currentTitle = "",
}: {
  currentHandle?: string
  currentId?: string
  currentTitle?: string
}) {
  const [products, setProducts] = useState<ProductCard[]>([])

  useEffect(() => {
    let isMounted = true
    import("@/lib/shopify-adapter").then(({ getShopifyProducts }) => {
      getShopifyProducts(16).then((liveProducts) => {
        if (isMounted && liveProducts && liveProducts.length > 0) {
          const normHandle = currentHandle.toLowerCase().trim()
          const normTitle = currentTitle.toLowerCase().trim()
          const normId = String(currentId).toLowerCase().trim()

          // Exclude the current viewing product by handle, ID, or title
          const filtered = liveProducts.filter((p) => {
            const pHandle = (p.handle || "").toLowerCase().trim()
            const pId = String(p.id || "").toLowerCase().trim()
            const pMerchId = String(p.merchandiseId || "").toLowerCase().trim()
            const pName = (p.name || "").toLowerCase().trim()

            if (normHandle && pHandle) {
              if (pHandle === normHandle || pHandle.includes(normHandle) || normHandle.includes(pHandle)) {
                return false
              }
            }

            if (normId && (pId === normId || pMerchId === normId)) {
              return false
            }

            if (normTitle && pName) {
              if (pName === normTitle || pName.includes(normTitle) || normTitle.includes(pName)) {
                return false
              }
            }

            return true
          })

          setProducts(filtered.slice(0, 4))
        }
      })
    })
    return () => {
      isMounted = false
    }
  }, [currentHandle, currentId, currentTitle])

  if (products.length === 0) return null

  return (
    <section className="w-full bg-white px-2.5 sm:px-6 lg:px-8 pb-14 pt-10 sm:pt-16 text-black border-t border-black/15">
      <div className="w-full">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 sm:mb-12 space-y-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Recommendations
          </p>
          <h2 className="font-heading text-[22px] sm:text-3xl md:text-[40px] font-semibold uppercase leading-none tracking-tight">
            You May Also Like
          </h2>
          <div className="mx-auto h-[1px] w-16 bg-black/10 pt-1" />
        </motion.div>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 gap-y-4 sm:gap-y-6">
          {products.map((product, idx) => (
            <ProductCardView key={product.id} product={product} index={idx} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/collections"
            className="inline-flex h-9 min-w-[102px] items-center justify-center border border-black px-6 text-[0.75rem] uppercase tracking-[0.08em] transition-colors hover:bg-black hover:text-white font-medium"
          >
            View All
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
