import { Hero } from "@/components/home/Hero"
import { DenimCarousel } from "@/components/home/DenimCarousel"
import { MotionBannerSection } from "@/components/home/MotionBannerSection"
import { LaunchOfferBar } from "@/components/home/LaunchOfferBar"
import { TrendingSection } from "@/components/home/TrendingSection"
import { MadeWithCare } from "@/components/home/MadeWithCare"
import { InstagramSection } from "@/components/home/InstagramSection"
import { TrustStrip } from "@/components/home/TrustStrip"

export const dynamic = "force-dynamic"

// Flow: hero -> offer -> products -> brand film -> collections -> quality reassurance -> social -> trust/payments
export default function Home() {
  return (
    <main className="flex-1 -mt-[var(--header-stack-height)] bg-black">
      <Hero />
      <LaunchOfferBar />
      <TrendingSection />
      <MotionBannerSection />
      <DenimCarousel />
      <MadeWithCare />
      <InstagramSection />
      <TrustStrip />
    </main>
  )
}
