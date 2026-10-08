import Link from "next/link"

// Shown for unknown URLs and for product links that no longer exist (deleted or mistyped products),
// inside the normal site header and footer
export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 bg-white px-6 py-24 text-center text-[#0F0F10]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9B07A]">Page not found</p>
      <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
        This page isn&apos;t available
      </h1>
      <p className="max-w-md text-[13px] leading-relaxed text-neutral-600">
        The product or page you were looking for may have moved or is no longer available.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Link
          href="/collections"
          className="h-12 px-8 inline-flex items-center justify-center bg-[#0F0F10] text-white text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-[#C9B07A] hover:text-black transition-colors"
        >
          Shop the collection
        </Link>
        <Link
          href="/"
          className="h-12 px-8 inline-flex items-center justify-center border border-black/20 text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-neutral-100 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
