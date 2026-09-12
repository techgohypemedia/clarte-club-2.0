// Clarté Club - Considered Eyewear
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, X, ShoppingBag } from "lucide-react"

import { trendingProducts } from "@/components/product/productData"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"

type WishlistItem = {
  id: string
  image: string
  alt: string
  title: string
  price: string
  inStock: boolean
}

type WishlistSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WishlistSidebar({ open, onOpenChange }: WishlistSidebarProps) {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    if (open) {
      (window as any).lenis?.stop()
    } else {
      (window as any).lenis?.start()
    }
    return () => {
      (window as any).lenis?.start()
    }
  }, [open])

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="!z-[10000] bg-black/50 backdrop-blur-[1px]"
        className="!z-[10001] overflow-hidden border-l border-white/10 bg-black p-0 text-white shadow-[0_0_80px_rgba(0,0,0,0.45)] ease-in-out duration-300"
        style={{ width: "min(100vw, 420px)", maxWidth: "none" }}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-white">
              <Heart className="size-4 stroke-[2.4] text-[#C9B07A] fill-[#C9B07A]" />
              <span>{items.length} {items.length === 1 ? "ITEM" : "ITEMS"} IN WISHLIST</span>
            </div>

            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white/70 transition-opacity hover:opacity-100 cursor-pointer leading-none"
              >
                <span className="leading-none">CLOSE</span>
                <X className="size-4 stroke-[1.8] shrink-0 relative -top-[0.5px]" />
              </button>
            </SheetClose>
          </div>

          <SheetTitle className="sr-only">Wishlist</SheetTitle>
          <SheetDescription className="sr-only">
            Your wishlist items and quick actions to add to bag or remove.
          </SheetDescription>

          {/* List Container */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto px-5 py-6 space-y-6"
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <Heart className="size-10 text-white/20 stroke-[1.5]" />
                <p className="text-[12px] uppercase tracking-[0.15em] text-white/40">
                  Your wishlist is empty.
                </p>
                <Link
                  href="/collections"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex border border-white/40 px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <section className="space-y-6">
                {items.map((item) => (
                  <article key={item.id} className="grid grid-cols-[90px_minmax(0,1fr)] gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                    {/* Item Image */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-900 border border-white/5">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="90px"
                        className="object-cover object-center filter grayscale contrast-[1.05]"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex min-w-0 flex-col justify-between py-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-[0.82rem] font-medium uppercase leading-[1.2] tracking-[0.08em] text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-[0.82rem] font-semibold tracking-[0.08em] text-[#C9B07A]">
                            {item.price}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="text-white/45 transition-colors hover:text-white cursor-pointer"
                        >
                          <X className="size-4 stroke-[1.8]" />
                        </button>
                      </div>

                      {/* Stock Status and Action */}
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <span className={`text-[10px] uppercase tracking-wider font-semibold ${item.inStock ? "text-emerald-500" : "text-rose-500/70"}`}>
                          {item.inStock ? "In Stock" : "Sold Out"}
                        </span>

                        {item.inStock ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 bg-white text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] transition-all hover:bg-[#C9B07A] hover:text-black cursor-pointer"
                          >
                            <ShoppingBag className="size-3" />
                            <span>Add To Bag</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center bg-white/5 border border-white/10 text-white/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] cursor-not-allowed"
                          >
                            <span>Unavailable</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </div>

          {/* Footer Promo */}
          {items.length > 0 && (
            <div className="flex-none p-5 bg-black border-t border-white/10">
              <button
                type="button"
                className="flex h-11 w-full items-center justify-center bg-[#C9B07A] text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#b0965d] active:bg-[#977f4c] cursor-pointer"
              >
                Move All to Bag
              </button>
            </div>
          )}

        </div>
      </SheetContent>
    </Sheet>
  )
}
