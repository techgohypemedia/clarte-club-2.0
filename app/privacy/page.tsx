import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Clarté Club",
  description: "Official Privacy Policy of Clarté Club under the Digital Personal Data Protection Act, 2023.",
}

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-white text-[#0F0F10] font-sans min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative w-full border-b border-black/10 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-neutral-500">
            Data Privacy &amp; Protection
          </p>
          <h1 className="font-heading text-[36px] md:text-[52px] font-normal uppercase leading-[1.08] tracking-tight text-[#0F0F10]">
            Privacy Policy
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#C9B07A] font-semibold pt-2">
            How we protect and handle your personal data
          </p>
          <p className="text-xs text-neutral-500 font-mono pt-1">
            Effective from [date]. Last updated [date].
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-neutral-700 leading-relaxed font-light space-y-12 text-[15px]">
        {/* Intro */}
        <div className="bg-[#f4f4f4] border border-black/10 p-6 md:p-8 space-y-3">
          <p className="text-[#0F0F10] leading-[1.8]">
            Clart&eacute; Club (&ldquo;Clart&eacute; Club,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) values your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, store, share, and protect your information when you visit clarte.club or make a purchase from us.
          </p>
          <p className="text-neutral-600 leading-[1.8] text-xs">
            This Policy is published in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act), the Information Technology Act, 2000, and the Information Technology Rules, 2011.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            1. Information We Collect
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li><strong className="text-[#0F0F10] font-medium">Personal Information:</strong> Name, delivery address, billing address, phone number, email address, and order history provided when placing an order or creating an account.</li>
            <li><strong className="text-[#0F0F10] font-medium">Payment Information:</strong> Processed through RBI-compliant, encrypted payment gateways. We do not store your complete card details.</li>
            <li><strong className="text-[#0F0F10] font-medium">Technical Data:</strong> IP address, browser type, device metadata, operating system, and browsing activity collected via cookies to enhance performance.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            2. Purpose of Data Processing
          </h3>
          <p>We process your data strictly for legitimate operational purposes, including:</p>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>Fulfilling orders, shipping packages, and processing eligible exchanges.</li>
            <li>Sending order confirmations, tracking details, and support updates.</li>
            <li>Improving site navigation, product catalog performance, and customer service.</li>
            <li>Complying with statutory tax, accounting, and legal requirements under Indian law.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            3. Data Sharing &amp; Third Parties
          </h3>
          <p>
            We do not sell, rent, or trade your personal data. We share necessary data only with trusted service partners under strict confidentiality obligations:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>Logistics and courier partners to fulfill delivery and reverse pickups.</li>
            <li>RBI-regulated payment gateway providers for transaction processing.</li>
            <li>Legal or government authorities when explicitly required under applicable law.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            4. Your Rights Under DPDP Act, 2023
          </h3>
          <p>As a Data Principal, you have rights to:</p>
          <ul className="space-y-2 list-disc pl-5 text-neutral-700">
            <li>Request a summary of your personal data collected and processed by us.</li>
            <li>Seek correction, completion, or updating of inaccurate personal data.</li>
            <li>Withdraw consent or request erasure of personal data where legal retention is not mandated.</li>
            <li>Nominate an individual to exercise your rights in the event of incapacity.</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            5. Data Security &amp; Retention
          </h3>
          <p>
            We maintain technical, administrative, and physical safeguards designed to protect personal data against unauthorized access, loss, or alteration. Data is retained only as long as necessary to fulfill operational purposes and statutory tax obligations.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-3">
          <h3 className="font-heading text-xl uppercase tracking-wider text-[#0F0F10] border-b border-black/10 pb-2">
            6. Contact &amp; Grievance Officer
          </h3>
          <p>
            If you have questions, data update requests, or privacy concerns, please contact our Grievance Officer:
          </p>
          <div className="bg-[#f4f4f4] p-5 border border-black/10 space-y-1 text-sm font-mono mt-2">
            <p className="text-[#0F0F10] font-sans font-semibold uppercase text-xs tracking-wider mb-2 text-[#C9B07A]">
              Privacy &amp; Grievance Officer
            </p>
            <p className="text-[#0F0F10]">Clart&eacute; Club</p>
            <p className="text-[#0F0F10]">Email: <a href="mailto:contact@clarte.club" className="text-[#C9B07A] underline">contact@clarte.club</a></p>
            <p className="text-neutral-500 font-sans text-xs pt-2">
              We acknowledge grievances within 48 hours and resolve them within 30 days.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
