import {
  fetchAllProducts,
  fetchCollectionByHandle,
  fetchCollections,
  fetchProductByHandle,
  formatMoney,
  toProductCard,
  extractOptionValues,
} from "./shopify"
import type { ProductCard, ProductDetail, ProductImage } from "@/components/product/productData"

function getProductFallbackImages(_indexOrId: number | string): string[] {
  return []
}

function extractTagsMetadata(tags: string[] = [], extraContext: string = "") {
  let shape = ""
  let material = ""
  let colorGroup = ""
  let type: "Sunglasses" | "Eyeglasses" | undefined = undefined
  let gender: "Men" | "Women" | "Unisex" | undefined = undefined
  let badge: string | undefined = undefined

  const shapeKeywords = ["square", "cat-eye", "cateye", "round", "aviator", "geometric", "oval", "d-frame", "panto", "hexagon"]
  const materialKeywords = ["acetate", "metal", "titanium", "gold", "crystal", "bio-acetate", "steel"]

  const allTokens = [...tags, ...extraContext.toLowerCase().split(/[\s,\-_/]+/)]

  for (const token of allTokens) {
    const t = token.toLowerCase().trim()
    if (!t) continue

    if (t.includes("sunglass")) type = "Sunglasses"
    if (t.includes("eyeglasses") || t.includes("optical") || t.includes("eyeglass") || t.includes("glasses")) type = "Eyeglasses"
    if (t === "women" || t === "female" || t === "woman" || t === "womens") gender = "Women"
    else if (t === "men" || t === "male" || t === "man" || t === "mens") gender = "Men"
    else if (t === "unisex") gender = "Unisex"

    if (t === "new" || t.includes("bestseller") || t.includes("exclusive")) {
      badge = token.toUpperCase()
    }
    for (const s of shapeKeywords) {
      if (t.includes(s) && !shape) shape = s
    }
    for (const m of materialKeywords) {
      if (t.includes(m) && !material) {
        if (m === "titanium" || m === "gold" || m === "metal" || m === "steel") material = "Metal"
        else material = "Acetate"
      }
    }
    if (t.includes("noir") || t.includes("black")) colorGroup = "monochrome"
    else if (t.includes("gold") || t.includes("champagne")) colorGroup = "gold"
    else if (t.includes("crystal") || t.includes("smoke")) colorGroup = "crystal"
    else if (t.includes("tortoise") || t.includes("havana")) colorGroup = "tortoiseshell"
  }

  return { shape, material, colorGroup, type, gender, badge }
}

