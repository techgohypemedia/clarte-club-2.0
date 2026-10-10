import type { Metadata } from "next"
import { CollectionPage } from "@/components/collection/CollectionPage"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const title = handle.replace(/-/g, " ").toUpperCase()

  return {
    title: `${title} | Clarte Club`,
    description: `Explore ${title} collection at Clarte Club.`,
  }
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  return <CollectionPage initialCategory={handle} />
}
