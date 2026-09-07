export type ProductImage = {
  src: string
  alt: string
  objectPosition?: string
}

export type ProductSwatch = {
  name: string
  value: string
}

export type DeliveryPerk = {
  label: string
  detail: string
  icon: "truck" | "exchange" | "shield" | "card"
}

export type ProductCard = {
  id: string
  merchandiseId?: string
  handle?: string
  href?: string
  image: string
  alt: string
  badge?: string
  featured?: boolean
  sizes?: string[]
  swatches: string[]
  gallery?: string[]
  name?: string
  price?: string
  category?: "Heritage" | "Noyer" | "Crystal" | "Atelier" | "Edits" | "Noir" | string
  type?: "Sunglasses" | "Optical"
  shape?: string
  material?: string
  colorGroup?: string
}

export type ProductDetail = {
  id?: string
  merchandiseId?: string
  slug: string
  editLabel: string
  title: string
  breadcrumb: Array<{
    label: string
    href?: string
  }>
  originalPrice: string
  price: string
  sold: string
  rating: string
  description: string
  detailsBody: string
  careNotes: string[]
  shippingNotes: string[]
  colorName: string
  colors: ProductSwatch[]
  sizes: string[]
  gallery: ProductImage[]
  deliveryPerks: DeliveryPerk[]
  completeLook: ProductImage[]
}

export const trendingProducts: ProductCard[] = [
  {
    id: "product-1",
    image: "/images/products/product1.png",
    alt: "Model wearing Heritage Oval sunglasses in glossy black frame",
    badge: "NEW ARRIVAL",
    swatches: ["#000000", "#6f5639", "#ebe8e1"],
    gallery: [
      "/images/products/product1.png",
      "/images/products/product5.png",
      "/images/products/product9.png",
      "/images/products/product13.png",
    ],
  },
  {
    id: "product-2",
    image: "/images/products/product2.png",
    alt: "Model wearing Heritage Aviator sunglasses with dark metal frame",
    swatches: ["#5b82ab", "#111722"],
    gallery: [
      "/images/products/product2.png",
      "/images/products/product6.png",
      "/images/products/product10.png",
      "/images/products/product14.png",
    ],
  },
  {
    id: "product-3",
    image: "/images/products/product3.png",
    alt: "Model wearing Noyer Square clear acetate optical frames",
    badge: "BESTSELLER",
    swatches: ["#ebe8e1", "#6f5639"],
    gallery: [
      "/images/products/product3.png",
      "/images/products/product7.png",
      "/images/products/product11.png",
      "/images/products/product15.png",
    ],
  },
  {
    id: "product-4",
    image: "/images/products/product4.png",
    alt: "Model wearing Noyer D-Frame acetate sunglasses in tortoiseshell",
    swatches: ["#6f5639", "#000000"],
    gallery: [
      "/images/products/product4.png",
      "/images/products/product8.png",
      "/images/products/product12.png",
      "/images/products/product5-white.png",
    ],
  },
  {
    id: "product-5-featured",
    image: "/images/products/product4.png",
    alt: "Model wearing Noyer D-Frame acetate sunglasses in tortoiseshell",
    featured: true,
    swatches: ["#6f5639", "#000000"],
    gallery: [
      "/images/products/product4.png",
      "/images/products/product8.png",
      "/images/products/product12.png",
      "/images/products/product5-white.png",
    ],
  },
  {
    id: "product-6",
    image: "/images/products/product3.png",
    alt: "Model wearing Noyer Square clear acetate optical frames",
    swatches: ["#ebe8e1", "#6f5639"],
    gallery: [
      "/images/products/product3.png",
      "/images/products/product7.png",
      "/images/products/product11.png",
      "/images/products/product15.png",
    ],
  },
  {
    id: "product-7",
    image: "/images/products/product1.png",
    alt: "Model wearing Heritage Oval sunglasses in glossy black frame",
    swatches: ["#000000", "#6f5639", "#ebe8e1"],
    gallery: [
      "/images/products/product1.png",
      "/images/products/product5.png",
      "/images/products/product9.png",
      "/images/products/product13.png",
    ],
  },
  {
    id: "product-8",
    image: "/images/products/product2.png",
    alt: "Model wearing Heritage Aviator sunglasses with dark metal frame",
    swatches: ["#5b82ab", "#111722"],
    gallery: [
      "/images/products/product2.png",
      "/images/products/product6.png",
      "/images/products/product10.png",
      "/images/products/product14.png",
    ],
  },
]

