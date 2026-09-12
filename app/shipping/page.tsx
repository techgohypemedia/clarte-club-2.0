import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shipping Policy | Clarté Club",
  description: "How orders are processed, dispatched, and delivered",
}

export default function ShippingPage() {
  return (
    <main className="flex-1 bg-white text-[#0F0F10] font-sans min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative w-full border-b border-black/10 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-neutral-500">
            Logistics &amp; Delivery
          </p>
          <h1 className="font-heading text-[36px] md:text-[52px] font-normal uppercase leading-[1.08] tracking-tight text-[#0F0F10]">
            Shipping Policy
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#C9B07A] font-semibold pt-2">
            How orders are processed, dispatched, and delivered
          </p>
          <p className="text-xs text-neutral-500 font-mono pt-1">
            Effective from [date]. Last updated [date].
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-neutral-700 leading-relaxed font-light space-y-12 text-[15px]">
        {/* Intro */}
        <p className="text-[#0F0F10] leading-[1.8] text-[16px]">
          This Policy explains how we process, dispatch, and deliver orders placed on the Website, and where responsibility sits between us and our shipping partner once your order is on its way.
        </p>

        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            1. Order Processing
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>Orders are typically processed within [24 to 48 working hours] of payment confirmation, excluding weekends and public holidays.</li>
            <li>You&apos;ll receive a confirmation email once your order is placed, and a dispatch email with tracking details once it ships.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            2. Shipping Partner &amp; Delivery
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>We ship through a third-party logistics partner. We don&apos;t control their day-to-day operations, but we&apos;ll always help coordinate if something goes wrong.</li>
            <li>Estimated delivery timelines are shown at checkout and are indicative, not guaranteed, since courier performance, location, and weather can all affect them.</li>
            <li>[We currently ship across serviceable pin codes in India. / We ship to India and select international destinations.]</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            3. Shipping Charges
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>Shipping cost, if any, is shown clearly at checkout before payment.</li>
            <li>[We currently offer free shipping across India.]</li>
            <li>For international orders, the Customer is responsible for any customs duties or import taxes charged by the destination country.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            4. Once Your Order Has Shipped
          </h3>
          <p>
            Once an order is handed to our shipping partner, transit-related risk (delay, damage, or loss while in the courier&apos;s custody) sits with the courier. We&apos;ll still do everything we reasonably can to help resolve a transit issue, coordinating with the courier, and, where our own error caused the issue, making it right at our cost, but we can&apos;t guarantee an outcome that depends on the courier&apos;s own investigation.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            5. Failed Delivery &amp; Return to Origin
          </h3>
          <p>
            If a delivery attempt fails because of an incorrect address, unavailability, or refused delivery, the order may be returned to us (Return to Origin). In that case, original shipping charges aren&apos;t refundable, and re-dispatch will require a new shipping charge and a confirmed address.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            6. Return Shipping
          </h3>
          <p>
            Who covers return shipping for an exchange is set out in our{" "}
            <Link href="/returns" className="text-[#C9B07A] underline underline-offset-4 font-medium">
              Easy Exchange Policy
            </Link>
            : we cover it if the fault is ours, you cover it for a straightforward preference exchange.
          </p>
        </div>

        {/* Section 7 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            7. Force Majeure
          </h3>
          <p>
            We&apos;re not liable for shipping delays caused by circumstances genuinely beyond our control, including natural disasters, strikes, or government restrictions.
          </p>
        </div>

        {/* Section 8 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            8. Contact &amp; Grievances
          </h3>
          <p>
            Questions about a shipment can go to{" "}
            <a href="mailto:contact@clarte.club" className="text-[#C9B07A] underline underline-offset-4 font-medium">
              contact@clarte.club
            </a>
            . For unresolved shipping grievances, our Grievance Officer aims to acknowledge within 48 hours and resolve within 30 days.
          </p>
        </div>

        {/* Section 9 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            9. Governing Law
          </h3>
          <p>
            This Policy is governed by the laws of India and read together with our{" "}
            <Link href="/terms" className="text-[#C9B07A] underline underline-offset-4 font-medium">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>

      </section>
    </main>
  )
}