export function shopifyProductToCard(node: any, index = 0): ProductCard {
  if (!node) {
    return {
      id: "fallback-1",
      name: "Signature Eyewear",
      price: "₹ 4,500",
      image: "",
      alt: "Signature Eyewear",
      swatches: ["#000000", "#6f5639"],
      gallery: [],
    }
  }

  const tags = Array.isArray(node.tags) ? node.tags : []
  const textContext = `${node.title || ""} ${node.productType || ""} ${node.description || ""} ${node.vendor || ""}`
  const { shape, material, colorGroup, type: tagType, gender: tagGender, badge: tagBadge } = extractTagsMetadata(tags, textContext)

  // Direct Shopify Images
  const shopifyImages: string[] = []
  if (Array.isArray(node.images?.nodes)) {
    for (const img of node.images.nodes) {
      if (img?.url) shopifyImages.push(img.url)
    }
  } else if (Array.isArray(node.images)) {
    for (const img of node.images) {
      if (typeof img === "string") shopifyImages.push(img)
      else if (img?.url) shopifyImages.push(img.url)
    }
  }

  if (shopifyImages.length === 0 && node.featuredImage?.url) {
    shopifyImages.push(node.featuredImage.url)
  }

  const finalGallery = shopifyImages
  const primaryImage = shopifyImages.length > 0 ? shopifyImages[0] : ""

  const handle = node.handle || ""
  const href = handle ? `/products/${handle}` : "/products"
  const variantId = node?.variants?.nodes?.[0]?.id || node?.variants?.[0]?.id || ""

  // Price formatting
  const priceVal = node.priceRange?.minVariantPrice?.amount || node.price || (node.variants?.nodes?.[0]?.price?.amount) || "4500"
  const currency = node.priceRange?.minVariantPrice?.currencyCode || node.currencyCode || "INR"
  const formattedPrice = formatMoney(priceVal, currency)
  const productType = (node.productType?.toLowerCase().includes("sunglass") ? "Sunglasses" : tagType || (tags.some((t: string) => t.toLowerCase().includes("sunglass")) ? "Sunglasses" : "Eyeglasses")) as "Sunglasses" | "Eyeglasses"

  const collectionHandles = (Array.isArray(node.collections) ? node.collections : (node.collections?.nodes || [])).map((c: any) => (c.handle || c.title || "").toLowerCase())
  let category = ""
  if (collectionHandles.some((h: string) => h.includes("noir") || h.includes("noyer")) || tags.some((t: string) => t.toLowerCase().includes("noir") || t.toLowerCase().includes("noyer"))) {
    category = "Noir"
  } else if (collectionHandles.some((h: string) => h.includes("crystal")) || tags.some((t: string) => t.toLowerCase().includes("crystal"))) {
    category = "Crystal"
  } else if (collectionHandles.some((h: string) => h.includes("atelier")) || tags.some((t: string) => t.toLowerCase().includes("atelier") || t.toLowerCase().includes("geometric") || t.toLowerCase().includes("metal"))) {
    category = "Atelier"
  } else if (collectionHandles.some((h: string) => h.includes("heritage")) || tags.some((t: string) => t.toLowerCase().includes("heritage") || t.toLowerCase().includes("round") || t.toLowerCase().includes("cat-eye") || t.toLowerCase().includes("aviator"))) {
    category = "Heritage"
  } else if (collectionHandles.some((h: string) => h.includes("edit") || h.includes("curated"))) {
    category = "Edits"
  } else {
    category = (node.vendor || node.productType || "Signature").replace(/Frames|Collective/i, "").trim()
  }

  return {
    id: node.id || handle || `product-${index}`,
    merchandiseId: variantId,
    handle,
    href,
    name: node.title || "Signature Frame",
    price: formattedPrice,
    image: primaryImage,
    alt: node.featuredImage?.altText || node.title || "Product image",
    badge: tagBadge || (index === 0 ? "NEW DROP" : undefined),
    category,
    type: productType,
    gender: tagGender,
    shape: shape || "Classic",
    material: material || "Acetate",
    colorGroup: colorGroup || "Monochrome",
    swatches: extractOptionValues(node, "color").length
      ? extractOptionValues(node, "color")
      : ["#000000", "#6f5639", "#ebe8e1"],
    gallery: finalGallery,
  }
}

