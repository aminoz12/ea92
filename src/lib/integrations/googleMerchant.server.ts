import 'server-only'

// ---------------------------------------------------------------------------
//  Google Merchant Center feeds — online products + in-store (local) stock.
//  Setup guide: docs/google-merchant-center.md
//
//  One Google item per brand offer (same `id` in both feeds):
//   - products feed (RSS 2.0, g: namespace): what is sold online, at what price
//   - local inventory feed (TSV): what the Nanterre store has on the shelf
//       magasin          → in_stock + quantity, pickup "buy", "same day"
//       fournisseur_4h   → out_of_stock + pickup "ship to store", "same day"
//       fournisseur_24h  → out_of_stock + pickup "ship to store", "next day"
//     ("pickup later": Google can still advertise out-of-stock items that
//     reach the store for pickup.)
//  Only public data is used (never purchase prices or RFA).
// ---------------------------------------------------------------------------

import { getPublicCatalog } from '../shop/catalog.server'
import { GOOGLE_MERCHANT } from '../shop/config'
import { SITE } from '../site'
import type { Availability } from '../shop/types'

export interface MerchantItem {
  id: string
  title: string
  description: string
  link: string
  imageLink: string
  priceTTC: number
  brand: string
  mpn: string
  productType: string
  shippingWeightKg: number
  shippingLabel?: string
  local: { availability: 'in_stock' | 'out_of_stock'; quantity?: number; pickupMethod: string; pickupSla: string }
}

export interface ExcludedItem {
  id: string
  reason: string
}

// Google accepts JPEG, PNG, GIF, WebP, BMP and TIFF — not SVG.
const GOOGLE_IMAGE = /\.(jpe?g|png|gif|webp|bmp|tiff?)$/i

/** Stable item id (max 50 chars), shared by both feeds. */
const itemId = (brand: string, reference: string) =>
  `${brand}-${reference}`.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50)

const LOCAL: Record<Availability, MerchantItem['local']> = {
  magasin: { availability: 'in_stock', pickupMethod: 'buy', pickupSla: 'same day' },
  fournisseur_4h: { availability: 'out_of_stock', pickupMethod: 'ship to store', pickupSla: 'same day' },
  fournisseur_24h: { availability: 'out_of_stock', pickupMethod: 'ship to store', pickupSla: 'next day' },
}

export function buildMerchantItems(): { items: MerchantItem[]; excluded: ExcludedItem[] } {
  const items: MerchantItem[] = []
  const excluded: ExcludedItem[] = []
  const seen = new Set<string>()

  for (const p of getPublicCatalog()) {
    for (const o of p.offers) {
      const id = itemId(o.brand, o.reference)
      if (seen.has(id)) {
        excluded.push({ id, reason: 'identifiant en double' })
        continue
      }
      seen.add(id)
      if (!GOOGLE_IMAGE.test(p.image)) {
        excluded.push({ id, reason: 'image SVG refusée par Google : ajouter une photo JPG, PNG ou WebP' })
        continue
      }
      if (p.depositTTC) {
        excluded.push({ id, reason: 'pièce consignée : affichage prix + consigne à valider avant diffusion' })
        continue
      }
      items.push({
        id,
        title: `${o.brand} ${p.name} ${o.reference}`.slice(0, 150),
        description: `${p.description} Retrait en magasin à Nanterre, coursier en Île-de-France ou expédition partout en France.`.slice(0, 5000),
        link: `${SITE.url}/boutique/${p.slug}?ref=${encodeURIComponent(o.reference)}`,
        imageLink: `${SITE.url}${encodeURI(p.image)}`,
        priceTTC: o.priceTTC,
        brand: o.brand,
        mpn: o.reference,
        productType: p.categoryName,
        shippingWeightKg: p.weightKg,
        // Batteries can't travel as parcels: map this label to "no shipping"
        // (or courier only) in Merchant Center shipping settings.
        shippingLabel: p.parcelForbidden ? 'sans-colis' : undefined,
        local: { ...LOCAL[o.availability], quantity: o.availability === 'magasin' ? (o.stock ?? 0) : undefined },
      })
    }
  }
  return { items, excluded }
}

const xml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export function productFeedXml(): string {
  const { items, excluded } = buildMerchantItems()
  const body = items
    .map((i) =>
      [
        '<item>',
        `<g:id>${xml(i.id)}</g:id>`,
        `<g:title>${xml(i.title)}</g:title>`,
        `<g:description>${xml(i.description)}</g:description>`,
        `<g:link>${xml(i.link)}</g:link>`,
        `<g:image_link>${xml(i.imageLink)}</g:image_link>`,
        // Online: everything in the catalogue can be ordered (supplier parts
        // ship after preparation — set the handling time in Merchant Center).
        '<g:availability>in_stock</g:availability>',
        `<g:price>${i.priceTTC.toFixed(2)} EUR</g:price>`,
        `<g:brand>${xml(i.brand)}</g:brand>`,
        `<g:mpn>${xml(i.mpn)}</g:mpn>`,
        '<g:condition>new</g:condition>',
        `<g:product_type>${xml(i.productType)}</g:product_type>`,
        `<g:shipping_weight>${i.shippingWeightKg} kg</g:shipping_weight>`,
        i.shippingLabel ? `<g:shipping_label>${xml(i.shippingLabel)}</g:shipping_label>` : '',
        '</item>',
      ]
        .filter(Boolean)
        .join(''),
    )
    .join('\n')

  const skipped = excluded.map((e) => `  ${e.id} : ${e.reason}`).join('\n').replace(/--/g, '—')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>${xml(SITE.name)}</title>
<link>${xml(SITE.url)}</link>
<description>${xml(SITE.shortDescription)}</description>
<!-- ${items.length} articles. Exclus (${excluded.length}) :
${skipped}
-->
${body}
</channel>
</rss>
`
}

export function localInventoryTsv(): string {
  const { items } = buildMerchantItems()
  const header = ['store_code', 'id', 'availability', 'quantity', 'pickup_method', 'pickup_sla']
  const rows = items.map((i) =>
    [GOOGLE_MERCHANT.storeCode, i.id, i.local.availability, i.local.quantity ?? '', i.local.pickupMethod, i.local.pickupSla].join('\t'),
  )
  return [header.join('\t'), ...rows].join('\n') + '\n'
}
