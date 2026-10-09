"use client"

import Image from "next/image"
import { Gift, Percent } from "lucide-react"

import { FREE_KIT, MULTI_FRAME_TIERS, formatRupees, type CartOffer } from "@/lib/cart-offers"
import { cn } from "@/lib/utils"

/* ---------- Rewards progress: 1 frame = free kit, then the multi-frame discount tiers ---------- */

function rewardsHeadline(offer: CartOffer) {
  if (offer.itemCount === 0) return <>Add a frame to unlock your <span className="text-[#C9B07A]">free Clarté Club Kit</span></>
  if (offer.next) {
    const n = offer.next.itemsNeeded
    return (
      <>
        Add {n} more {n === 1 ? "frame" : "frames"} to get{" "}
        <span className="text-[#C9B07A]">{Math.round(offer.next.rate * 100)}% OFF</span>
      </>
    )
  }
  return <>You&apos;ve unlocked all rewards!</>
}

export function CartRewardsProgress({ offer, className }: { offer: CartOffer; className?: string }) {
  const milestones = [
    { items: 1, label: "Free Kit", icon: Gift },
    ...MULTI_FRAME_TIERS.map((t) => ({ items: t.minItems, label: `${Math.round(t.rate * 100)}% OFF`, icon: Percent })),
  ]
  const last = milestones[milestones.length - 1].items
  // Nodes are centred in equal columns (1/6, 3/6, 5/6 for three) so the outer labels never touch the edge;
  // the fill runs from the left edge to the node of the current item count
  const position = (items: number) => `${((items - 0.5) / last) * 100}%`
  const fill = offer.itemCount === 0 ? "0%" : offer.itemCount >= last ? "100%" : position(offer.itemCount)

  return (
    <section className={cn("w-full text-center", className)} aria-label="Cart rewards">
      <p className="text-[11.5px] sm:text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[#0F0F10]">
        {rewardsHeadline(offer)}
      </p>
      <div className="relative mt-3 h-17">
        <div className="absolute inset-x-0 top-[1.6rem] h-0.5 rounded-full bg-black/10" />
        <div
          className="absolute left-0 top-[1.6rem] h-0.5 rounded-full bg-[#C9B07A] transition-[width] duration-500 ease-out"
          style={{ width: fill }}
        />
        {milestones.map(({ items, label, icon: Icon }) => {
          const reached = offer.itemCount >= items
          return (
            <div key={items} className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: position(items) }}>
              <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-neutral-500 whitespace-nowrap">
                {items} {items === 1 ? "Item" : "Items"}
              </span>
              <span
                className={cn(
                  "mt-0.5 flex size-[1.4rem] items-center justify-center rounded-full border-[1.5px] transition-colors duration-300",
                  reached ? "border-[#C9B07A] bg-[#C9B07A] text-black" : "border-black/25 bg-white text-black/40"
                )}
              >
                <Icon className="size-3" strokeWidth={2.4} />
              </span>
              <span
                className={cn(
                  "mt-1 text-[9.5px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap",
                  reached ? "text-[#0F0F10]" : "text-neutral-400"
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Free kit line (display only: one kit per frame) ---------- */

export function FreeKitRow({ quantity, compact = false }: { quantity: number; compact?: boolean }) {
  if (quantity <= 0) return null
  return (
    <article
      className={cn(
        "grid items-center bg-white border border-black/10 rounded-lg shadow-sm",
        compact
          ? "grid-cols-[110px_minmax(0,1fr)_auto] gap-3.5 p-3"
          : "grid-cols-[120px_minmax(0,1fr)_auto] sm:grid-cols-[170px_minmax(0,1fr)_auto] gap-4 sm:gap-6 p-4 sm:p-5"
      )}
      aria-label={`${FREE_KIT.name}, quantity ${quantity}, included free`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-[#f4f1ec]">
        <Image
          src={FREE_KIT.image}
          alt={`${FREE_KIT.name}: ${FREE_KIT.includes}`}
          fill
          sizes={compact ? "110px" : "(max-width: 640px) 120px, 170px"}
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <h3
          className={cn(
            "font-medium uppercase text-[#0F0F10] leading-snug",
            compact ? "text-[0.8rem] tracking-[0.08em]" : "text-sm sm:text-[15px] tracking-[0.16em]"
          )}
        >
          {FREE_KIT.name}
        </h3>
        <p className={cn("mt-1 text-neutral-500 leading-snug", compact ? "text-[11px]" : "text-[12px] sm:text-[13px]")}>
          Included with your order{quantity > 1 ? ` · Qty ${quantity}` : ""}
        </p>
      </div>
      <span className="self-center text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#2f7d4f]">
        Free
      </span>
    </article>
  )
}

/* ---------- Totals: subtotal, multi-frame discount, free kit, savings, total ---------- */

export function CartTotals({ offer, compact = false }: { offer: CartOffer; compact?: boolean }) {
  const row = "flex items-center justify-between gap-3"
  const label = cn("uppercase tracking-wider text-neutral-700", compact ? "text-[11px] font-medium" : "text-[12px] font-semibold")
  return (
    <div className={cn(compact ? "space-y-1.5 text-[12px]" : "space-y-2.5 text-sm")}>
      <div className={row}>
        <span className={label}>
          Subtotal ({offer.itemCount} {offer.itemCount === 1 ? "item" : "items"})
        </span>
        <span className="font-semibold text-[#0F0F10]">{formatRupees(offer.subtotal)}</span>
      </div>
      {offer.discount > 0 ? (
        <div className={row}>
          <span className={label}>Multi-frame offer ({Math.round(offer.rate * 100)}% off)</span>
          <span className="font-semibold text-[#2f7d4f]">−{formatRupees(offer.discount)}</span>
        </div>
      ) : null}
      {offer.kitQuantity > 0 ? (
        <div className={row}>
          <span className={label}>
            {FREE_KIT.name} × {offer.kitQuantity}
          </span>
          <span className="font-bold uppercase tracking-widest text-[#2f7d4f]">Free</span>
        </div>
      ) : null}

      {offer.discount > 0 && !compact ? (
        <div className="rounded-md bg-[#2f7d4f]/10 px-3 py-2 text-center text-[11.5px] font-semibold uppercase tracking-widest text-[#2f7d4f]">
          You&apos;re saving {formatRupees(offer.discount)} on this order
        </div>
      ) : null}

      <div className={cn(row, "border-t border-black/10", compact ? "pt-2" : "pt-3")}>
        <span className={cn("font-bold uppercase tracking-[0.14em] text-[#0F0F10]", compact ? "text-[12px]" : "text-[13px]")}>Total</span>
        <span className="flex items-baseline gap-2">
          {offer.discount > 0 ? (
            <span className="text-[12px] font-medium text-neutral-400 line-through">{formatRupees(offer.subtotal)}</span>
          ) : null}
          <span className={cn("font-extrabold tracking-wider text-[#0F0F10]", compact ? "text-base" : "text-lg")}>
            {formatRupees(offer.total)}
          </span>
        </span>
      </div>
      {offer.discount > 0 && compact ? (
        <p className="-mt-1 text-right text-[10.5px] font-semibold uppercase tracking-widest text-[#2f7d4f]">
          You save {formatRupees(offer.discount)}
        </p>
      ) : null}
    </div>
  )
}

