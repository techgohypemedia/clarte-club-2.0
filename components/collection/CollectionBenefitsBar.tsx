"use client"

import { CornerUpLeft, Lock, ShoppingCart } from "lucide-react"
import { motion } from "motion/react"

const benefits = [
  {
    icon: ShoppingCart,
    title: "FREE SHIPPING",
    description: "On orders over ₹2,900",
  },
  {
    icon: CornerUpLeft,
    title: "EASY EXCHANGE",
    description: "7-day exchange policy",
  },
  {
    icon: Lock,
    title: "PAYMENT SECURE",
    description: "Guaranteed payment protection",
  },
] as const

export function CollectionBenefitsBar() {
  return (
    <section
      aria-label="Store benefits"
      className="mt-20 -mx-4 bg-white px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-y border-black/10"
    >
      <div className="mx-auto max-w-[1100px] border border-black/10 py-6 px-4 bg-white/60 rounded-lg shadow-sm">
        <ul className="grid grid-cols-3 divide-x divide-black/10">
          {benefits.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex justify-center px-1 sm:px-4 md:px-6">
              <motion.div 
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex flex-col items-center text-center gap-1.5 text-[#0F0F10] cursor-default w-full"
              >
                <div className="flex size-8 sm:size-10 items-center justify-center rounded-full bg-neutral-100 shrink-0 border border-black/10">
                  <Icon
                    aria-hidden="true"
                    className="size-4 sm:size-5 stroke-[1.8] text-[#0F0F10]"
                  />
                </div>

                <div className="min-w-0 flex flex-col items-center">
                  <p className="text-[8px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-tight text-center text-[#0F0F10]">
                    {title}
                  </p>
                  <p className="text-[7.5px] sm:text-[9px] md:text-[10px] text-neutral-500 uppercase tracking-[0.04em] sm:tracking-[0.06em] mt-0.5 font-medium leading-tight text-center">
                    {description}
                  </p>
                </div>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
