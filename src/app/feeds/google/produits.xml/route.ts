import { GOOGLE_MERCHANT } from '@/lib/shop/config'
import { productFeedXml } from '@/lib/integrations/googleMerchant.server'

// Google Merchant Center — products feed (scheduled fetch, daily).
// Off while the catalogue is demo data: preview with ?apercu=1, on a
// developer's machine only (the demo lines carry part references, which the
// public site must never give away).
export const dynamic = 'force-dynamic'

export function GET(req: Request) {
  const preview = process.env.NODE_ENV !== 'production' && new URL(req.url).searchParams.get('apercu') === '1'
  if (!GOOGLE_MERCHANT.enabled && !preview) return new Response('Not found', { status: 404 })
  return new Response(productFeedXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
