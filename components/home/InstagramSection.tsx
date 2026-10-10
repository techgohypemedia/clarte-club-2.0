import Image from "next/image"

/*
 * Instagram posts on the homepage.
 *
 * HOW TO ADD POSTS: save each post's image in /public/images/instagram/ and add it below with the link to the
 * post. Use 6 posts (2 rows of 3 on phones, 1 row of 6 on desktop). The section stays hidden while this list is
 * empty, so nothing fake is ever shown.
 *
 *   { image: "/images/instagram/post-1.webp", href: "https://www.instagram.com/p/XXXXXXXX/", alt: "Short description" },
 *
 * Static images (not Instagram's embed script) keep the page light: the embed loads ~1 MB of third-party
 * JavaScript per page view.
 */
const INSTAGRAM_HANDLE = "clarteclub.official"

const posts: { image: string; href: string; alt: string }[] = []

export function InstagramSection() {
  if (posts.length === 0) return null

  return (
    <section id="instagram" className="w-full bg-white px-4 pb-14 text-[#0F0F10] sm:px-6 lg:px-8 md:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9B07A]">On Instagram</p>
          <h2 className="font-heading text-[22px] font-semibold uppercase leading-none tracking-tight sm:text-3xl md:text-[40px]">
            @{INSTAGRAM_HANDLE}
          </h2>
        </div>

        <ul className="mt-8 grid grid-cols-3 gap-1.5 sm:gap-2 lg:grid-cols-6">
          {posts.map((post) => (
            <li key={post.href}>
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-square overflow-hidden rounded-[8px] bg-[#f4f4f4]"
              >
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-opacity duration-200 hover:opacity-90"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex justify-center">
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center border border-black/25 px-6 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-black hover:text-white"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
