"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CollectionGrid } from "@/components/collection/CollectionGrid"
import { CollectionBenefitsBar } from "@/components/collection/CollectionBenefitsBar"
import { CollectionHeader } from "@/components/collection/CollectionHeader"

function CollectionContent() {
  const searchParams = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("bestseller")

  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const typeParam = searchParams.get("type")
    const shapeParam = searchParams.get("shape")
    const materialParam = searchParams.get("material")
    const colorParam = searchParams.get("color")
    const filterParam = searchParams.get("filter")

    if (categoryParam) {
      const paramLower = categoryParam.toLowerCase()
      if (paramLower === "edits" || paramLower === "curated" || paramLower === "curations" || paramLower === "curated-edits") {
        setSelectedCategory("Edits")
      } else if (paramLower === "noir" || paramLower === "noyer") {
        setSelectedCategory("Noyer")
      } else if (paramLower === "heritage") {
        setSelectedCategory("Heritage")
      } else if (paramLower === "crystal") {
        setSelectedCategory("Crystal")
      } else if (paramLower === "atelier") {
        setSelectedCategory("Atelier")
      } else {
        setSelectedCategory(categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1))
      }
    } else {
      setSelectedCategory(null)
    }

    if (typeParam) {
      if (typeParam.toLowerCase().includes("sunglass")) setSelectedType("Sunglasses")
      else if (typeParam.toLowerCase().includes("opt")) setSelectedType("Optical")
      else setSelectedType(typeParam)
    } else {
      setSelectedType(null)
    }

    if (shapeParam) setSelectedShape(shapeParam.toLowerCase())
    else setSelectedShape(null)

    if (materialParam) setSelectedMaterial(materialParam.toLowerCase())
    else setSelectedMaterial(null)

    if (colorParam) setSelectedColor(colorParam.toLowerCase())
    else setSelectedColor(null)

    if (filterParam === "bestseller") setSortBy("bestseller")
  }, [searchParams])

  const [productCount, setProductCount] = useState<number | undefined>(undefined)

  return (
    <main className="flex-1 bg-[#fcfbfa] text-[#0F0F10]">
      <section className="w-full bg-[#fcfbfa] px-4 pt-8 pb-16 text-[#0F0F10] sm:px-6 lg:px-8 md:pt-10">
        <CollectionHeader 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          productCount={productCount}
        />

        <div className="mt-3.5">
          <CollectionGrid 
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            selectedShape={selectedShape}
            selectedMaterial={selectedMaterial}
            selectedColor={selectedColor}
            sortBy={sortBy}
            onProductCountChange={setProductCount}
          />
        </div>

        <CollectionBenefitsBar />
      </section>
    </main>
  )
}

export function CollectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CollectionContent />
    </Suspense>
  )
}
