import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { LookbookCarousel } from "@/components/home/LookbookCarousel"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductSummary } from "@/components/product/ProductSummary"
import { YouMayAlsoLikeSection } from "@/components/product/YouMayAlsoLikeSection"
import { ProductReviews } from "@/components/product/ProductReviews"
import { ProductHighlights } from "@/components/product/ProductHighlights"
import type { ProductDetail } from "@/components/product/productData"

export function ProductPage({
  product,
}: {
  product: ProductDetail
}) {
  return (
    <main className="flex-1 bg-white text-black min-w-0 w-full overflow-x-clip">
      <section className="relative w-full px-4 pb-16 pt-1.5 sm:pt-2.5 sm:px-6 lg:px-8 lg:pt-4 min-w-0">
        <div className="w-full min-w-0">
          <nav aria-label="Breadcrumb" className="text-[0.7rem] text-black/45">
            <ol className="flex flex-wrap items-center gap-1.5 uppercase tracking-[0.14em]">
              {product.breadcrumb.map((crumb, index) => {
                const isLast = index === product.breadcrumb.length - 1

                return (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="transition-colors hover:text-black"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-black" : ""}>
                        {crumb.label}
                      </span>
                    )}

                    {!isLast ? (
                      <ChevronRight className="size-3.5 shrink-0 text-black/25" />
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </nav>

          <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_480px] xl:grid-cols-[minmax(0,1fr)_573px] lg:items-start lg:gap-8 xl:gap-12 min-w-0 w-full">
            <div className="lg:sticky lg:top-[104px] w-full min-w-0">
              <ProductGallery images={product.gallery} />
            </div>
            <ProductSummary product={product} />
          </div>
        </div>
      </section>
      <ProductHighlights
        productTitle={product.title}
        gallery={product.gallery}
        highlights={product.highlights}
      />
      <ProductReviews productSlug={product.slug} />
      <YouMayAlsoLikeSection currentHandle={product.slug} />
      <LookbookCarousel />
    </main>
  )
}
