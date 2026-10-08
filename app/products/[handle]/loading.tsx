import { ProductPageSkeleton } from "@/components/product/ProductPageSkeleton"

// Instant loading state: shown the moment a product card is tapped, and prefetched with the card link
export default function Loading() {
  return <ProductPageSkeleton />
}
