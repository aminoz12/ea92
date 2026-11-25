'use client'

import Link from 'next/link'
import { useShop } from '@/providers/ShopProvider'

/**
 * Where the real catalogue starts for this visitor: the part type (or all the
 * families) of their vehicle when it is known, the vehicle choice otherwise.
 */
export function useCatalogHref(genart?: number) {
  const { vehicle, hydrated } = useShop()
  const ktype = hydrated ? vehicle?.ktype : undefined
  if (!ktype) return '/pieces'
  return genart ? `/pieces/${ktype}/${genart}` : `/pieces/${ktype}`
}

/** A link into the real catalogue, see `useCatalogHref`. */
export function CatalogLink({ genart, className, children }: { genart?: number; className?: string; children: React.ReactNode }) {
  return (
    <Link href={useCatalogHref(genart)} className={className}>
      {children}
    </Link>
  )
}
