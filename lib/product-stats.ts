export type ProductReview = {
  id: string
  name: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
  helpfulCount: number
  hasVoted?: boolean
}

// Curated luxury eyewear review pools by category/style
const ATELIER_METAL_REVIEWS: Omit<ProductReview, "id">[] = [
  {
    name: "Arjun M.",
    rating: 5,
    title: "Masterpiece in Minimalist Design",
    body: "The slender gold metal frame is stunning in person. Lightweight yet structural—holds its shape nicely without putting any pressure behind the ears.",
    date: "July 12, 2026",
    verified: true,
    helpfulCount: 14,
  },
  {
    name: "Tanya M.",
    rating: 5,
    title: "Editorial Wire Profile",
    body: "I was searching for an understated frame that felt luxurious rather than flimsy. The temple detailing and silicone nose pads are top-tier.",
    date: "July 24, 2026",
    verified: true,
    helpfulCount: 9,
  },
  {
    name: "Kabir B.",
    rating: 5,
    title: "Featherweight Luxury",
    body: "Barely feels like you're wearing sunglasses. The gold hue is subtle and tasteful, not overly yellow or brassy. Superb hinge action.",
    date: "August 02, 2026",
    verified: true,
    helpfulCount: 11,
  },
  {
    name: "Priya S.",
    rating: 5,
    title: "Architectural Character",
    body: "Subtle architectural character and flawless lines. Exactly what I needed to elevate both everyday casual and evening looks. High praise.",
    date: "August 18, 2026",
    verified: true,
    helpfulCount: 8,
  },
  {
    name: "Siddharth R.",
    rating: 4,
    title: "Refined & Balanced Fit",
    body: "Weight distribution across the nose bridge is noticeably better than mass-market wire frames. Lenses are crisp with zero peripheral distortion.",
    date: "August 28, 2026",
    verified: true,
    helpfulCount: 5,
  },
  {
    name: "Ananya R.",
    rating: 5,
    title: "Flawless Quality & Polish",
    body: "The micro-detailing on the rims and temple tips shows incredible attention to detail. Feels like a bespoke boutique piece.",
    date: "September 04, 2026",
    verified: true,
    helpfulCount: 7,
  },
]

const NOIR_BOLD_REVIEWS: Omit<ProductReview, "id">[] = [
  {
    name: "Rohan D.",
    rating: 5,
    title: "Immaculate Acetate Craftsmanship",
    body: "The deep polished acetate has that high-end editorial weight without sliding down. The pitch black finish is silky and blemish-free.",
    date: "June 20, 2026",
    verified: true,
    helpfulCount: 16,
  },
  {
    name: "Meera K.",
    rating: 5,
    title: "Statement Silhouette Done Right",
    body: "Sharp beveled edges make an immediate impression. Constantly getting stopped by friends asking where I got them. Outstanding profile.",
    date: "July 05, 2026",
    verified: true,
    helpfulCount: 12,
  },
  {
    name: "Rahul K.",
    rating: 4,
    title: "Very Premium Acetate",
    body: "Hands down the best bold frames I own. The custom wire core keeps the temples snug without pinching behind the ears.",
    date: "July 19, 2026",
    verified: true,
    helpfulCount: 6,
  },
  {
    name: "Aditya S.",
    rating: 5,
    title: "Stays Secure All Day",
    body: "The custom 5-barrel hinges are sturdy and durable. They hug the temples securely throughout long days of wear.",
    date: "August 11, 2026",
    verified: true,
    helpfulCount: 10,
  },
  {
    name: "Divya N.",
    rating: 5,
    title: "Runway Proportions",
    body: "Elevates a simple white shirt or sharp blazer effortlessly. The lens dark tint gives complete privacy and sharp optical clarity.",
    date: "August 25, 2026",
    verified: true,
    helpfulCount: 7,
  },
  {
    name: "Vikram T.",
    rating: 5,
    title: "True Luxury Caliber",
    body: "The unboxing experience was fantastic and the acetate polishing easily rivals European designer brands charging 4x more.",
    date: "September 09, 2026",
    verified: true,
    helpfulCount: 4,
  },
]

