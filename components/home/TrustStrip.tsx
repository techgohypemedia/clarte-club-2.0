import { Landmark, RotateCcw, ShieldCheck, Truck, Zap } from "lucide-react"

// Trust/support strip (replaces the "Club is Expanding" video banner). Sub-lines only state what the site's
// policies say: 7-day exchange, free shipping across India, tracked dispatch.
const points = [
  { icon: RotateCcw, title: "Easy Returns", sub: "7-day easy exchange" },
  { icon: ShieldCheck, title: "Secure Payments", sub: "Encrypted checkout" },
  { icon: Truck, title: "Free Shipping", sub: "Across India" },
  { icon: Zap, title: "Fast Shipping", sub: "Tracked dispatch" },
]

// Official brand marks (SVG files in /public/images/payments). Heights are tuned per logo so they look
// evenly sized inside identical chips; width/height are set to avoid layout shift while they load.
const paymentMarks = [
  { name: "Visa", file: "visa.svg", width: 42, height: 14 },
  { name: "Mastercard", file: "mastercard.svg", width: 31, height: 24 },
  { name: "American Express", file: "amex.svg", width: 24, height: 24 },
  { name: "RuPay", file: "rupay.svg", width: 60, height: 16 },
  { name: "UPI", file: "upi.svg", width: 48, height: 17 },
  { name: "Google Pay", file: "gpay.svg", width: 78, height: 14 },
]

export function TrustStrip() {
  return (
    <section aria-label="Why shop with Clarté Club" className="w-full border-y border-black/10 bg-[#f7f6f3] px-4 py-10 text-[#0F0F10] sm:px-6 lg:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4">
          {points.map(({ icon: Icon, title, sub }) => (
            <li key={title} className="flex flex-col items-center text-center">
              <Icon className="size-6 text-[#0F0F10]" strokeWidth={1.3} aria-hidden />
              <p className="mt-2.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] sm:text-[12.5px]">{title}</p>
              <p className="mt-1 text-[11px] text-neutral-500 sm:text-[12px]">{sub}</p>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-col items-center gap-3 border-t border-black/10 pt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">We accept</p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {paymentMarks.map((mark) => (
              <li
                key={mark.name}
                className="flex h-9 items-center justify-center rounded-[6px] border border-black/10 bg-white px-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/payments/${mark.file}`}
                  alt={mark.name}
                  width={mark.width}
                  height={mark.height}
                  loading="lazy"
                  decoding="async"
                  style={{ width: mark.width, height: mark.height }}
                />
              </li>
            ))}
            <li className="flex h-9 items-center justify-center gap-1.5 rounded-[6px] border border-black/10 bg-white px-3 text-[#0F0F10]">
              <Landmark className="size-3.5" strokeWidth={1.6} aria-hidden />
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.08em]">Net Banking</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
