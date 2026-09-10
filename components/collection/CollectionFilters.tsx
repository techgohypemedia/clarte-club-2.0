"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, X } from "lucide-react"

export function CollectionFilters({
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedShape,
  setSelectedShape,
}: {
  selectedCategory: string | null
  setSelectedCategory: (cat: string | null) => void
  selectedType: string | null
  setSelectedType: (type: string | null) => void
  selectedShape?: string | null
  setSelectedShape?: (shape: string | null) => void
}) {
  const hasActiveFilters = selectedCategory !== null || selectedType !== null || (selectedShape ?? null) !== null
  const [typeOpen, setTypeOpen] = useState(false)
  const [shapeOpen, setShapeOpen] = useState(false)
  const typeRef = useRef<HTMLDivElement>(null)
  const shapeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeOpen(false)
      }
      if (shapeRef.current && !shapeRef.current.contains(event.target as Node)) {
        setShapeOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClearFilters = () => {
    setSelectedCategory(null)
    setSelectedType(null)
    if (setSelectedShape) setSelectedShape(null)
    setTypeOpen(false)
    setShapeOpen(false)
  }

  const categories = [
    { value: null, label: "ALL" },
    { value: "Noir", label: "NOIR" },
    { value: "Heritage", label: "HERITAGE" },
    { value: "Crystal", label: "CRYSTAL" },
    { value: "Atelier", label: "ATELIER" },
  ]

  const types = [
    { value: null, label: "Type: All" },
    { value: "Sunglasses", label: "Sunglasses" },
    { value: "Eyeglasses", label: "Eyeglasses" },
  ]

  const shapes = [
    { value: null, label: "Shape: All" },
    { value: "Oval", label: "Oval" },
    { value: "Square", label: "Square" },
    { value: "Aviator", label: "Aviator" },
    { value: "D-Frame", label: "D-Frame" },
  ]

  const currentTypeLabel = types.find(t => t.value === selectedType)?.label || "Type: All"
  const currentShapeLabel = shapes.find(s => s.value === selectedShape)?.label || "Shape: All"

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-5 sm:gap-6 lg:gap-8 w-full lg:w-auto">
      {/* Category Tabs */}
      <nav aria-label="Collection categories" className="flex items-center py-1 overflow-x-auto no-scrollbar max-w-full">
        <ul className="flex items-center gap-x-6 sm:gap-x-7 lg:gap-x-8 text-[11px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap">
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

      {/* Dropdown Filters and Clear Button */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Frame Type Selection */}
        <div ref={typeRef} className="relative z-30">
          <button
            type="button"
            onClick={() => {
              setTypeOpen(!typeOpen)
              setShapeOpen(false)
            }}
            className={cn(
              "h-10 border border-black/15 bg-[#F6F2EA] pl-4 pr-10 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all hover:border-black cursor-pointer outline-none flex items-center justify-between gap-3 min-w-[130px] relative rounded-none",
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
            <ul className="absolute right-0 top-full mt-2 w-[160px] border border-black bg-white shadow-xl py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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

        {/* Frame Shape Selection Dropdown */}
        {setSelectedShape ? (
          <div ref={shapeRef} className="relative z-30">
            <button
              type="button"
              onClick={() => {
                setShapeOpen(!shapeOpen)
                setTypeOpen(false)
              }}
              className={cn(
                "h-10 border border-black/15 bg-[#F6F2EA] pl-4 pr-10 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all hover:border-black cursor-pointer outline-none flex items-center justify-between gap-3 min-w-[130px] relative rounded-none",
                (shapeOpen || selectedShape) && "border-black bg-white"
              )}
            >
              <span>{currentShapeLabel}</span>
              {selectedShape && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C9B07A]" />
              )}
              <ChevronDown className={cn("size-3.5 stroke-[2] absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200", shapeOpen && "rotate-180")} />
            </button>

            {shapeOpen && (
              <ul className="absolute right-0 top-full mt-2 w-[160px] border border-black bg-white shadow-xl py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {shapes.map((opt) => (
                  <li key={opt.label}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedShape(opt.value)
                        setShapeOpen(false)
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition-colors hover:bg-[#F6F2EA] hover:text-black text-black cursor-pointer bg-white",
                        selectedShape === opt.value && "bg-[#ebe8e1] font-semibold"
                      )}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {/* Clear Filters Button */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 h-10 border border-black/15 bg-white hover:border-black px-4 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 cursor-pointer text-black"
            >
              <X className="size-3.5 stroke-[2.2]" />
              <span>Clear</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
