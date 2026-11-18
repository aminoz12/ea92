import Link from 'next/link'
import { CATEGORIES } from '@/lib/shop/categories'

// Department tiles — 3 compact columns on phones, 6 on desktop.
export function CategoryGrid({ limit }: { limit?: number }) {
  const cats = limit ? CATEGORIES.slice(0, limit) : CATEGORIES
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
      {cats.map((c) => (
        <Link
          key={c.id}
          href={`/boutique?categorie=${c.id}`}
          className="group flex flex-col items-center rounded-xl bg-white p-3 text-center ring-1 ring-gray-200 transition-shadow hover:shadow-md sm:p-4"
        >
          <img
            src={c.image}
            alt=""
            loading="lazy"
            className="h-14 w-14 object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24"
          />
          <span className="mt-2 font-display text-xs font-bold leading-tight text-gray-900 sm:mt-3 sm:text-sm">{c.name}</span>
          <span className="mt-1 hidden text-xs leading-snug text-gray-500 sm:block">{c.blurb}</span>
        </Link>
      ))}
    </div>
  )
}
