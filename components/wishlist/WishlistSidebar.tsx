// Clarté Club - Considered Eyewear
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, X, ShoppingBag, Check } from "lucide-react"

import { useWishlist, WishlistItem } from "@/lib/wishlist"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"

type WishlistSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WishlistSidebar({ open, onOpenChange }: WishlistSidebarProps) {
  const { items, removeFromWishlist, moveItemToCart, moveAllWishlistToCart } = useWishlist()
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({})

  // Listen for global open wishlist events
  useEffect(() => {
    const handleOpen = () => onOpenChange(true)
    window.addEventListener("open-wishlist", handleOpen)
    return () => window.removeEventListener("open-wishlist", handleOpen)
  }, [onOpenChange])

  useEffect(() => {
    if (open) {
      ;(window as any).lenis?.stop()
    } else {
      ;(window as any).lenis?.start()
    }
    return () => {
      ;(window as any).lenis?.start()
    }
  }, [open])

  const handleAddToCart = (item: WishlistItem) => {
    moveItemToCart(item)
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }))
    }, 1500)
  }

  const handleMoveAll = () => {
    moveAllWishlistToCart()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="!z-[10000] bg-black/40 backdrop-blur-[2px]"
        className="!z-[10001] overflow-hidden border-l border-black/10 bg-[#FAFAFA] p-0 text-[#0F0F10] shadow-[0_0_80px_rgba(0,0,0,0.25)] ease-in-out duration-300"
        style={{ width: "min(100vw, 420px)", maxWidth: "none" }}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#FAFAFA]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
            <div className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[#0F0F10]">
              <Heart className="size-4 stroke-[2.4] text-[#C9B07A] fill-[#C9B07A]" />
              <span>{items.length} {items.length === 1 ? "ITEM" : "ITEMS"} IN WISHLIST</span>
            </div>

            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-neutral-500 hover:text-black transition-colors cursor-pointer leading-none"
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
            className="flex-1 overflow-y-auto px-5 py-6 space-y-4"
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 bg-white border border-black/5 p-8 rounded-lg">
                <Heart className="size-10 text-neutral-300 stroke-[1.5]" />
                <p className="text-[12px] uppercase tracking-[0.15em] text-neutral-500 font-medium">
                  Your wishlist is empty.
                </p>
                <Link
                  href="/collections"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex bg-black text-white hover:bg-[#C9B07A] hover:text-black px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 shadow-sm"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <section className="space-y-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="grid grid-cols-[90px_minmax(0,1fr)] gap-4 p-3.5 bg-white border border-black/10 rounded-lg shadow-sm hover:border-black/20 transition-all"
                  >
                    {/* Item Image with White Background */}
                    <Link
                      href={`/products/${item.handle || item.id}`}
                      onClick={() => onOpenChange(false)}
                      className="relative aspect-square w-full overflow-hidden bg-white border border-black/10 rounded block"
                    >
                      <Image
                        src={item.image || "/images/products/product1.png"}
                        alt={item.alt || item.title}
                        fill
                        sizes="90px"
                        className="object-cover object-center hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Item Info */}
                    <div className="flex min-w-0 flex-col justify-between py-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.handle || item.id}`}
                            onClick={() => onOpenChange(false)}
                            className="hover:underline"
                          >
                            <h3 className="truncate text-[0.85rem] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-[#0F0F10]">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="mt-1 text-[0.85rem] font-bold tracking-[0.08em] text-[#C9B07A]">
                            {item.price}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="text-neutral-400 hover:text-black transition-colors p-1 cursor-pointer"
                        >
                          <X className="size-4 stroke-[1.8]" />
                        </button>
                      </div>

                      {/* Stock Status and Action */}
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/5 pt-2">
                        <span className={`text-[10px] uppercase tracking-wider font-semibold ${item.inStock !== false ? "text-emerald-600" : "text-rose-500"}`}>
                          {item.inStock !== false ? "In Stock" : "Sold Out"}
                        </span>

                        {item.inStock !== false ? (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            className="inline-flex items-center gap-1.5 bg-black text-white hover:bg-[#C9B07A] hover:text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] rounded transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            {addedItemIds[item.id] ? (
                              <>
                                <Check className="size-3 text-emerald-400" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="size-3" />
                                <span>Add To Bag</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center bg-black/5 border border-black/10 text-black/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] rounded cursor-not-allowed"
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
            <div className="flex-none p-5 bg-white border-t border-black/10 shadow-lg">
              <button
                type="button"
                onClick={handleMoveAll}
                className="flex h-11 w-full items-center justify-center bg-[#C9B07A] text-[12px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#b0965d] active:bg-[#977f4c] cursor-pointer shadow-sm"
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
