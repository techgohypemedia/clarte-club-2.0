// Clarté Club - Considered Eyewear
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping, Returns & FAQ | Clarté Club",
  description: "Everything you need to know about Clarté Club shipping, returns, prescription lenses, and how our products are made.",
}

export default function FAQPage() {
  const faqs = [
    {
      question: "So, wait, who actually makes these?",
      answer: "Straight answer: we design the range and choose the materials, and our production partners make the pieces to our specification. We check the batches before they ship. We don't run our own workshop and we won't pretend to."
    },
    {
      question: "Is this brand new? I haven't heard of you.",
      answer: "Yes, we're new. That's actually the fun part. You're one of the first people through the door."
    },
    {
      question: "Do you offer prescription lenses?",
      answer: "Our optical frames arrive with clear demo lenses so your own optician can fit your prescription. It's how most premium eyewear works, and it keeps things clean."
    },
    {
      question: "Are your sunglasses UV protected?",
      answer: "Yes. Every pair carries full UV400 protection."
    },
    {
      question: "Why don't you have a bigger range?",
      answer: "We could. We chose not to. A smaller range means we can look at every piece properly."
    },
    {
      question: "Tell me about the packaging.",
      answer: "Clean, protective, and considered. We design the packaging to deliver your frames safely, but we keep the main focus on the frames themselves."
    },
    {
      question: "What happens if something's wrong with my order?",
      answer: "Tell us. We'll fix it. That's a real answer, not a policy line."
    },
    {
      question: "Do you restock things that sell out?",
      answer: "Usually not. When a piece is done, we move on. If a shape becomes a favourite, we might bring it back in a different colour, but never on repeat."
    }
  ]

  // Generate JSON-LD FAQPage Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <main className="flex-1 bg-white text-[#0F0F10] font-sans min-h-screen pb-24">
      
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero Section */}
      <section className="relative w-full border-b border-black/10 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-neutral-500">
            Support &amp; Information
          </p>
          <h1 className="font-heading text-xl sm:text-2xl md:text-[30px] font-normal uppercase leading-[1.25] tracking-tight text-[#0F0F10] max-w-2xl mx-auto">
            Shipping, returns, and the questions people actually ask.
          </h1>
        </div>
      </section>

      {/* Shipping & Returns Overview */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 border-b border-black/10 pb-16">
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-normal uppercase tracking-wider text-[#0F0F10]">
              Shipping
            </h2>
            <p className="text-[14px] leading-[1.7] text-neutral-600 font-light">
              Free shipping across India. Orders are usually confirmed within a day. You&apos;ll hear from us at every step: confirmed, shipped, out for delivery, delivered.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-normal uppercase tracking-wider text-[#0F0F10]">
              Returns
            </h2>
            <p className="text-[14px] leading-[1.7] text-neutral-600 font-light">
              Not the right fit? Send it back within our return window and we&apos;ll sort a refund or exchange without a fuss. Original condition, tags on, that&apos;s the only ask.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h2 className="font-heading text-xl font-normal uppercase tracking-wider text-center text-[#0F0F10] mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border-b border-black/10 pb-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[#0F0F10] transition-colors duration-200 hover:text-[#C9B07A] py-3">
                <h3 className="text-[15px] font-normal tracking-wide uppercase font-sans">
                  {faq.question}
                </h3>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 text-neutral-400 group-hover:text-[#C9B07A] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-[1.8] text-neutral-600 font-light pr-6 transition-all duration-300">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

    </main>
  )
}
