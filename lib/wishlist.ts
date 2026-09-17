"use client"

import { useState, useEffect, useCallback } from "react"
import { CartItem, addToCart } from "./cart"

export type WishlistItem = {
  id: string
  handle: string
  title: string
  price: string
  image: string
  alt?: string
  inStock?: boolean
  merchandiseId?: string
  size?: string
  category?: string
  addedAt?: number
}

const WISHLIST_KEY = "clarte_wishlist_items"

export function getWishlistItems(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(WISHLIST_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (err) {
    console.error("Error reading wishlist:", err)
    return []
  }
}

export function saveWishlistItems(items: WishlistItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
    window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { items } }))
  } catch (err) {
    console.error("Error saving wishlist:", err)
  }
}

export function isItemInWishlist(idOrHandle?: string): boolean {
  if (!idOrHandle || typeof window === "undefined") return false
  const items = getWishlistItems()
  return items.some((item) => item.id === idOrHandle || item.handle === idOrHandle)
}

export function addToWishlist(item: WishlistItem, options?: { openDrawer?: boolean }) {
  const items = getWishlistItems()
  const exists = items.some((i) => i.id === item.id || (item.handle && i.handle === item.handle))
  if (!exists) {
    const newItem: WishlistItem = {
      ...item,
      addedAt: item.addedAt || Date.now(),
      inStock: item.inStock ?? true,
    }
    const updated = [newItem, ...items]
    saveWishlistItems(updated)
  }
  if (options?.openDrawer) {
    openWishlistDrawer()
  }
}

export function removeFromWishlist(idOrHandle: string) {
  const items = getWishlistItems()
  const updated = items.filter((item) => item.id !== idOrHandle && item.handle !== idOrHandle)
  saveWishlistItems(updated)
}

export function toggleWishlist(item: WishlistItem, options?: { openDrawer?: boolean }): boolean {
  const items = getWishlistItems()
  const existsIndex = items.findIndex((i) => i.id === item.id || (item.handle && i.handle === item.handle))
  if (existsIndex >= 0) {
    items.splice(existsIndex, 1)
    saveWishlistItems(items)
    return false
  } else {
    const newItem: WishlistItem = {
      ...item,
      addedAt: Date.now(),
      inStock: item.inStock ?? true,
    }
    const updated = [newItem, ...items]
    saveWishlistItems(updated)
    if (options?.openDrawer) {
      openWishlistDrawer()
    }
    return true
  }
}

export function clearWishlist() {
  saveWishlistItems([])
}

export function openWishlistDrawer() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("open-wishlist"))
}

export function moveItemToCart(item: WishlistItem): void {
  addToCart(
    {
      id: item.id,
      merchandiseId: item.merchandiseId,
      image: item.image,
      alt: item.alt || item.title,
      title: item.title,
      size: item.size || "",
      price: item.price,
    },
    { openCart: true }
  )
}

export function moveAllWishlistToCart(): void {
  const items = getWishlistItems()
  items.forEach((item) => {
    if (item.inStock !== false) {
      addToCart(
        {
          id: item.id,
          merchandiseId: item.merchandiseId,
          image: item.image,
          alt: item.alt || item.title,
          title: item.title,
          size: item.size || "",
          price: item.price,
        },
        { openCart: false }
      )
    }
  })
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: { open: true } }))
}

/**
 * React Hook for real-time Wishlist synchronization
 */
export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const sync = useCallback(() => {
    setItems(getWishlistItems())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    sync()
    const handleUpdate = () => sync()
    const handleStorage = (e: StorageEvent) => {
      if (e.key === WISHLIST_KEY) sync()
    }

    window.addEventListener("wishlist-updated", handleUpdate)
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("wishlist-updated", handleUpdate)
      window.removeEventListener("storage", handleStorage)
    }
  }, [sync])

  const isInWishlist = useCallback(
    (idOrHandle?: string) => {
      if (!idOrHandle) return false
      return items.some((i) => i.id === idOrHandle || i.handle === idOrHandle)
    },
    [items]
  )

  return {
    items,
    count: items.length,
    isLoaded,
    isInWishlist,
    toggleWishlist: (item: WishlistItem, options?: { openDrawer?: boolean }) => toggleWishlist(item, options),
    addToWishlist: (item: WishlistItem, options?: { openDrawer?: boolean }) => addToWishlist(item, options),
    removeFromWishlist: (idOrHandle?: string) => idOrHandle ? removeFromWishlist(idOrHandle) : undefined,
    clearWishlist: () => clearWishlist(),
    moveItemToCart: (item: WishlistItem) => moveItemToCart(item),
    moveAllWishlistToCart: () => moveAllWishlistToCart(),
  }
}