const HERITAGE_VINTAGE_REVIEWS: Omit<ProductReview, "id">[] = [
  {
    name: "Ishaan G.",
    rating: 5,
    title: "Rich Amber Tortoise Depth",
    body: "The warm marbling in the acetate looks bespoke under natural daylight. Smooth hand-finished contours with zero rough edges.",
    date: "June 25, 2026",
    verified: true,
    helpfulCount: 13,
  },
  {
    name: "Sanjana R.",
    rating: 5,
    title: "Timeless Oval Profile",
    body: "The oval contour softens facial angles so naturally. Elegant, vintage-inspired, and versatile with virtually any wardrobe palette.",
    date: "July 16, 2026",
    verified: true,
    helpfulCount: 8,
  },
  {
    name: "Karan P.",
    rating: 5,
    title: "Supreme Long-Wear Comfort",
    body: "Wore them for an entire weekend drive without any temple fatigue. The green/brown lens tint cuts glare effortlessly.",
    date: "August 06, 2026",
    verified: true,
    helpfulCount: 10,
  },
  {
    name: "Rhea M.",
    rating: 4,
    title: "Vintage Soul with Modern Ergonomics",
    body: "Captures 70s luxury eyewear aesthetics while retaining modern lightness and durable barrel hinges. Highly recommended.",
    date: "August 22, 2026",
    verified: true,
    helpfulCount: 5,
  },
  {
    name: "Nikhil S.",
    rating: 5,
    title: "Polished to Absolute Perfection",
    body: "The acetate has depth and warmth you simply cannot find in mass-market brands. Solid construction that feels built to last.",
    date: "September 02, 2026",
    verified: true,
    helpfulCount: 9,
  },
]

const CRYSTAL_EDITORIAL_REVIEWS: Omit<ProductReview, "id">[] = [
  {
    name: "Neha V.",
    rating: 5,
    title: "Rich Editorial Lens Tint",
    body: "The translucent bio-acetate paired with the subtle lens tint looks straight out of an editorial lookbook. Love the clarity.",
    date: "July 01, 2026",
    verified: true,
    helpfulCount: 15,
  },
  {
    name: "Armaan C.",
    rating: 5,
    title: "Subtle Yet Striking",
    body: "The visible internal custom wire core through the clear temples is such a fine artistic detail. Beautifully engineered.",
    date: "July 28, 2026",
    verified: true,
    helpfulCount: 7,
  },
  {
    name: "Pooja B.",
    rating: 5,
    title: "Zero Glare, Sharp Visuals",
    body: "Crisp UV400 clarity in bright sun and comfortable indoors as well. The crystal material has zero cloudiness or micro-scratches.",
    date: "August 14, 2026",
    verified: true,
    helpfulCount: 11,
  },
  {
    name: "Varun L.",
    rating: 4,
    title: "Contemporary Minimalist Favorite",
    body: "Clean, luminous, and pairs effortlessly with linen and summer tones. The finish is remarkably smooth and lightweight.",
    date: "September 01, 2026",
    verified: true,
    helpfulCount: 4,
  },
]

const GENERAL_COMPLIMENT_REVIEWS: Omit<ProductReview, "id">[] = [
  {
    name: "Aayush K.",
    rating: 5,
    title: "Exceeded All Expectations",
    body: "Ordered after seeing them featured online. They genuinely look even better in person. The case and presentation are gorgeous.",
    date: "July 10, 2026",
    verified: true,
    helpfulCount: 8,
  },
  {
    name: "Simran T.",
    rating: 5,
    title: "My New Daily Essential",
    body: "Solid hinge action, perfect optical clarity, and comfortable nose resting. Outstanding craftsmanship for the price.",
    date: "July 31, 2026",
    verified: true,
    helpfulCount: 6,
  },
  {
    name: "Sameer J.",
    rating: 5,
    title: "Signature Clarte Quality",
    body: "You can immediately feel the quality difference in hand. Sturdy without feeling heavy, and the fit is true to size.",
    date: "August 19, 2026",
    verified: true,
    helpfulCount: 10,
  },
  {
    name: "Natasha D.",
    rating: 5,
    title: "Instant Compliment Magnet",
    body: "Second frame from Clarte Club. Consistent quality, fast insured delivery, and flattering silhouettes across the board.",
    date: "September 07, 2026",
    verified: true,
    helpfulCount: 12,
  },
]

/**
 * Computes a fast, deterministic DJB2 hash of a string
 */
