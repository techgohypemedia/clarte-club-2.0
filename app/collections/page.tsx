import type { Metadata } from "next"

import { CollectionPage } from "@/components/collection/CollectionPage"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Collection | Clarte Club",
  description: "Browse the Clarte Club premium eyewear collection.",
}

export default function Page() {
  return <CollectionPage />
}
