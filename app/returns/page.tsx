import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Easy Exchange Policy | Clarté Club",
  description: "Exchange only. Store credit where needed. No cash refunds for change of mind.",
}

export default function ReturnsPage() {
  const eligibilityMatrix = [
    {
      situation: "Wrong size or item shipped by us",
      eligible: "Yes, exchanged at our cost",
      badgeStyle: "bg-[#0F0F10] text-white border border-[#0F0F10]",
    },
    {
      situation: "Item arrives damaged or defective",
      eligible: "Yes, exchanged at our cost",
      badgeStyle: "bg-[#0F0F10] text-white border border-[#0F0F10]",
    },
    {
      situation: "You'd like a different size or frame",
      eligible: "Yes, you cover return shipping, we cover onward shipping",
      badgeStyle: "bg-white text-[#0F0F10] border border-[#C9B07A]",
    },
    {
      situation: "Change of mind, no issue with the item",
      eligible: "Not eligible for exchange or refund, unless stated otherwise on the product page",
      badgeStyle: "bg-[#f4f4f4] text-neutral-600 border border-black/10",
    },
    {
      situation: "Item worn, used, or missing original packaging/tags",
      eligible: "Not eligible",
      badgeStyle: "bg-[#f4f4f4] text-neutral-600 border border-black/10",
    },
    {
      situation: "Request made after [7 days] from delivery",
      eligible: "Not eligible",
      badgeStyle: "bg-[#f4f4f4] text-neutral-600 border border-black/10",
    },
  ]

  return (
    <main className="flex-1 bg-white text-[#0F0F10] font-sans min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative w-full border-b border-black/10 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-neutral-500">
            Customer Care
          </p>
          <h1 className="font-heading text-[36px] md:text-[52px] font-normal uppercase leading-[1.08] tracking-tight text-[#0F0F10]">
            Easy Exchange Policy
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#C9B07A] font-semibold pt-2">
            Exchange only. Store credit where needed. No cash refunds for change of mind.
          </p>
          <p className="text-xs text-neutral-500 font-mono pt-1">
            Effective from [date]. Last updated [date].
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 text-neutral-700 leading-relaxed font-light space-y-12 text-[15px]">
        
        {/* RMS Portal Direct Action Card */}
        <div className="bg-[#0F0F10] text-white p-6 sm:p-8 md:p-10 border border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#C9B07A]/15 border border-[#C9B07A]/30 text-[#C9B07A] text-[10px] uppercase font-mono tracking-widest">
              <span>Self-Service Portal</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-normal uppercase tracking-wider text-white">
              Raise a Return or Exchange
            </h2>
            <p className="text-xs sm:text-sm text-[#E2DDD3] font-light leading-relaxed">
              Initiate an exchange or replacement directly online. Enter your Order Number and phone or email to track, manage, and book reverse pickup.
            </p>
          </div>
          <a
            href="https://returns.logisy.tech/returns?encipherencode=gAAAAABqqO4dZ_aHEgfDSgFjtzNTqFToTfjUov-gutfGRmGEnxV9zNALDW_8I3vsRe-FCSRd_e17ZDiNVjxpA4KgBtoGryMgUQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[#C9B07A] hover:bg-[#b89f6b] text-[#0F0F10] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
          >
            <span>Start Return / Exchange</span>
            <svg
              className="size-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Core Approach Summary Box */}
        <div className="bg-[#f4f4f4] border border-black/10 p-6 md:p-8 space-y-3 shadow-sm">
          <h2 className="font-heading text-xs uppercase tracking-[0.25em] text-[#C9B07A] font-bold">
            Our approach, in one paragraph
          </h2>
          <p className="text-[#0F0F10] leading-[1.8] text-[15px]">
            We work on an exchange basis, not a cash-refund basis, for products that have already been delivered. If something arrives wrong, damaged, or defective, we&apos;ll put it right at our cost. If you&apos;d simply like a different size or frame, we&apos;re glad to help you exchange it, provided it&apos;s unworn and in its original condition. Where an exact exchange isn&apos;t possible, we&apos;ll offer store credit of equal value instead. This policy doesn&apos;t apply to orders cancelled before dispatch, which are refunded in full to your original payment method, since those funds were never actually delivered against.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            1. Definitions
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>
              <strong className="text-[#0F0F10] font-semibold">“Exchange”</strong> means returning an eligible product and receiving a replacement (a different size or a different frame of equal value) or store credit, subject to the conditions below.
            </li>
            <li>
              <strong className="text-[#0F0F10] font-semibold">“Store Credit”</strong> means a non-transferable code, equal to the value of the returned product, redeemable against a future purchase on the Website.
            </li>
            <li>
              <strong className="text-[#0F0F10] font-semibold">“Eligible Product”</strong> means a product that is unworn, undamaged by the Customer, and returned with its original packaging, case, cloth, and tags intact.
            </li>
          </ul>
        </div>

        {/* Section 2: Matrix Table */}
        <div className="space-y-4">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            2. Eligibility for Exchange
          </h3>
          <div className="overflow-x-auto border border-black/10 bg-white">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f4f4f4] uppercase tracking-wider text-[#0F0F10] font-heading text-[11px]">
                <tr>
                  <th className="p-4 border-b border-black/10">Situation</th>
                  <th className="p-4 border-b border-black/10">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 font-light">
                {eligibilityMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f4f4f4] transition-colors">
                    <td className="p-4 text-[#0F0F10] font-medium">{item.situation}</td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1.5 text-xs rounded-none font-mono ${item.badgeStyle}`}>
                        {item.eligible}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            3. How to Request an Exchange
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>
              Visit our{" "}
              <a
                href="https://returns.logisy.tech/returns?encipherencode=gAAAAABqqO4dZ_aHEgfDSgFjtzNTqFToTfjUov-gutfGRmGEnxV9zNALDW_8I3vsRe-FCSRd_e17ZDiNVjxpA4KgBtoGryMgUQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9B07A] underline underline-offset-4 font-semibold"
              >
                Online Return &amp; Exchange Portal
              </a>{" "}
              within [7 days] of delivery. Enter your Order ID and registered phone number or email to submit your request.
            </li>
            <li>
              If the item arrived damaged, defective, or incorrect, please upload clear photographs of the product and packaging in the portal &mdash; this helps us approve the request quickly, without back and forth.
            </li>
            <li>
              We&apos;ll confirm eligibility within [2 business days] and coordinate the next steps, including reverse pickup where serviceable, or instructions to self-ship the item back to us.
            </li>
            <li>
              If you need any manual assistance, you can also reach our customer support team directly at{" "}
              <a href="mailto:contact@clarte.club" className="text-[#C9B07A] underline underline-offset-4 font-semibold">
                contact@clarte.club
              </a>
              .
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            4. Who Covers Shipping
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>If the fault is ours (wrong item, damaged, or defective), we cover both the return and the replacement shipping.</li>
            <li>If you&apos;d simply like a different size or frame, return shipping is on you; we cover sending the replacement out.</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            5. Once We Receive the Item
          </h3>
          <p>
            The returned product goes through a short quality check. If it meets the conditions in Section 2, we process the exchange within [3 to 5 business days] and dispatch your replacement using our standard shipping method. If the check isn&apos;t passed (for example, signs of wear, missing packaging), the item will be returned to you, and no exchange or credit will be issued.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            6. Store Credit
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>Where the exact item or size you want isn&apos;t available, we&apos;ll issue store credit equal to the value of the returned product.</li>
            <li>Store credit is valid for [12 months] from issue, single-use, and can&apos;t be exchanged for cash or transferred to another person.</li>
          </ul>
        </div>

        {/* Section 7 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            7. Orders Cancelled Before Dispatch
          </h3>
          <p>
            This exchange-only approach applies to delivered products. If we cancel your order before it ships (for example, due to a stock or pricing issue, as set out in our{" "}
            <Link href="/terms" className="text-[#C9B07A] underline underline-offset-4 font-semibold">
              Terms &amp; Conditions
            </Link>
            ), you&apos;ll receive a full refund to your original payment method, since the order was never fulfilled.
          </p>
        </div>

        {/* Section 8 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            8. Non-Returnable Items
          </h3>
          <p>
            Any product marked as final sale or non-returnable on its product page is excluded from this policy, except where it arrives damaged or defective.
          </p>
        </div>

        {/* Section 9 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            9. Grievances
          </h3>
          <p>
            If you&apos;re unhappy with how an exchange request was handled, you can escalate it to our Grievance Officer at{" "}
            <a href="mailto:contact@clarte.club" className="text-[#C9B07A] underline underline-offset-4 font-semibold">
              contact@clarte.club
            </a>
            . We&apos;ll acknowledge within 48 hours and aim to resolve within 15 working days, in line with the Consumer Protection (E-Commerce) Rules, 2020.
          </p>
        </div>

        {/* Section 10 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            10. Why We Work This Way
          </h3>
          <p>
            We keep our runs small and don&apos;t hold large amounts of stock waiting to be returned. Working on an exchange basis, rather than a constant cycle of cash refunds, lets us keep pricing honest and our operation lean. If something is genuinely wrong with your order, that&apos;s on us to fix, and we will.
          </p>
        </div>

        {/* Section 11 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            11. Governing Law
          </h3>
          <p>
            This Policy is governed by the laws of India and read together with our Terms &amp; Conditions. Nothing here limits any statutory right you have under the Consumer Protection Act, 2019.
          </p>
        </div>

        {/* Section 12 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            12. Changes to This Policy
          </h3>
          <p>
            We may update this Policy from time to time. Continued use of the Website after a change means you accept the update.
          </p>
        </div>

      </section>
    </main>
  )
}
