"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, X, ShoppingBag, Check } from "lucide-react"

import { ProductCardView } from "@/components/home/TrendingSection"
import { useWishlist, WishlistItem } from "@/lib/wishlist"
import { type ProductCard } from "@/components/product/productData"

export default function WishlistPage() {
  const { items, removeFromWishlist, moveItemToCart, moveAllWishlistToCart, isLoaded } = useWishlist()
  const [recommendedProducts, setRecommendedProducts] = useState<ProductCard[]>([])
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let isMounted = true
    import("@/lib/shopify-adapter").then(({ getShopifyProducts }) => {
      getShopifyProducts(4).then((products) => {
        if (isMounted && products && products.length > 0) {
          setRecommendedProducts(products)
        }
      })
    })

    return () => {
      isMounted = false
    }
  }, [])

  const handleAddToCart = (item: WishlistItem) => {
    moveItemToCart(item)
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }))
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9B07A] block mb-1">
            Personal Curation
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-[0.08em] uppercase">
            My Wishlist
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs tracking-widest text-white/50">
          <span>{items.length} {items.length === 1 ? "ITEM" : "ITEMS"}</span>
          {items.length > 0 && (
            <button
              type="button"
              onClick={moveAllWishlistToCart}
              className="bg-white text-black hover:bg-[#C9B07A] hover:text-black transition-colors px-4 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase cursor-pointer"
            >
              Move All To Bag
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isLoaded ? (
        <div className="h-64 flex items-center justify-center">
          <div className="size-6 border border-white/20 border-t-[#C9B07A] rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 bg-white/[0.02] p-8">
          <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Heart className="size-8 text-white/30 stroke-[1.5]" />
          </div>
          <h2 className="text-base uppercase tracking-[0.18em] font-medium text-white mb-2">
            Your Wishlist Is Empty
          </h2>
          <p className="text-xs text-white/50 tracking-wider max-w-sm mb-8 leading-relaxed">
            Explore our handcrafted luxury eyewear collections and tap the heart icon to save your favorite frames here.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center justify-center bg-white text-black hover:bg-[#C9B07A] hover:text-black transition-all px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em]"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col bg-neutral-950 border border-white/10 overflow-hidden"
            >
              {/* Product Image */}
              <Link
                href={`/products/${item.handle || item.id}`}
                className="relative aspect-square w-full overflow-hidden bg-white block"
              >
                <Image
                  src={item.image || "/images/products/product1.png"}
                  alt={item.alt || item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Remove Button */}
              <button
                type="button"
                aria-label={`Remove ${item.title}`}
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-3 right-3 size-8 bg-black/70 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition-colors rounded-full backdrop-blur-sm z-10 cursor-pointer"
              >
                <X className="size-4 stroke-[1.8]" />
              </button>

              {/* Card Details */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <Link href={`/products/${item.handle || item.id}`} className="hover:underline">
                    <h3 className="text-sm font-medium uppercase tracking-[0.1em] text-white line-clamp-1">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-sm font-semibold tracking-wider text-[#C9B07A] mt-1">
                    {item.price}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${item.inStock !== false ? "text-emerald-500" : "text-rose-500/70"}`}>
                    {item.inStock !== false ? "In Stock" : "Sold Out"}
                  </span>

                  {item.inStock !== false ? (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="inline-flex items-center gap-2 bg-white text-black hover:bg-[#C9B07A] hover:text-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-all cursor-pointer"
                    >
                      {addedItemIds[item.id] ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
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
                      className="inline-flex items-center bg-white/5 text-white/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Section */}
      {recommendedProducts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-white/10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9B07A] block mb-2">
              Curated Recommendations
            </span>
            <h2 className="text-xl sm:text-2xl font-light uppercase tracking-[0.1em] text-white">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product, idx) => (
              <ProductCardView key={product.id} product={product} theme="dark" index={idx} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
