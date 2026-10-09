"use client"

import { useState, useEffect } from "react"
import { ProductCardView } from "@/components/home/TrendingSection"
import type { ProductCard } from "@/components/product/productData"
import { motion } from "motion/react"

// Tabs backed by a Shopify collection of the same handle. For these the grid shows exactly the products in that
// Shopify collection. (Each product also carries a single "category" label, but a frame can be in several
// collections, e.g. every Edits frame is also in Noir/Crystal/Atelier/Heritage, so filtering by that label hid
// all of Edits and part of Heritage.)
const SHOPIFY_COLLECTIONS = ["edits", "heritage", "noir", "crystal", "atelier"]
const ALL = "all"

// Per-tab results, kept for the page session so switching tabs is instant after the first load
const productCache = new Map<string, Promise<ProductCard[]>>()

function loadProducts(key: string): Promise<ProductCard[]> {
  let request = productCache.get(key)
  if (!request) {
    request = import("@/lib/shopify-adapter")
      .then(({ getShopifyProducts, getShopifyCollectionProducts }) =>
        key === ALL ? getShopifyProducts(50) : getShopifyCollectionProducts(key)
      )
      .then((products) => products ?? [])
      .catch(() => [] as ProductCard[])
    productCache.set(key, request)
    // Don't keep a failed/empty result forever: allow a retry on the next visit to the tab
    request.then((products) => {
      if (products.length === 0) productCache.delete(key)
    })
  }
  return request
}

function categoryKey(selectedCategory: string | null): string {
  if (!selectedCategory) return ALL
  const key = selectedCategory.toLowerCase()
  if (key === "noyer") return "noir"
  if (key === "curated" || key === "curations" || key === "curated-edits") return "edits"
  return key
}

export function CollectionGrid({
  selectedCategory,
  selectedType,
  selectedShape,
  selectedMaterial,
  selectedGender,
  selectedColor,
  sortBy,
  onProductCountChange,
}: {
  selectedCategory: string | null
  selectedType: string | null
  selectedShape?: string | null
  selectedMaterial?: string | null
  selectedGender?: string | null
  selectedColor?: string | null
  sortBy: string
  onProductCountChange?: (count: number | undefined) => void
}) {
  const key = categoryKey(selectedCategory)
  const isShopifyCollection = SHOPIFY_COLLECTIONS.includes(key)
  // Which tab the loaded products belong to; anything else means the current tab is still loading
  const [loaded, setLoaded] = useState<{ key: string; products: ProductCard[] } | null>(null)
  const loading = loaded?.key !== key

  useEffect(() => {
    let isMounted = true
    // Known collections: the Shopify collection itself. Any other category (e.g. from an old link): the full
    // catalogue, filtered by the product's label below.
    loadProducts(isShopifyCollection || key === ALL ? key : ALL).then((products) => {
      if (isMounted) setLoaded({ key, products })
      // Warm the other tabs in the background so switching is instant
      ;[ALL, ...SHOPIFY_COLLECTIONS].forEach((k) => void loadProducts(k))
    })
    return () => {
      isMounted = false
    }
  }, [key, isShopifyCollection])

  const products = loading ? [] : loaded?.products ?? []

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      key === ALL ||
      isShopifyCollection ||
      !product.category ||
      product.category.toLowerCase() === key

    const matchesType =
      selectedType === null ||
      !product.type ||
      product.type.toLowerCase() === selectedType.toLowerCase() ||
      (selectedType.toLowerCase() === "eyeglasses" && (product.type.toLowerCase() === "optical" || product.type.toLowerCase() === "eyeglasses"))

    const matchesGender =
      !selectedGender ||
      !product.gender ||
      product.gender.toLowerCase() === "unisex" ||
      product.gender.toLowerCase() === selectedGender.toLowerCase()

    const matchesShape = !selectedShape || (product.shape && product.shape.toLowerCase().includes(selectedShape))
    const matchesMaterial = !selectedMaterial || (product.material && product.material.toLowerCase().includes(selectedMaterial))
    const matchesColor = !selectedColor || (product.colorGroup && product.colorGroup.toLowerCase().includes(selectedColor))

    return matchesCategory && matchesType && matchesGender && matchesShape && matchesMaterial && matchesColor
  })

  // No count while loading, so the header never says "6 frames" over an empty grid
  const count = loading ? undefined : filteredProducts.length
  useEffect(() => {
    onProductCountChange?.(count)
  }, [count, onProductCountChange])

  // Sort products based on selected sort order
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      const priceA = parseInt((a.price || "").replace(/[^\d]/g, ""), 10) || 0
      const priceB = parseInt((b.price || "").replace(/[^\d]/g, ""), 10) || 0
      return priceA - priceB
    }
    if (sortBy === "price-desc") {
      const priceA = parseInt((a.price || "").replace(/[^\d]/g, ""), 10) || 0
      const priceB = parseInt((b.price || "").replace(/[^\d]/g, ""), 10) || 0
      return priceB - priceA
    }
    if (sortBy === "name-asc") {
      return (a.name || "").localeCompare(b.name || "")
    }
    // "bestseller" sorting: show BESTSELLER first
    const isBestA = a.badge === "BESTSELLER" ? 1 : 0
    const isBestB = b.badge === "BESTSELLER" ? 1 : 0
    if (isBestA !== isBestB) {
      return isBestB - isBestA
    }
    return 0 // Preserve original order
  })

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 gap-y-4 sm:gap-y-6" aria-busy="true" aria-label="Loading frames">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="flex w-full flex-col animate-pulse">
            <div className="relative aspect-square w-full rounded-[12px] sm:rounded-[14px] bg-neutral-100 border border-black/5" />
            <div className="mt-2.5 space-y-1.5 px-0.5">
              <div className="h-3.5 w-3/4 rounded-sm bg-neutral-100" />
              <div className="h-3 w-1/3 rounded-sm bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (sortedProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center border border-black/10 py-24 px-6 text-center bg-white shadow-sm"
      >
        <p className="font-heading text-[16px] sm:text-[18px] uppercase tracking-[0.18em] text-black/60 font-semibold">
          No frames found
        </p>
        <p className="text-[11px] sm:text-[12px] text-black/40 uppercase mt-3 tracking-[0.1em] max-w-[340px] leading-relaxed">
          There are no products matching your active filters. Try resetting the options to explore our signature collections.
        </p>
      </motion.div>
    )
  }

  // Keyed by tab so a new tab's cards animate in fresh. Cards are visible from the first frame (slide only, no
  // fade from transparent and no exit animation: those are what left the grid looking blank mid-switch).
  return (
    <div key={key} className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 gap-y-4 sm:gap-y-6">
      {sortedProducts.map((product, idx) => (
        <motion.div
          key={product.id}
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(idx, 7) * 0.03, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProductCardView product={product} index={idx} />
        </motion.div>
      ))}
    </div>
  )
}