function extractCleanShortDescription(html: string = "", fallbackPlain: string = ""): string {
  if (!html && !fallbackPlain) return ""

  // If HTML is present, extract paragraph text before <ul> or <ol>
  if (html && (html.includes("<p") || html.includes("<em") || html.includes("<span"))) {
    const withoutLists = html.split(/<ul|<ol|<table/i)[0] || html
    let clean = withoutLists
      .replace(/<\/p>/gi, " ")
      .replace(/<br\s*[\/]?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/([.!?])([A-Za-z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()

    if (clean.length > 20) return clean
  }

  // Fallback cleanup on plain string
  return fallbackPlain
    .replace(/([.!?])([A-Za-z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
}

function getMetafieldValue(node: any, ...keysToMatch: string[]): string | null {
  const metafields = Array.isArray(node?.metafields) ? node.metafields : []
  const lowerKeys = keysToMatch.map((k) => k.toLowerCase())
  
  for (const mf of metafields) {
    if (!mf || !mf.value) continue
    const k = (mf.key || "").toLowerCase()
    const ns = (mf.namespace || "").toLowerCase()
    const fullKey = `${ns}.${k}`
    
    if (
      lowerKeys.includes(k) ||
      lowerKeys.includes(fullKey) ||
      lowerKeys.some((target) => k.replace(/[-_]/g, "") === target.replace(/[-_]/g, ""))
    ) {
      return mf.value
    }
  }

  if (node?.metafield?.value) {
    return node.metafield.value
  }

  return null
}

function parseMetafieldNotes(value: any, fallback: string[]): string[] {
  if (!value) return fallback
  
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return fallback

    // JSON array format (e.g. from Shopify list metafield)
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => String(item).trim()).filter(Boolean)
        }
      } catch {
        // Not JSON
      }
    }

    // Rich text JSON format from Shopify rich_text_field
    if (trimmed.startsWith("{") && trimmed.includes('"type":')) {
      try {
        const parsed = JSON.parse(trimmed)
        const extracted: string[] = []
        const extractText = (obj: any) => {
          if (!obj) return
          if (obj.type === "text" && obj.value) extracted.push(obj.value)
          if (Array.isArray(obj.children)) obj.children.forEach(extractText)
        }
        extractText(parsed)
        if (extracted.length > 0) return extracted
      } catch {
        // ignore
      }
    }
    
    // Newline-separated points (e.g. multi-line text field)
    if (trimmed.includes("\n")) {
      const lines = trimmed
        .split(/\r?\n/)
        .map((line) => line.replace(/^[\s•\-\*0-9\.\)]+/, "").trim())
        .filter(Boolean)
      if (lines.length > 0) return lines
    }

    // Period-separated sentences (e.g. "Standard delivery in 2-4 business days. Free exchange within 14 days.")
    const sentences = trimmed
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (sentences.length > 0) return sentences
    return [trimmed]
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  return fallback
}

export function shopifyProductToDetail(node: any): ProductDetail {
  // Direct Shopify Images
  const shopifyImages: ProductImage[] = []
  if (Array.isArray(node.images?.nodes)) {
    for (const img of node.images.nodes) {
      if (img?.url) {
        shopifyImages.push({
          src: img.url,
          alt: img.altText || node.title || "Product Image",
        })
      }
    }
  } else if (Array.isArray(node.images)) {
    for (const img of node.images) {
      if (typeof img === "string") {
        shopifyImages.push({ src: img, alt: node.title || "Product Image" })
      } else if (img?.url) {
        shopifyImages.push({ src: img.url, alt: img.alt || node.title || "Product Image" })
      }
    }
  }

  if (shopifyImages.length === 0 && node.featuredImage?.url) {
    shopifyImages.push({
      src: node.featuredImage.url,
      alt: node.featuredImage.altText || node.title || "Product Image",
    })
  }

  const gallery: ProductImage[] = shopifyImages

  const colorValues = extractOptionValues(node, "color")
  const colors = colorValues.length
    ? colorValues.map((name: string) => ({ name, value: "#000000" }))
    : [
        { name: "Glossy Black", value: "#000000" },
        { name: "Royal Tortoise", value: "#6f5639" },
        { name: "Ivory Mist", value: "#ebe8e1" },
      ]

  const sizeValues = extractOptionValues(node, "size")
  const firstVariantId = node?.variants?.nodes?.[0]?.id || node?.variants?.[0]?.id || ""

  const rawPrice = node.priceRange?.minVariantPrice?.amount || node.price || (node.variants?.nodes?.[0]?.price?.amount) || "4500"
  const rawComparePrice = node.variants?.nodes?.[0]?.compareAtPrice?.amount || node.compareAtPrice
  const currency = node.priceRange?.minVariantPrice?.currencyCode || node.currencyCode || "INR"

  const price = formatMoney(rawPrice, currency)
  const originalPrice = rawComparePrice ? formatMoney(rawComparePrice, currency) : ""

  const cleanDescription = extractCleanShortDescription(node.descriptionHtml, node.description) ||
    "An architectural frame sculpted from premium bio-acetate with custom hardware and signature wire cores."

  // Dynamic Shopify Metafields extraction for Care & Shipping
  const rawCareValue = getMetafieldValue(
    node,
    "details_and_care",
    "details_care",
    "details-and-care",
    "details-care",
    "care_and_details",
    "care_details",
    "care_instructions",
    "care",
    "wash_care",
    "details"
  )

  const rawShippingValue = getMetafieldValue(
    node,
    "shipping_and_payment",
    "shipping_payment",
    "shipping-and-payment",
    "shipping-payment",
    "shipping_and_delivery",
    "shipping_delivery",
    "shipping_policy",
    "shipping",
    "payment",
    "delivery"
  )

  const defaultCareNotes = [
    "Wipe lenses with the microfiber cleaning cloth.",
    "Store in the provided leather protective case.",
    "Avoid leaving in direct high heat.",
    "Rinse with lukewarm water and mild soap if needed.",
  ]

  const defaultShippingNotes = [
    "Standard delivery in 2-4 business days.",
    "Free exchange within 14 days.",
    "Cash on delivery available across India.",
  ]

  const careNotes = parseMetafieldNotes(rawCareValue, defaultCareNotes)
  const shippingNotes = parseMetafieldNotes(rawShippingValue, defaultShippingNotes)

  // Dynamic Shopify Metafields extraction for Product Highlights
  const rawHighlightsValue = getMetafieldValue(
    node,
    "highlight",
    "highlights",
    "product_highlight",
    "product_highlights",
    "highlights_json"
  )

  let highlights: any = undefined
  if (rawHighlightsValue) {
    try {
      const parsed = typeof rawHighlightsValue === "string" ? JSON.parse(rawHighlightsValue) : rawHighlightsValue
      if (Array.isArray(parsed) && parsed.length > 0) {
        highlights = parsed.map((item: any) => ({
          eyebrow: item.eyebrow || item.badge || item.subtitle || "",
          title: item.title || item.heading || item.name || "",
          description: item.description || item.desc || item.body || "",
          imageSrc: item.imageSrc || item.image || item.img || "",
          imageAlt: item.imageAlt || item.alt || "",
        }))
      }
    } catch {
      // If it's multi-line text instead of strict JSON, parse lines/paragraphs
      if (typeof rawHighlightsValue === "string" && rawHighlightsValue.trim()) {
        const blocks = rawHighlightsValue.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean)
        if (blocks.length > 0) {
          highlights = blocks.map((block) => {
            const lines = block.split("\n").map(l => l.trim()).filter(Boolean)
            if (lines.length >= 2) {
              return {
                title: lines[0].replace(/^[-*#•\d.]+\s*/, ""),
                description: lines.slice(1).join(" "),
              }
            }
            return {
              title: lines[0] || "",
              description: "",
            }
          })
        }
      }
    }
  }

  return {
    id: node?.id || "product-detail",
    merchandiseId: firstVariantId,
    slug: node?.handle || "product",
    editLabel: (node?.vendor || node?.productType || "CLARTÉ CLUB").toUpperCase(),
    title: (node?.title || "SIGNATURE FRAME").toUpperCase(),
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: node?.title || "Product" },
    ],
    originalPrice,
    price,
    sold: "1,238 Sold",
    rating: "4.8",
    description: cleanDescription,
    detailsBody:
      node?.descriptionHtml ||
      node?.description ||
      "Precision-sculpted bio-acetate frame with 100% UV400 protective lenses.",
    careNotes,
    shippingNotes,
    colorName: colorValues[0] || "Glossy Black",
    colors,
    sizes: sizeValues,
    gallery,
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
      { label: "Easy exchange", detail: "14 days", icon: "exchange" },
      { label: "Secure checkout", detail: "COD available", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
    completeLook: gallery.slice(0, 3),
    highlights,
  }
}

export async function getShopifyProducts(limit = 50): Promise<ProductCard[]> {
  try {
    // Fetch with extra headroom so non-catalog utility items (e.g. as-seen-on, lookbook, stories)
    // do not diminish the requested count of actual catalog products.
    const fetchLimit = Math.max((limit || 8) + 10, 50)
    const products = await fetchAllProducts(fetchLimit)
    if (products && products.length > 0) {
      // Filter out utility lookbook and container products
      const catalogProducts = products.filter((p: any) => {
        const h = (p.handle || "").toLowerCase()
        return h !== "as-seen-on" && h !== "lookbook" && !h.startsWith("story-")
      })
      const finalProducts = limit ? catalogProducts.slice(0, limit) : catalogProducts
      console.log(`🛍️ [Shopify API] Successfully loaded ${finalProducts.length} live products from shapar-ay.myshopify.com`)
      return finalProducts.map((p: any, i: number) => shopifyProductToCard(p, i))
    }
  } catch (error) {
    console.warn("❌ [Shopify API] Failed to fetch products from Shopify API:", error)
  }
  return []
}

export async function getShopifyCollectionProducts(handle: string, limit = 50): Promise<ProductCard[]> {
  try {
    let collection = await fetchCollectionByHandle(handle, limit)
    
    // Fallback handle checks (e.g., noyer <-> noir, edits <-> the-collection)
    if (!collection?.products?.length) {
      const fallbackMap: Record<string, string[]> = {
        noyer: ["noir", "the-collection"],
        noir: ["noyer", "the-collection"],
        edits: ["the-collection", "frontpage"],
      }
      const alternates = fallbackMap[handle.toLowerCase()] || []
      for (const altHandle of alternates) {
        const altCol = await fetchCollectionByHandle(altHandle, limit)
        if (altCol?.products?.length) {
          collection = altCol
          break
        }
      }
    }

    if (collection?.products?.length) {
      console.log(`🛍️ [Shopify API] Loaded ${collection.products.length} products for collection '${handle}'`)
      return collection.products.map((p: any, i: number) => shopifyProductToCard(p, i))
    }
  } catch (error) {
    console.warn(`❌ [Shopify API] Failed to fetch collection '${handle}' from Shopify API:`, error)
  }
  return []
}

export async function getShopifyProductByHandle(handle: string): Promise<ProductDetail | null> {
  if (!handle) return null
  try {
    // 1. Direct handle lookup
    let product = await fetchProductByHandle(handle)
    if (product) {
      console.log(`🛍️ [Shopify API] Loaded live product '${product.title}' (${handle})`)
      return shopifyProductToDetail(product)
    }

    // 2. Fuzzy match across all catalog products (e.g. the-noir vs the-noir-1)
    const allProducts = await fetchAllProducts(50)
    if (allProducts && allProducts.length > 0) {
      const cleanHandle = handle.toLowerCase().replace(/-\d+$/, "")
      const matched = allProducts.find((p: any) => {
        const pHandle = (p.handle || "").toLowerCase()
        const pTitle = (p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
        return (
          pHandle === handle.toLowerCase() ||
          pHandle.replace(/-\d+$/, "") === cleanHandle ||
          pTitle === cleanHandle ||
          pTitle === handle.toLowerCase()
        )
      })

      if (matched) {
        console.log(`🛍️ [Shopify API] Fuzzy-matched live product '${matched.title}' for handle '${handle}'`)
        return shopifyProductToDetail(matched)
      }
    }
  } catch (error) {
    console.warn(`❌ [Shopify API] Failed to fetch product '${handle}' from Shopify API:`, error)
  }
  return null
}

export type CollectionBanner = {
  title: string
  subtitle: string
  categorySlug: string
  image: string
  alt: string
}

export async function getShopifyCollectionBanners(): Promise<CollectionBanner[]> {
  try {
    const collections = await fetchCollections(20)
    if (!collections || collections.length === 0) return []

    const banners: CollectionBanner[] = []
    const handleMap: Record<string, { slug: string; defaultTitle: string; defaultSub: string }> = {
      noir: { slug: "noir", defaultTitle: "NOIR COLLECTION", defaultSub: "Deep, Structural Blacks & Architectural Lines" },
      noyer: { slug: "noir", defaultTitle: "NOIR COLLECTION", defaultSub: "Deep, Structural Blacks & Architectural Lines" },
      heritage: { slug: "heritage", defaultTitle: "HERITAGE COLLECTION", defaultSub: "Warm Tortoise Tones & Classic Craftsmanship" },
      crystal: { slug: "crystal", defaultTitle: "CRYSTAL COLLECTION", defaultSub: "Translucent Smoke & Clear Bio-Acetate Silhouettes" },
      atelier: { slug: "atelier", defaultTitle: "ATELIER COLLECTION", defaultSub: "Limited-Batch Precision Hardware & Bold Profiles" },
      edits: { slug: "edits", defaultTitle: "CURATED EDITS", defaultSub: "Editorial Statements & Runway Profiles" },
    }

    for (const col of collections) {
      const h = (col.handle || "").toLowerCase()
      const matchConfig = handleMap[h]
      if (matchConfig) {
        const imgUrl = col.image?.url || ""
        if (imgUrl) {
          banners.push({
            title: col.title ? `${col.title.toUpperCase()} COLLECTION` : matchConfig.defaultTitle,
            subtitle: col.description || matchConfig.defaultSub,
            categorySlug: matchConfig.slug,
            image: imgUrl,
            alt: col.image?.alt || `${col.title || matchConfig.defaultTitle} featured eyewear`,
          })
        }
      }
    }
    return banners
  } catch (error) {
    console.warn("❌ [Shopify API] Failed to fetch collection banners:", error)
    return []
  }
}

export type ShopifyStoryItem = {
  id: string
  category: string
  title: string
  subtitle: string
  image: string
  link: string
  ctaText: string
}

export async function getShopifyStories(): Promise<ShopifyStoryItem[]> {
  try {
    const collection = await fetchCollectionByHandle("stories", 12)
    if (collection?.products && collection.products.length > 0) {
      console.log(`🛍️ [Shopify API] Loaded ${collection.products.length} live stories from collection 'stories'`)
      return collection.products.map((p: any, index: number) => {
        // Pick primary image (prefer featuredImage or image 0)
        const storyImage = p.featuredImage?.url || p.images?.[0]?.url || ""

        // Extract category tag
        let category = "NEW DROP"
        const tags = (p.tags || []).map((t: string) => String(t).toUpperCase())
        if (tags.includes("BESTSELLER")) category = "BESTSELLER"
        else if (tags.includes("LIMITED EDIT") || tags.includes("LIMITED")) category = "LIMITED EDIT"
        else if (tags.includes("EDITORIAL")) category = "EDITORIAL"
        else if (tags.includes("EXCLUSIVE")) category = "EXCLUSIVE"
        else if (p.productType) category = String(p.productType).toUpperCase()

        // Clean subtitle from product description (first sentence)
        let subtitle = p.description ? p.description.split(".")[0].trim() + "." : "Signature luxury eyewear designed for modern character."
        if (subtitle.length > 90) {
          subtitle = subtitle.slice(0, 87) + "..."
        }

        return {
          id: p.id || `story-${index + 1}`,
          category,
          title: p.title || "Signature Frame",
          subtitle,
          image: storyImage,
          link: `/product/${p.handle}`,
          ctaText: "Shop Now",
        }
      })
    }
  } catch (error) {
    console.warn("❌ [Shopify API] Failed to fetch stories from collection 'stories':", error)
  }
  return []
}

export type LookbookSlideItem = {
  id: string
  image: string
  alt: string
  username?: string
  caption?: string
  time?: string
  link?: string
  imagePos?: string
}

export async function getShopifyLookbook(): Promise<{ track1: LookbookSlideItem[]; track2: LookbookSlideItem[] }> {
  try {
    let images: { url: string; alt?: string; link?: string }[] = []

    // 1. Try single dedicated product 'as-seen-on' or 'lookbook' (allows uploading all photos to 1 product in Shopify)
    const lookbookProduct = (await fetchProductByHandle("as-seen-on")) || (await fetchProductByHandle("lookbook"))
    if (lookbookProduct && lookbookProduct.images && lookbookProduct.images.length > 0) {
      console.log(`📸 [Shopify API] Found 'as-seen-on' product with ${lookbookProduct.images.length} images`)
      images = lookbookProduct.images.map((img: any) => ({
        url: img.url,
        alt: img.altText || "Style with Clarté frames",
      }))
    }

    // 2. If not found, try collection 'as-seen-on' or 'lookbook'
    if (images.length === 0) {
      const collection = (await fetchCollectionByHandle("as-seen-on", 24)) || (await fetchCollectionByHandle("lookbook", 24))
      if (collection?.products && collection.products.length > 0) {
        console.log(`📸 [Shopify API] Found 'as-seen-on' collection with ${collection.products.length} products`)
        collection.products.forEach((p: any) => {
          // Gather lifestyle/model shots (prefer image 1 or 0)
          if (p.images && p.images.length > 1) {
            images.push({
              url: p.images[1]?.url || p.images[0]?.url,
              alt: p.title || "Style with Clarté frames",
              link: `/product/${p.handle}`,
            })
          } else if (p.featuredImage?.url) {
            images.push({
              url: p.featuredImage.url,
              alt: p.title || "Style with Clarté frames",
              link: `/product/${p.handle}`,
            })
          }
        })
      }
    }

    if (images.length > 0) {
      const t1: LookbookSlideItem[] = []
      const t2: LookbookSlideItem[] = []

      images.forEach((img, idx) => {
        const slide: LookbookSlideItem = {
          id: `shopify-lb-${idx + 1}`,
          image: img.url,
          alt: img.alt || "Style with Clarté frames",
          username: "street_style",
          caption: "Loving my new shades from @clarteclub",
          time: `${(idx % 12) + 1} hours ago`,
          link: img.link,
          imagePos: "center 20%",
        }
        if (idx % 2 === 0) {
          t1.push(slide)
        } else {
          t2.push(slide)
        }
      })

      return {
        track1: t1.length > 0 ? t1 : t2,
        track2: t2.length > 0 ? t2 : t1,
      }
    }
  } catch (error) {
    console.warn("❌ [Shopify API] Failed to fetch lookbook images:", error)
  }

  return { track1: [], track2: [] }
}