function hashString(str: string): number {
  let hash = 5381
  const clean = (str || "clarte").toLowerCase().trim()
  for (let i = 0; i < clean.length; i++) {
    hash = ((hash << 5) + hash) + clean.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Generates a stable, realistic "Sold Today" count strictly under 50 (e.g. 18 to 47)
 * that varies across different products based on their handle/slug/id/title.
 */
export function getSoldTodayCount(seed?: string): number {
  if (!seed) return 28
  const hash = hashString(seed)
  // 18 + (0..29) yields values between 18 and 47 (strictly < 50)
  return 18 + (hash % 30)
}

/**
 * Generates a realistic base review count strictly under 50 (e.g. 21 to 47)
 * that varies across different products based on their handle/slug/id/title.
 */
export function getProductBaseReviewCount(seed?: string): number {
  if (!seed) return 34
  const hash = hashString(seed)
  // 21 + (0..26) yields between 21 and 47 reviews (strictly < 50)
  return 21 + (hash % 27)
}

/**
 * Returns a tailored, deterministic set of luxury eyewear written reviews for a product.
 * Guarantees variation in count, rating, dates, and feedback across different product handles.
 */
export function getInitialReviewsForProduct(productSlug: string, productTitle?: string): ProductReview[] {
  const seed = (productSlug || productTitle || "product").toLowerCase().trim()
  const hash = hashString(seed)

  // Identify style archetype
  const isMetal = /halo|regent|atelier|metal|wire|gold|titanium|steel|round/.test(seed)
  const isNoir = /noir|noyer|black|chunky|square|rectangle|bold/.test(seed)
  const isHeritage = /heritage|tortoise|havana|amber|oval|classic/.test(seed)
  const isCrystal = /crystal|smoke|clear|translucent|champagne|mist/.test(seed)

  let primaryPool: Omit<ProductReview, "id">[]
  if (isMetal) {
    primaryPool = ATELIER_METAL_REVIEWS
  } else if (isNoir) {
    primaryPool = NOIR_BOLD_REVIEWS
  } else if (isHeritage) {
    primaryPool = HERITAGE_VINTAGE_REVIEWS
  } else if (isCrystal) {
    primaryPool = CRYSTAL_EDITORIAL_REVIEWS
  } else {
    // Alternating fallback pool based on hash
    const pools = [ATELIER_METAL_REVIEWS, NOIR_BOLD_REVIEWS, HERITAGE_VINTAGE_REVIEWS, CRYSTAL_EDITORIAL_REVIEWS]
    primaryPool = pools[hash % pools.length]
  }

  // Combine primary pool with general pool
  const candidatePool = [...primaryPool, ...GENERAL_COMPLIMENT_REVIEWS]

  // Select 6 to 9 written reviews to display in the list
  const targetWrittenCount = 6 + (hash % 4) // 6, 7, 8, or 9

  // Deterministically shuffle candidates based on seed hash
  const shuffled = candidatePool
    .map((review, i) => ({ review, sortKey: (hash * (i + 1) * 31) % 997 }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((item) => item.review)

  // Take the target count of unique reviews
  const selected = shuffled.slice(0, targetWrittenCount)

  // Assign stable IDs
  return selected.map((rev, index) => ({
    ...rev,
    id: `static-${seed.replace(/[^a-z0-9]/g, "-")}-${index + 1}`,
  }))
}

/**
 * Calculates metrics (average rating, increased count, and distribution) for a given product
 */
export function getProductReviewStats(
  productSlug: string,
  productTitle?: string,
  userReviewsCount = 0
): {
  averageRating: number
  totalCount: number
  reviews: ProductReview[]
  ratingDistribution: { stars: number; percentage: number; count: number }[]
} {
  const seed = (productSlug || productTitle || "product").toLowerCase().trim()
  const hash = hashString(seed)
  const baseCount = getProductBaseReviewCount(seed)
  const totalCount = baseCount + userReviewsCount
  const writtenReviews = getInitialReviewsForProduct(productSlug, productTitle)

  // Calculate realistic rating breakdown: ~87-91% 5 stars, ~8-12% 4 stars, rare 3 stars
  const fiveStarRatio = 0.87 + ((hash % 5) * 0.01) // 0.87 to 0.91
  let fiveStarCount = Math.round(totalCount * fiveStarRatio)
  let fourStarCount = Math.max(1, Math.round(totalCount * 0.09))
  let threeStarCount = Math.max(0, totalCount - fiveStarCount - fourStarCount)

  // Adjust if rounding exceeded or fell short
  const currentSum = fiveStarCount + fourStarCount + threeStarCount
  if (currentSum !== totalCount) {
    fiveStarCount += totalCount - currentSum
  }

  const starSum = fiveStarCount * 5 + fourStarCount * 4 + threeStarCount * 3
  const averageRating = totalCount > 0 ? Number((starSum / totalCount).toFixed(1)) : 4.8

  const ratingDistribution = [
    {
      stars: 5,
      count: fiveStarCount,
      percentage: Math.round((fiveStarCount / totalCount) * 100),
    },
    {
      stars: 4,
      count: fourStarCount,
      percentage: Math.round((fourStarCount / totalCount) * 100),
    },
    {
      stars: 3,
      count: threeStarCount,
      percentage: Math.round((threeStarCount / totalCount) * 100),
    },
    {
      stars: 2,
      count: 0,
      percentage: 0,
    },
    {
      stars: 1,
      count: 0,
      percentage: 0,
    },
  ]

  return {
    averageRating,
    totalCount,
    reviews: writtenReviews,
    ratingDistribution,
  }
}
