"use client"

import { useState, useEffect, useId, useMemo } from "react"
import { Star, Check, X, ThumbsUp } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { getInitialReviewsForProduct, getProductReviewStats, type ProductReview } from "@/lib/product-stats"

type Review = ProductReview

export function ProductReviews({
  productSlug,
  productTitle,
}: {
  productSlug: string
  productTitle?: string
}) {
  const initialReviews = useMemo(
    () => getInitialReviewsForProduct(productSlug, productTitle),
    [productSlug, productTitle]
  )
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  
  // Review form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [formError, setFormError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Load reviews from localStorage + product-specific initial reviews
  useEffect(() => {
    const key = `clarte_reviews_${productSlug}`
    const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setReviews([...parsed, ...initialReviews])
          return
        }
      } catch (e) {
        // fallback
      }
    }
    setReviews(initialReviews)
  }, [productSlug, initialReviews])

  const saveReviewsToStorage = (updatedReviews: Review[]) => {
    const key = `clarte_reviews_${productSlug}`
    // Only save user-created reviews
    const userReviews = updatedReviews.filter(r => r.id.startsWith("user-"))
    localStorage.setItem(key, JSON.stringify(userReviews))
  }

  // Calculate metrics using product stats with user review delta
  const userReviewsCount = reviews.filter(r => r.id.startsWith("user-")).length
  const stats = useMemo(
    () => getProductReviewStats(productSlug, productTitle, userReviewsCount),
    [productSlug, productTitle, userReviewsCount]
  )

  const totalCount = stats.totalCount
  const averageRating = stats.averageRating
  const ratingDistribution = stats.ratingDistribution

  // Vote helpfulness
  const handleHelpfulClick = (id: string) => {
    const nextReviews = reviews.map(r => {
      if (r.id === id) {
        if (r.hasVoted) {
          return { ...r, helpfulCount: r.helpfulCount - 1, hasVoted: false }
        } else {
          return { ...r, helpfulCount: r.helpfulCount + 1, hasVoted: true }
        }
      }
      return r
    })
    setReviews(nextReviews)
    saveReviewsToStorage(nextReviews)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !title.trim() || !body.trim()) {
      setFormError("Please fill out all fields.")
      return
    }

    const newReview: Review = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      rating,
      title: title.trim(),
      body: body.trim(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      verified: true,
      helpfulCount: 0,
    }

    const nextReviews = [newReview, ...reviews]
    setReviews(nextReviews)
    saveReviewsToStorage(nextReviews)

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("clarte_reviews_updated", {
          detail: { slug: productSlug },
        })
      )
    }
    
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setIsModalOpen(false)
      // reset form
      setName("")
      setEmail("")
      setRating(5)
      setTitle("")
      setBody("")
    }, 1800)
  }

  const handleToggleShowAll = () => {
    setShowAll(!showAll)
  }

  return (
    <section id="reviews" className="w-full bg-white border-t border-black/15 py-16 text-black">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-black/10 pb-8 gap-4 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-heading text-[22px] sm:text-3xl md:text-[40px] font-semibold uppercase leading-none tracking-tight">
              Customer Reviews
            </h2>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = averageRating >= star
                  const isHalf = !isFilled && averageRating >= star - 0.5
                  return (
                    <StarIcon key={star} filled={isFilled} half={isHalf} />
                  )
                })}
              </div>
              <span className="text-[14px] font-medium tracking-[0.06em] text-black/60 uppercase">
                {averageRating} out of 5 ({totalCount} {totalCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-8 border border-black bg-black text-white hover:bg-white hover:text-black text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 cursor-pointer"
          >
            Write A Review
          </button>
        </div>

        {/* Reviews Layout */}
        <div className="grid gap-12 lg:grid-cols-[300px_1fr] pt-10">
          
          {/* Left Column: Breakdown */}
          <div className="space-y-6">
            <h3 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-black/80">
              Rating Breakdown
            </h3>
            <div className="space-y-3">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-3 text-sm">
                  <div className="flex w-12 items-center gap-1 text-[12px] font-medium text-black/60">
                    <span>{dist.stars}</span>
                    <Star className="h-3 w-3 fill-black/60 text-black/60" />
                  </div>
                  <div className="relative h-2 flex-1 bg-black/5 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-black transition-all duration-500 ease-out"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-[11px] font-semibold text-black/50">
                    {dist.percentage}%
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-[4px] bg-black/3 p-5 space-y-2 border border-black/5">
              <h4 className="text-[12px] font-bold uppercase tracking-[0.06em]">Fit Profile</h4>
              <p className="text-[11px] text-black/60 leading-relaxed uppercase">
                Based on customer feedback, this product fits true to size. 94% recommend going with your usual size.
              </p>
            </div>
          </div>
          {/* Right Column: Review List */}
          <div className="space-y-8">
            {reviews.length === 0 ? (
              <div className="py-12 text-center text-black/40 text-[14px] uppercase tracking-wider">
                No reviews yet. Be the first to write one!
              </div>
            ) : (
              <div className="space-y-8">
                {/* First 3 reviews */}
                {reviews.slice(0, 3).map((review, idx) => (
                  <div key={review.id} className={idx > 0 ? "border-t border-black/10 pt-8" : ""}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      {/* User Rating and Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-black text-black" : "text-black/15"}`} 
                              />
                            ))}
                          </div>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-wider text-[#5b8c38] uppercase">
                              <Check className="h-3 w-3 stroke-[3]" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        
                        <h4 className="mt-2 text-[15px] font-semibold uppercase tracking-[0.04em] text-black">
                          {review.title}
                        </h4>
                      </div>

                      {/* Date and Name */}
                      <div className="text-left sm:text-right">
                        <p className="text-[12px] font-semibold text-black/80">{review.name}</p>
                        <p className="text-[11px] text-black/45 uppercase tracking-wider">{review.date}</p>
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="mt-4 text-[14px] leading-relaxed text-black/70 font-sans max-w-3xl">
                      {review.body}
                    </p>

                    {/* Helpfulness and Actions */}
                    <div className="mt-6 flex items-center gap-4">
                      <button
                        onClick={() => handleHelpfulClick(review.id)}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors py-1 px-3 border rounded-full cursor-pointer ${
                          review.hasVoted 
                            ? "border-black bg-black text-white" 
                            : "border-black/10 bg-white text-black/60 hover:text-black hover:border-black/30"
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>Helpful ({review.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Extra reviews with smooth collapse/expand transition */}
                <AnimatePresence initial={false}>
                  {showAll && reviews.length > 3 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden space-y-8"
                    >
                      {reviews.slice(3).map((review) => (
                        <div key={review.id} className="border-t border-black/10 pt-8">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            {/* User Rating and Info */}
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-black text-black" : "text-black/15"}`} 
                                    />
                                  ))}
                                </div>
                                {review.verified && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-wider text-[#5b8c38] uppercase">
                                    <Check className="h-3 w-3 stroke-[3]" />
                                    Verified Buyer
                                  </span>
                                )}
                              </div>
                              
                              <h4 className="mt-2 text-[15px] font-semibold uppercase tracking-[0.04em] text-black">
                                {review.title}
                              </h4>
                            </div>

                            {/* Date and Name */}
                            <div className="text-left sm:text-right">
                              <p className="text-[12px] font-semibold text-black/80">{review.name}</p>
                              <p className="text-[11px] text-black/45 uppercase tracking-wider">{review.date}</p>
                            </div>
                          </div>

                          {/* Review Content */}
                          <p className="mt-4 text-[14px] leading-relaxed text-black/70 font-sans max-w-3xl">
                            {review.body}
                          </p>

                          {/* Helpfulness and Actions */}
                          <div className="mt-6 flex items-center gap-4">
                            <button
                              onClick={() => handleHelpfulClick(review.id)}
                              className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors py-1 px-3 border rounded-full cursor-pointer ${
                                review.hasVoted 
                                  ? "border-black bg-black text-white" 
                                  : "border-black/10 bg-white text-black/60 hover:text-black hover:border-black/30"
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>Helpful ({review.helpfulCount})</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {reviews.length > 3 && (
              <div className="pt-8 flex justify-center border-t border-black/10">
                <button
                  onClick={handleToggleShowAll}
                  className="inline-flex items-center justify-center border border-black/25 hover:border-black px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black transition-colors bg-white cursor-pointer"
                >
                  {showAll ? "Show Less" : `View All Comments (${totalCount})`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-black p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-black hover:opacity-60 transition-opacity cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                  <Check className="h-8 w-8 stroke-[2.5]" />
                </div>
                <h3 className="font-heading text-[22px] font-normal uppercase tracking-[0.06em]">
                  Review Submitted
                </h3>
                <p className="text-[12px] uppercase text-black/50 tracking-wider">
                  Thank you for your feedback.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-heading text-[24px] uppercase leading-none tracking-tight">
                    Write A Review
                  </h3>
                  <p className="text-[11px] uppercase tracking-wider text-black/45">
                    Share your thoughts on Clarte Club Heritage Oval.
                  </p>
                </div>

                {formError && (
                  <div className="bg-red-50 text-red-600 text-[12px] p-3 uppercase tracking-wider font-medium border border-red-200">
                    {formError}
                  </div>
                )}

                {/* Rating Input */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black/70">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-black transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= (hoverRating ?? rating)
                              ? "fill-black text-black"
                              : "text-black/15"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label htmlFor="rev-title" className="block text-[11px] font-bold uppercase tracking-wider text-black/70">
                    Review Title *
                  </label>
                  <input
                    id="rev-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setFormError("")
                      setTitle(e.target.value)
                    }}
                    placeholder="e.g. Fit is exceptional, color is rich"
                    className="w-full border border-black/20 bg-white p-3 text-[13px] uppercase tracking-wide placeholder-black/25 focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                {/* Body */}
                <div className="space-y-1.5">
                  <label htmlFor="rev-body" className="block text-[11px] font-bold uppercase tracking-wider text-black/70">
                    Review Body *
                  </label>
                  <textarea
                    id="rev-body"
                    required
                    rows={4}
                    value={body}
                    onChange={(e) => {
                      setFormError("")
                      setBody(e.target.value)
                    }}
                    placeholder="Tell us about the fabric drape, sizing, and color wash..."
                    className="w-full border border-black/20 bg-white p-3 text-[13px] font-sans placeholder-black/25 focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="rev-name" className="block text-[11px] font-bold uppercase tracking-wider text-black/70">
                      Your Name *
                    </label>
                    <input
                      id="rev-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setFormError("")
                        setName(e.target.value)
                      }}
                      placeholder="Arjun M."
                      className="w-full border border-black/20 bg-white p-3 text-[13px] uppercase tracking-wide placeholder-black/25 focus:border-black focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="rev-email" className="block text-[11px] font-bold uppercase tracking-wider text-black/70">
                      Email Address *
                    </label>
                    <input
                      id="rev-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setFormError("")
                        setEmail(e.target.value)
                      }}
                      placeholder="arjun@example.com"
                      className="w-full border border-black/20 bg-white p-3 text-[13px] placeholder-black/25 focus:border-black focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 bg-black text-white hover:bg-black/90 font-medium text-[11px] uppercase tracking-[0.14em] transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

function StarIcon({ filled, half }: { filled: boolean; half: boolean }) {
  const gradId = useId()
  return (
    <svg
      className={`h-4.5 w-4.5 ${filled ? "text-black fill-black" : half ? "text-black/50" : "text-black/15"}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      {half ? (
        <>
          <defs>
            <linearGradient id={gradId}>
              <stop offset="50%" stopColor="black" />
              <stop offset="50%" stopColor="#efefef" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${gradId})`}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </>
      ) : (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      )}
    </svg>
  )
}
