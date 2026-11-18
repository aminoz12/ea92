import type { Metadata } from 'next'
import { ProPortalView } from '@/views/pro/ProPortalView'
import { getProCatalog } from '@/lib/shop/catalog.server'

export const metadata: Metadata = {
  title: 'Espace Pro (démo)',
  robots: { index: false, follow: false },
}

// DEMO of the white-label PRO portal. In production this route sits behind a
// login, and prices/encours come from the server for the logged-in account.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const ref = (Array.isArray(sp.ref) ? sp.ref[0] : sp.ref) ?? ''
  // Only net PRO prices leave the server — never purchase prices or RFA.
  const catalog = getProCatalog()
  return <ProPortalView key={ref} catalog={catalog} initialRef={ref.slice(0, 40)} />
}