const sharedChairPose = {
  src: "/images/products/product4.png",
  alt: "Premium tortoiseshell D-frame sunglasses styled next to protective leather case",
}

export const featuredProduct: ProductDetail = {
  id: "gid://shopify/Product/7683302916155",
  merchandiseId: "gid://shopify/ProductVariant/43698982060091",
  slug: "heritage-oval",
  editLabel: "HERITAGE COLLECTIVE",
  title: "HERITAGE OVAL",
  breadcrumb: [
    { label: "Homepage", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Heritage Oval" },
    { label: "Glossy Black" },
  ],
  originalPrice: "₹10,500",
  price: "₹8,999",
  sold: "1,238 Sold",
  rating: "4.8",
  description:
    "An architectural oval frame sculpted from premium polished bio-acetate, featuring custom hardware and signature wire cores. Engineered to balance sharp contours with smooth, beveled edges for an elevated, timeless profile.",
  detailsBody:
    "Precision-sculpted bio-acetate with 100% UV400 protective lenses. Designed with a robust 5-barrel hinge construction and signature metal temple accents to ensure lasting durability and comfort.",
  careNotes: [
    "Wipe lenses with the microfiber cleaning cloth.",
    "Store in the provided leather protective case.",
    "Avoid leaving in high heat (like a car dashboard).",
    "Rinse with lukewarm water and mild soap if needed.",
  ],
  shippingNotes: [
    "Standard delivery in 2-4 business days.",
    "Free exchange within 14 days.",
    "Cash on delivery available on select pin codes.",
  ],
  colorName: "Glossy Black",
  colors: [
    { name: "Glossy Black", value: "#000000" },
    { name: "Royal Tortoise", value: "#6f5639" },
    { name: "Ivory Mist", value: "#ebe8e1" },
    { name: "Midnight Blue", value: "#111722" },
  ],
  sizes: [],
  gallery: [
    { src: "/images/products/product1.png", alt: "Model wearing Classic Heritage Oval sunglasses in glossy black frame", objectPosition: "center 36%" },
    { src: "/images/products/product5.png", alt: "Detail view of the premium acetate frame and custom wire core", objectPosition: "center 44%" },
    { src: "/images/products/product9.png", alt: "Model posing in Heritage Oval sunglasses with matching blazer", objectPosition: "center 28%" },
    { src: "/images/products/product13.png", alt: "Studio portrait highlighting front profile of Heritage Oval", objectPosition: "center 32%" },
    { src: "/images/products/product1.png", alt: "Model posing in sunglasses and matching look", objectPosition: "center 30%" },
    { src: "/images/products/product5.png", alt: "Premium acetate frame hinge and bevel details", objectPosition: "center 34%" },
  ],
  deliveryPerks: [
    {
      label: "Fast delivery",
      detail: "2-4 days",
      icon: "truck",
    },
    {
      label: "Easy exchange",
      detail: "14 days",
      icon: "exchange",
    },
    {
      label: "Secure checkout",
      detail: "COD available",
      icon: "shield",
    },
    {
      label: "Tracked shipping",
      detail: "Live updates",
      icon: "card",
    },
  ],
  completeLook: [
    { ...sharedChairPose, objectPosition: "center 32%" },
    { ...sharedChairPose, objectPosition: "center 40%" },
    { ...sharedChairPose, objectPosition: "center 28%" },
  ],
}

