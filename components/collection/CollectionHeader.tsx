"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, X } from "lucide-react"
import { collectionProducts } from "@/components/collection/collectionData"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

export function CollectionHeader({
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  productCount,
}: {
  selectedCategory: string | null
  setSelectedCategory: (cat: string | null) => void
  selectedType: string | null
  setSelectedType: (type: string | null) => void
  sortBy: string
  setSortBy: (sort: string) => void
  productCount?: number
}) {
  const [sortOpen, setSortOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  
  const sortRef = useRef<HTMLDivElement>(null)
  const desktopTypeRef = useRef<HTMLDivElement>(null)
  const mobileTypeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false)
      }
      if (
        (!desktopTypeRef.current || !desktopTypeRef.current.contains(event.target as Node)) &&
        (!mobileTypeRef.current || !mobileTypeRef.current.contains(event.target as Node))
      ) {
        setTypeOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClearFilters = () => {
    setSelectedCategory(null)
    setSelectedType(null)
    setTypeOpen(false)
  }

  const filteredCount = collectionProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === null ||
      !product.category ||
      product.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory.toLowerCase() === "noyer" && product.category.toLowerCase() === "noir") ||
      (selectedCategory.toLowerCase() === "noir" && product.category.toLowerCase() === "noyer") ||
      (selectedCategory.toLowerCase() === "edits" && (product.category.toLowerCase() === "edits" || product.category.toLowerCase() === "curated"))
    const matchesType = selectedType === null || product.type === selectedType
    return matchesCategory && matchesType
  }).length

  const sortOptions = [
    { value: "bestseller", label: "Bestseller" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Alphabetical (A - Z)" },
  ]

  const categories = [
    { value: null, label: "ALL" },
    { value: "Edits", label: "EDITS" },
    { value: "Heritage", label: "HERITAGE" },
    { value: "Noyer", label: "NOYER" },
    { value: "Crystal", label: "CRYSTAL" },
    { value: "Atelier", label: "ATELIER" },
  ]

  const types = [
    { value: null, label: "Type: All" },
    { value: "Sunglasses", label: "Sunglasses" },
    { value: "Optical", label: "Optical" },
  ]

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Bestseller"
  const currentTypeLabel = types.find(t => t.value === selectedType)?.label || "Type: All"
  const hasActiveFilters = selectedCategory !== null || selectedType !== null

  return (
    <header className="w-full">
      <div className="flex flex-col gap-6">
        {/* Title area */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.2em] text-black/35 uppercase">
            <Link href="/" className="hover:text-black transition-colors cursor-pointer">
              Home
            </Link>
            <span className="text-black/15 font-light">/</span>
            <Link href="/" className="hover:text-black transition-colors cursor-pointer text-black/55">
              Clarté Club
            </Link>
          </div>
          <div className="max-w-[700px] space-y-3 flex flex-col items-center">
            <h1 className="font-heading text-[22px] xs:text-[26px] sm:text-[32px] md:text-[clamp(2.2rem,4vw,4.2rem)] font-extrabold uppercase leading-none tracking-tight text-black whitespace-nowrap">
              Eyewear Collection
            </h1>
            <p className="text-[12px] sm:text-[13px] leading-relaxed text-black/60 font-medium tracking-[0.03em] max-w-[800px] md:max-w-none md:whitespace-nowrap text-center uppercase">
              Considered eyewear bridging structural geometry and effortless silhouettes.
            </p>
          </div>
        </div>

        {/* Controls: Divider + Filters & Sorting Card */}
        <div className="bg-[#fcfbfa] border border-black/10 py-3 px-3.5 sm:px-6 mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-xl sm:rounded-2xl shadow-sm w-full relative z-20">
          
          {/* Mobile view: Row 1 has Sort (left) & Type (right) */}
          {/* Desktop view: Left side has Sort, Right side has Category Tabs + Type + Clear */}
          <div className="flex items-center justify-between lg:justify-start w-full lg:w-auto gap-2 sm:gap-6 pt-2.5 lg:pt-0 border-t border-black/5 lg:border-t-0 order-2 lg:order-1 min-w-0">
            {/* Sort Dropdown */}
            <div ref={sortRef} className="relative z-40 shrink-0">
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="inline-flex items-center gap-1 sm:gap-1.5 transition-colors hover:text-black font-semibold cursor-pointer py-1 text-[10px] xs:text-[11px] sm:text-[12px] tracking-[0.08em] sm:tracking-[0.1em] uppercase whitespace-nowrap"
              >
                <span className="font-medium text-black/40 whitespace-nowrap">SORT BY:</span>
                <span className="font-semibold text-black underline underline-offset-4 decoration-black/20 hover:decoration-black whitespace-nowrap max-w-[110px] xs:max-w-none truncate">{currentSortLabel}</span>
                <ChevronDown className={cn("size-3.5 stroke-[2] transition-transform duration-200 shrink-0", sortOpen && "rotate-180")} />
              </button>

              {sortOpen && (
                <ul className="absolute left-0 top-full mt-2 w-[200px] border border-black/15 bg-white shadow-xl py-1.5 z-50 overflow-hidden rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  {sortOptions.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy(opt.value)
                          setSortOpen(false)
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition-colors hover:bg-[#F6F2EA] hover:text-black text-black cursor-pointer bg-white",
                          sortBy === opt.value && "bg-[#ebe8e1] font-semibold"
                        )}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Mobile-only Type Filter & Clear Button (on the right corner) */}
            <div className="flex items-center gap-2 sm:gap-3 lg:hidden shrink-0">
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1 transition-colors text-black/45 hover:text-black font-semibold cursor-pointer py-1 text-[10px] xs:text-[11px] tracking-[0.08em] uppercase whitespace-nowrap"
                  >
                    <X className="size-3 stroke-[2]" />
                    <span>Clear</span>
                  </motion.button>
                )}
              </AnimatePresence>

              <div ref={mobileTypeRef} className="relative z-30">
                <button
                  type="button"
                  onClick={() => setTypeOpen(!typeOpen)}
                  className="inline-flex items-center gap-1 sm:gap-1.5 transition-colors hover:text-black font-semibold cursor-pointer py-1 text-[10px] xs:text-[11px] tracking-[0.08em] uppercase whitespace-nowrap"
                >
                  <span className="font-medium text-black/40 whitespace-nowrap">TYPE:</span>
                  <span className="font-semibold text-black underline underline-offset-4 decoration-black/20 hover:decoration-black whitespace-nowrap">
                    {types.find(t => t.value === selectedType)?.label.replace("Type: ", "") || "All"}
                  </span>
                  <ChevronDown className={cn("size-3.5 stroke-[2] transition-transform duration-200 shrink-0", typeOpen && "rotate-180")} />
                </button>

                {typeOpen && (
                  <ul className="absolute right-0 top-full mt-2 w-[160px] border border-black/15 bg-white shadow-xl py-1.5 z-50 overflow-hidden rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {types.map((opt) => (
                      <li key={opt.label}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedType(opt.value)
                            setTypeOpen(false)
                          }}
                          className={cn(
                            "w-full px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition-colors hover:bg-[#F6F2EA] hover:text-black text-black cursor-pointer bg-white",
                            selectedType === opt.value && "bg-[#ebe8e1] font-semibold"
                          )}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Desktop & Mobile Category Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-8 w-full lg:w-auto order-1 lg:order-2">
            {/* Category Tabs */}
            <nav aria-label="Collection categories" className="flex items-center py-1 overflow-x-auto no-scrollbar w-full lg:w-auto [mask-image:linear-gradient(to_right,black_84%,transparent_100%)] lg:[mask-image:none]">
              <ul className="flex items-center gap-x-4.5 sm:gap-x-6 lg:gap-x-8 text-[11px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.value
                  return (
                    <li key={cat.label || "all"} className="relative py-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(cat.value)}
                        className={cn(
                          "transition-colors duration-300 relative pb-1 cursor-pointer focus:outline-none text-[11px] tracking-[0.16em] uppercase",
                          isActive ? "text-black font-semibold" : "text-black/40 hover:text-black/85"
                        )}
                      >
                        {cat.label}
                        {isActive && (
                          <motion.span
                            layoutId="activeCategoryUnderline"
                            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9B07A]"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Desktop-only Type Filter and Clear Button */}
            <div className="hidden lg:flex items-center gap-3 sm:gap-4 shrink-0">
              <div ref={desktopTypeRef} className="relative z-30">
                <button
                  type="button"
                  onClick={() => setTypeOpen(!typeOpen)}
                  className={cn(
                    "h-10 border border-black/15 bg-[#F6F2EA] pl-4 pr-10 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all hover:border-black cursor-pointer outline-none flex items-center justify-between gap-3 min-w-[140px] relative rounded-lg",
                    (typeOpen || selectedType) && "border-black bg-white"
                  )}
                >
                  <span>{currentTypeLabel}</span>
                  {selectedType && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C9B07A]" />
                  )}
                  <ChevronDown className={cn("size-3.5 stroke-[2] absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200", typeOpen && "rotate-180")} />
                </button>

                {typeOpen && (
                  <ul className="absolute right-0 top-full mt-2 w-[160px] border border-black/15 bg-white shadow-xl py-1.5 z-50 overflow-hidden rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {types.map((opt) => (
                      <li key={opt.label}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedType(opt.value)
                            setTypeOpen(false)
                          }}
                          className={cn(
                            "w-full px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition-colors hover:bg-[#F6F2EA] hover:text-black text-black cursor-pointer bg-white",
                            selectedType === opt.value && "bg-[#ebe8e1] font-semibold"
                          )}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Clear Filters Button (Desktop) */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1.5 h-10 border border-black/15 bg-white hover:border-black px-4 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 cursor-pointer text-black rounded-lg"
                  >
                    <X className="size-3.5 stroke-[2.2]" />
                    <span>Clear</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            


          </div>
        </div>

        {/* Right-aligned Frames Counter */}
        <div className="flex justify-end text-[10px] font-semibold tracking-[0.18em] text-black/45 uppercase -mt-3.5">
          ({typeof productCount === "number" ? productCount : filteredCount} {(typeof productCount === "number" ? productCount : filteredCount) === 1 ? 'Frame' : 'Frames'} Available)
        </div>
      </div>
    </header>
  )
}
