import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms & Conditions | Clarté Club",
  description: "The rules that govern using this site and buying from us",
}

export default function TermsPage() {
  return (
    <main className="flex-1 bg-white text-[#0F0F10] font-sans min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative w-full border-b border-black/10 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-neutral-500">
            Legal &amp; Governance
          </p>
          <h1 className="font-heading text-[36px] md:text-[52px] font-normal uppercase leading-[1.08] tracking-tight text-[#0F0F10]">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#C9B07A] font-semibold pt-2">
            The rules that govern using this site and buying from us
          </p>
          <p className="text-xs text-neutral-500 font-mono pt-1">
            Effective from [date]. Last updated [date].
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-neutral-700 leading-relaxed font-light space-y-12 text-[15px]">
        {/* Preamble */}
        <div className="bg-[#f4f4f4] border border-black/10 p-6 md:p-8 space-y-4">
          <h2 className="font-heading text-lg font-normal uppercase tracking-wider text-[#0F0F10]">
            Preamble
          </h2>
          <p className="text-neutral-700 leading-[1.8]">
            These Terms &amp; Conditions (“Terms”) govern access to and use of the Clart&eacute; Club website (“Website”), operated by Clart&eacute; Club (“Clart&eacute; Club,” “we,” “us,” or “the Company”). By browsing the Website, creating an account, or placing an order, you (“Customer” or “User”) agree to be bound by these Terms.
          </p>
          <p className="text-neutral-700 leading-[1.8]">
            These Terms are framed with reference to the Indian Contract Act, 1872, the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023, along with any rules made under these statutes. Where these Terms are silent, applicable Indian law governs.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            1. Definitions
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>
              <strong className="text-[#0F0F10] font-medium">“Website”</strong> means clarte.club and any associated subdomains, mobile site, or app operated by the Company.
            </li>
            <li>
              <strong className="text-[#0F0F10] font-medium">“Customer” or “User”</strong> means any person who accesses the Website, places an order, or otherwise interacts with it.
            </li>
            <li>
              <strong className="text-[#0F0F10] font-medium">“Products”</strong> means the eyewear, and any other goods, offered for sale by Clart&eacute; Club on the Website.
            </li>
            <li>
              <strong className="text-[#0F0F10] font-medium">“Order”</strong> means a confirmed request to purchase one or more Products, accepted subject to these Terms.
            </li>
            <li>
              <strong className="text-[#0F0F10] font-medium">“Policies”</strong> means this document together with the Return &amp; Exchange Policy, the Shipping Policy, and the Privacy Policy, each incorporated by reference.
            </li>
            <li>
              <strong className="text-[#0F0F10] font-medium">“Grievance Officer”</strong> means the individual appointed under the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology Rules, 2021 to receive and resolve Customer complaints.
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            2. Eligibility
          </h3>
          <p>
            By using the Website, you confirm that you are at least 18 years old and legally competent to enter into a contract under the Indian Contract Act, 1872. We do not knowingly collect data from, or contract with, anyone under 18 without verified parental or guardian consent.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            3. Accounts
          </h3>
          <p>
            Where an account is offered, you&apos;re responsible for keeping your login details confidential and for all activity under your account. Tell us immediately at{" "}
            <a href="mailto:contact@clarte.club" className="text-[#C9B07A] underline underline-offset-4 font-medium">
              contact@clarte.club
            </a>{" "}
            if you suspect unauthorised use. Accounts are personal and shouldn&apos;t be shared or used to circumvent our policies (for example, creating multiple accounts to exploit a promotion).
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            4. Acceptable Use
          </h3>
          <p>
            Please don&apos;t use the Website to do anything unlawful, harmful, or disruptive, including attempting to access parts of the site you&apos;re not authorised to, scraping or copying content without permission, uploading harmful code, impersonating someone else, or posting false or misleading reviews. We may suspend or close an account, and take further legal action where appropriate, in response to a serious breach of this clause.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            5. Products &amp; Listings
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>We describe every product as accurately as we can. Colour may appear slightly different depending on your screen.</li>
            <li>Product images are illustrative. Minor variation between the photograph and the item you receive doesn&apos;t, by itself, mean the item is defective.</li>
            <li>Products are released in considered numbers. Availability isn&apos;t guaranteed until an order is confirmed, and we may withdraw a listing at any time.</li>
            <li>If a product is listed with an incorrect price or description due to a genuine technical or typographical error, we may cancel the affected order, in which case any amount paid will be refunded in full to your original payment method.</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            6. Pricing &amp; Payment
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>All prices are in Indian Rupees and inclusive of GST unless stated otherwise.</li>
            <li>Payments are processed through a secure, RBI-compliant third-party payment gateway. We don&apos;t store your full card details.</li>
            <li>We may occasionally run a genuine promotional offer. Where we do, the terms of that specific offer will be stated clearly alongside it, and any change in price will never apply to an order already confirmed and paid for.</li>
          </ul>
        </div>

        {/* Section 7 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            7. Order Confirmation &amp; Cancellation
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>An automated email confirms we&apos;ve received your order. This is an acknowledgement, not final acceptance &mdash; orders are subject to stock, payment, and address verification.</li>
            <li>
              You may request a cancellation before your order has been marked as processed, by writing to{" "}
              <a href="mailto:contact@clarte.club" className="text-[#C9B07A] underline underline-offset-4 font-medium">
                contact@clarte.club
              </a>{" "}
              with your order number. Once processing has begun, we&apos;re unable to cancel or modify the order.
            </li>
            <li>We may cancel an order (with a full refund to your original payment method) if the product is unavailable, payment can&apos;t be verified, the order raises a fraud concern, the delivery address isn&apos;t serviceable, or there was a genuine pricing or listing error.</li>
          </ul>
        </div>

        {/* Section 8 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            8. Exchanges
          </h3>
          <p>
            We operate on an exchange basis, not a cash refund basis, for products already delivered. The full eligibility, process, and timelines are set out in our{" "}
            <Link href="/returns" className="text-[#C9B07A] underline underline-offset-4 font-medium">
              Easy Exchange Policy
            </Link>
            , which forms part of these Terms. Please read it before placing an order.
          </p>
        </div>

        {/* Section 9 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            9. Shipping
          </h3>
          <p>
            Shipping timelines, charges, and our responsibilities once an order is dispatched are set out in full in our{" "}
            <Link href="/shipping" className="text-[#C9B07A] underline underline-offset-4 font-medium">
              Shipping Policy
            </Link>
            , which forms part of these Terms.
          </p>
        </div>

        {/* Section 10 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            10. Intellectual Property
          </h3>
          <p>
            Everything on this Website &mdash; our name, the CC monogram, product photography, and written content &mdash; belongs to Clart&eacute; Club or our licensors, and is protected under the Copyright Act, 1957, the Trade Marks Act, 1999, and applicable international law. Please don&apos;t copy, reproduce, or commercially use any of it without our written permission.
          </p>
        </div>

        {/* Section 11 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            11. Reviews &amp; User Content
          </h3>
          <p>
            If you leave a review or share other content with us, you confirm it&apos;s genuine and your own, and you give us permission to use it (for example, on the Website or in our marketing) without further compensation. We may remove content that&apos;s false, abusive, or otherwise breaches these Terms.
          </p>
        </div>

        {/* Section 12 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            12. Limitation of Liability
          </h3>
          <p>
            To the extent permitted by law, Clart&eacute; Club isn&apos;t liable for indirect or consequential losses arising from your use of the Website or our Products. Nothing in these Terms limits any right you have under the Consumer Protection Act, 2019, or other applicable Indian law that cannot be excluded by agreement.
          </p>
        </div>

        {/* Section 13 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            13. Indemnity
          </h3>
          <p>
            You agree to indemnify Clart&eacute; Club against claims, losses, or costs arising from your breach of these Terms, misuse of the Website, or content you&apos;ve shared that infringes someone else&apos;s rights.
          </p>
        </div>

        {/* Section 14 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            14. Grievance Redressal
          </h3>
          <p>
            In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology Rules, 2021, we&apos;ve appointed a Grievance Officer to handle complaints relating to orders, exchanges, shipping, or data privacy.
          </p>
          <div className="bg-[#f4f4f4] p-5 border border-black/10 space-y-1 text-sm font-mono mt-2">
            <p className="text-[#0F0F10] font-sans font-semibold uppercase text-xs tracking-wider mb-2 text-[#C9B07A]">
              Grievance Officer
            </p>
            <p className="text-[#0F0F10]">
              Email:{" "}
              <a href="mailto:contact@clarte.club" className="text-[#C9B07A] underline">
                contact@clarte.club
              </a>
            </p>
            <p className="text-neutral-500 font-sans text-xs pt-2">
              We aim to acknowledge a complaint within 48 hours and resolve it within 30 days.
            </p>
          </div>
        </div>

        {/* Section 15 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            15. Force Majeure
          </h3>
          <p>
            We&apos;re not liable for delay or failure to perform our obligations due to circumstances genuinely beyond our control, including natural disasters, government restriction, strikes, or courier disruption.
          </p>
        </div>

        {/* Section 16 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            16. Governing Law &amp; Jurisdiction
          </h3>
          <p>
            These Terms are governed by the laws of India. Subject to the Grievance Redressal process above, any dispute will be subject to the exclusive jurisdiction of the courts of [city].
          </p>
        </div>

        {/* Section 17 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            17. Changes to These Terms
          </h3>
          <p>
            We may update these Terms from time to time. The date at the top shows when they were last changed. Continued use of the Website after an update means you accept the revised Terms.
          </p>
        </div>

        {/* Section 18 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            18. Contact
          </h3>
          <p>
            Questions about these Terms can be sent to{" "}
            <a href="mailto:contact@clarte.club" className="text-[#C9B07A] underline underline-offset-4 font-medium">
              contact@clarte.club
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
