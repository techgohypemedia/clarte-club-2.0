"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { restoreCartFromId, restoreCartFromLines, setAppliedCoupon } from "@/lib/cart"

// Cart recovery links (WhatsApp / email / shared):
//   /cart/c/<cart-token>?key=<key>      Shopify cart recovery format
//   /cart/<variantId>:<qty>,<id>:<qty>  Shopify cart permalink format
// Both replace the visitor's cart with exactly the linked products and quantities, then open /cart.
// (/cart?cart=<id> is handled on every page by initCart.)
export default function CartLinkPage() {
  const params = useParams<{ slug: string[] }>()
  const router = useRouter()
  const [failed, setFailed] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const slug = (params.slug ?? []).map((part) => decodeURIComponent(part))
    const search = new URLSearchParams(window.location.search)
    const discount = search.get("discount")

    const restore = async (): Promise<boolean> => {
      if (slug[0] === "c" && slug[1]) {
        return restoreCartFromId(slug[1], search.get("key"))
      }
      const pairs = slug.join("/").split(",").map((pair) => pair.trim()).filter(Boolean)
      const lines = pairs
        .map((pair) => {
          const [variantId, qty] = pair.split(":")
          return /^\d+$/.test(variantId ?? "") ? { variantId, quantity: Number.parseInt(qty ?? "1", 10) || 1 } : null
        })
        .filter((line): line is { variantId: string; quantity: number } => line !== null)
      return lines.length ? restoreCartFromLines(lines) : false
    }

    restore()
      .catch((error) => {
        console.warn("Cart link could not be restored:", error)
        return false
      })
      .then((ok) => {
        if (discount) setAppliedCoupon(discount)
        if (ok) {
          router.replace("/cart")
        } else {
          setFailed(true)
        }
      })
  }, [params.slug, router])

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center bg-white text-[#0F0F10]">
      {failed ? (
        <>
          <h1 className="text-lg font-bold uppercase tracking-wider">This cart link has expired</h1>
          <p className="max-w-md text-[13px] text-neutral-600">
            The products from this link are no longer available. Your current cart has not been changed.
          </p>
          <button
            type="button"
            onClick={() => router.replace("/cart")}
            className="mt-2 h-12 px-8 bg-[#0F0F10] text-white text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-[#C9B07A] hover:text-black transition-colors"
          >
            Go to cart
          </button>
        </>
      ) : (
        <>
          <Loader2 className="size-6 animate-spin text-[#C9B07A]" />
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-neutral-600">Restoring your cart…</p>
        </>
      )}
    </main>
  )
}
