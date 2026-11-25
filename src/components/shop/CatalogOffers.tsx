'use client'

// Price, availability and "add to cart" for the real catalogue articles shown
// on one page. A single request covers the page; it is made in the browser so
// the list itself never waits for the suppliers' answer.
//
// Articles are only known here by their opaque token: this file runs in the
// browser and must never receive a part's reference (see
// lib/shop/articleToken.server.ts).

import { createContext, useContext, useEffect, useState } from 'react'
import type { ArticleOffer } from '@/lib/shop/offers.server'
import { formatEUR } from '@/lib/shop/format'
import { useShop } from '@/providers/ShopProvider'
import { Icon, WhatsAppIcon } from '@/components/ui/Icon'
import { StockBadge } from './StockBadge'

interface OffersState {
  /** 'off' = no live supplier connection: nothing to wait for. */
  status: 'off' | 'loading' | 'ready'
  offers: Map<string, ArticleOffer>
}

const OffersContext = createContext<OffersState>({ status: 'off', offers: new Map() })

export function CatalogOffersProvider({
  live,
  articles,
  children,
}: {
  /** Decided on the server: is a supplier platform connected? */
  live: boolean
  /** Tokens of the articles on the page. */
  articles: string[]
  children: React.ReactNode
}) {
  const [state, setState] = useState<OffersState>({ status: live ? 'loading' : 'off', offers: new Map() })
  // The list is a new array on every server render: compare by content.
  const signature = articles.join(',')

  useEffect(() => {
    if (!live || !signature) {
      setState({ status: 'off', offers: new Map() })
      return
    }
    const ctrl = new AbortController()
    setState({ status: 'loading', offers: new Map() })
    fetch('/api/catalog/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles }),
      signal: ctrl.signal,
    })
      .then((res) => res.json())
      .then((json: { offers?: ArticleOffer[] }) => setState({ status: 'ready', offers: new Map((json.offers ?? []).map((o) => [o.id, o])) }))
      .catch((err: unknown) => {
        // No answer: every card falls back to "sur demande".
        if (!(err instanceof DOMException && err.name === 'AbortError')) setState({ status: 'ready', offers: new Map() })
      })
    return () => ctrl.abort()
    // `articles` is covered by `signature`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, signature])

  return <OffersContext.Provider value={state}>{children}</OffersContext.Provider>
}

export interface BuyableArticle {
  /** The article's opaque token. */
  id: string
  brand: string
  title: string
  image?: string
  /** The catalogue list this article was found in: where the cart links back to. */
  listHref: string
}

/** Bottom of an article card: price + cart when the supplier has the part, a price request otherwise. */
export function CatalogArticleBuy({ article, askHref }: { article: BuyableArticle; askHref: string }) {
  const { status, offers } = useContext(OffersContext)
  const { addToCart } = useShop()
  const offer = offers.get(article.id)

  if (status === 'loading') {
    return (
      <div className="mt-auto pt-3" aria-busy="true">
        <p className="text-[13px] text-gray-500">Recherche du prix chez nos fournisseurs…</p>
        <div className="mt-2 h-11 animate-pulse rounded-lg bg-gray-100" />
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="mt-auto pt-3">
        <p className="text-[13px] text-gray-500">Prix et disponibilité sur demande</p>
        <a
          href={askHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 font-display text-sm font-bold text-white transition-colors hover:bg-gray-800"
        >
          <WhatsAppIcon className="h-4 w-4 text-green-400" /> Demander le prix
        </a>
      </div>
    )
  }

  const add = () =>
    addToCart({
      // A catalogue line is identified by the article token alone; it has no visible reference.
      slug: `art-${article.id}`,
      reference: '',
      brand: article.brand,
      name: article.title,
      image: article.image ?? '',
      href: article.listHref,
      priceTTC: offer.priceTTC,
      depositTTC: offer.depositTTC,
    })

  return (
    <div className="mt-auto pt-3">
      <StockBadge availability={offer.availability} />
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0 leading-tight">
          <span className="block font-display text-2xl font-bold leading-none text-gray-900">{formatEUR(offer.priceTTC)}</span>
          <span className="mt-1 block text-[11px] text-gray-500">
            Prix TTC{offer.depositTTC ? ` · + ${formatEUR(offer.depositTTC)} consigne` : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={add}
          aria-label={`Ajouter ${article.title} ${article.brand} au panier`}
          title="Ajouter au panier"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors hover:bg-secondary-600 active:translate-y-px"
        >
          <Icon name="cart" weight="bold" className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
