import { GOOGLE_MERCHANT } from '@/lib/shop/config'
import { localInventoryTsv } from '@/lib/integrations/googleMerchant.server'

// Google Merchant Center — local (in-store) inventory feed for the Nanterre store.
// Off while the catalogue is demo data: preview with ?apercu=1, on a
// developer's machine only (the demo lines carry part references, which the
// public site must never give away).
export const dynamic = 'force-dynamic'

export function GET(req: Request) {
  const preview = process.env.NODE_ENV !== 'production' && new URL(req.url).searchParams.get('apercu') === '1'
  if (!GOOGLE_MERCHANT.enabled && !preview) return new Response('Not found', { status: 404 })
  return new Response(localInventoryTsv(), {
    headers: {
      'Content-Type': 'text/tab-separated-values; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=0, s-maxage=900',
    },
  })
}
