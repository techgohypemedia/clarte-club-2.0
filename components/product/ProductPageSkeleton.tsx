// Shown instantly while a product page loads (app/product[s]/[handle]/loading.tsx). Mirrors ProductPage's
// layout (breadcrumb, gallery, summary) so the page doesn't jump when the real content arrives.
export function ProductPageSkeleton() {
  return (
    <main className="flex-1 bg-white text-black min-w-0 w-full overflow-x-clip" aria-busy="true" aria-label="Loading product">
      <section className="relative w-full px-4 pb-16 pt-1.5 sm:pt-2.5 sm:px-6 lg:px-8 lg:pt-4 min-w-0 animate-pulse">
        <div className="h-3 w-48 rounded-sm bg-neutral-100" />
        <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_480px] xl:grid-cols-[minmax(0,1fr)_573px] lg:items-start lg:gap-8 xl:gap-12 min-w-0 w-full">
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 w-full">
            <div className="hidden lg:flex lg:flex-col gap-2 w-[80px] shrink-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square w-full rounded-lg bg-neutral-100" />
              ))}
            </div>
            <div className="aspect-square w-full rounded-[14px] bg-neutral-100" />
          </div>
          <div className="space-y-4">
            <div className="h-3 w-24 rounded-sm bg-neutral-100" />
            <div className="h-8 w-3/4 rounded-sm bg-neutral-100" />
            <div className="h-6 w-1/3 rounded-sm bg-neutral-100" />
            <div className="h-20 w-full rounded-sm bg-neutral-100" />
            <div className="h-12 w-full rounded-sm bg-neutral-100" />
            <div className="h-12 w-full rounded-sm bg-neutral-100" />
          </div>
        </div>
      </section>
    </main>
  )
}
