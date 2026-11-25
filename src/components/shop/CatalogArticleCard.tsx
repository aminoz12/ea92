import type { CatalogArticle } from '@/lib/integrations/autoprecision/catalog.server'
import { SITE } from '@/lib/site'
import { Icon } from '@/components/ui/Icon'
import { CatalogArticleBuy } from './CatalogOffers'

// A real catalogue article (TecDoc data) that fits the customer's vehicle.
// Same frame as the shop's ProductCard. Price and stock come live from the
// supplier (see CatalogOffers): with an offer the card sells the part, without
// one it sends the customer to WhatsApp with the exact reference.
//
// `vehicleName` is the vehicle the list was built for. Without it (search by
// reference) nothing is known about the fit, and the card says so.
export function CatalogArticleCard({ article, vehicleName, listHref }: { article: CatalogArticle; vehicleName?: string; listHref: string }) {
  const title = article.genart?.name ?? article.designation ?? 'Pièce'
  // What tells two similar parts apart: fitting details first, then the part's own specs.
  const facts = [...article.fitment, ...article.attributes].slice(0, 4)
  const message = `Bonjour, je souhaite le prix et la disponibilité de : ${title} ${article.brand} ${article.artNr}${vehicleName ? `, pour ${vehicleName}` : ''}.`

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
        {article.image ? (
          // Pictures come from the supplier's CDN at a fixed size: no need for the Next optimiser.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.image} alt={`${title} ${article.brand} ${article.artNr}`} loading="lazy" decoding="async" className="h-full w-full object-contain p-2" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-300">
            <Icon name="box" className="h-12 w-12" />
          </div>
        )}
        {article.side && (
          <span className="absolute left-0 top-0 rounded-md bg-gray-900 px-2 py-1 font-display text-xs font-semibold uppercase leading-none tracking-wide text-white">
            {article.side}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-xs">
          {article.brandLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.brandLogo} alt={article.brand} loading="lazy" className="h-4 w-auto max-w-[72px] object-contain" />
          ) : (
            <span className="font-display font-bold uppercase tracking-wide text-gray-800">{article.brand}</span>
          )}
          <span className="truncate text-gray-500">{article.artNr}</span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900">
          {title}
          {article.designation && article.genart ? <span className="font-normal text-gray-500"> · {article.designation}</span> : null}
        </h3>

        {facts.length > 0 && (
          <ul className="mt-2 space-y-0.5 text-[13px] leading-snug">
            {facts.map((f, i) => (
              <li key={i} className="truncate text-gray-500" title={`${f.name} : ${f.value}`}>
                {f.name} : <span className="font-medium text-gray-800">{f.value}</span>
              </li>
            ))}
          </ul>
        )}

        {vehicleName ? (
          <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-gray-700">
            <Icon name="check-circle" weight="fill" className="h-4 w-4 shrink-0 text-emerald-600" />
            Compatible avec votre véhicule
          </p>
        ) : (
          <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-gray-600">
            <Icon name="info" weight="fill" className="h-4 w-4 shrink-0 text-gray-400" />
            Compatibilité à vérifier
          </p>
        )}

        <CatalogArticleBuy
          article={{ artNr: article.artNr, dlNr: article.dlNr, brand: article.brand, title, image: article.image, listHref }}
          askHref={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`}
        />
      </div>
    </article>
  )
}
