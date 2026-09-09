"use client"

import { useState, useEffect } from "react"
import { ProductCardView } from "@/components/home/TrendingSection"
import { collectionProducts } from "@/components/collection/collectionData"
import type { ProductCard } from "@/components/product/productData"
import { motion, AnimatePresence } from "motion/react"

export function CollectionGrid({
  selectedCategory,
  selectedType,
  selectedShape,
  selectedMaterial,
  selectedColor,
  sortBy,
  onProductCountChange,
}: {
  selectedCategory: string | null
  selectedType: string | null
  selectedShape?: string | null
  selectedMaterial?: string | null
  selectedColor?: string | null
  sortBy: string
  onProductCountChange?: (count: number) => void
}) {
  const [products, setProducts] = useState<ProductCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    import("@/lib/shopify-adapter").then(({ getShopifyProducts, getShopifyCollectionProducts }) => {
      const fetcher = selectedCategory
        ? getShopifyCollectionProducts(selectedCategory.toLowerCase())
        : getShopifyProducts(50)

      fetcher.then((liveProducts) => {
        if (!isMounted) return
        if (liveProducts && liveProducts.length > 0) {
          setProducts(liveProducts)
        } else {
          // If collection fetch returned empty, fetch all catalog products as fallback
          getShopifyProducts(50).then((allProds) => {
            if (isMounted && allProds && allProds.length > 0) {
              setProducts(allProds)
            }
          })
        }
        setLoading(false)
      })
    })
    return () => {
      isMounted = false
    }
  }, [selectedCategory])

  // Filter products based on selected states
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === null ||
      !product.category ||
      product.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory.toLowerCase() === "noyer" && (product.category.toLowerCase() === "noir" || product.category.toLowerCase() === "noyer")) ||
      (selectedCategory.toLowerCase() === "noir" && (product.category.toLowerCase() === "noyer" || product.category.toLowerCase() === "noir")) ||
      (selectedCategory.toLowerCase() === "edits" && (product.category.toLowerCase() === "edits" || product.category.toLowerCase() === "curated"))

    const matchesType = selectedType === null || !product.type || product.type.toLowerCase() === selectedType.toLowerCase()
    const matchesShape = !selectedShape || (product.shape && product.shape.toLowerCase().includes(selectedShape))
    const matchesMaterial = !selectedMaterial || (product.material && product.material.toLowerCase().includes(selectedMaterial))
    const matchesColor = !selectedColor || (product.colorGroup && product.colorGroup.toLowerCase().includes(selectedColor))

    return (selectedCategory ? true : matchesCategory) && matchesType && matchesShape && matchesMaterial && matchesColor
  })

  useEffect(() => {
    onProductCountChange?.(filteredProducts.length)
  }, [filteredProducts.length, onProductCountChange])

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

  if (sortedProducts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center border border-black/10 py-24 px-6 text-center bg-[#ebe8e1]/10 backdrop-blur-sm"
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

  return (
    <motion.div layout className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {sortedProducts.map((product) => (
          <motion.div
            layout
            key={product.id}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -16 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1], // easeOutExpo
            }}
          >
            <ProductCardView product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
