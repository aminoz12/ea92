import 'server-only'

// ---------------------------------------------------------------------------
//  AutoPrécision — EasyOrder API, server side only.
//  Real-time availability and prices at the suppliers set up on the account,
//  then supplier orders.
//
//  Env: AUTOPRECISION_EASYORDER_API_URL, AUTOPRECISION_EASYORDER_TOKEN
//  Auth: header X-Auth-Token. Amounts are excl. VAT (HT).
//
//  The address AutoPrécision opened is the PRODUCTION service (there is no
//  test environment): listing suppliers and asking availability are harmless,
//  an order is real.
//
//  Checked against real answers on 24 Nov 2026 (24 suppliers on the account):
//   - the answers carry our purchase price and sometimes the manufacturer's
//     public price, never a selling price (`saleBase` / `saleFixed` absent);
//   - no supplier is flagged `isPrincipal`;
//   - `deliveryDate` has no time zone: it is French local time;
//   - the plain availability route waits for the slowest supplier (30 s and
//     more); the streaming route gives most suppliers within 3 s.
//  The order routes have never been called.
//
//  ⚠️ placeOrder() sends a REAL order to a supplier. It refuses to run unless
//  AUTOPRECISION_ORDERS_ENABLED is exactly "true".
// ---------------------------------------------------------------------------

export class EasyOrderError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
  }
}

export const isEasyOrderConfigured = () => Boolean(process.env.AUTOPRECISION_EASYORDER_API_URL && process.env.AUTOPRECISION_EASYORDER_TOKEN)
export const areSupplierOrdersEnabled = () => process.env.AUTOPRECISION_ORDERS_ENABLED === 'true'

async function call<T>(path: string, body?: unknown): Promise<T> {
  const base = process.env.AUTOPRECISION_EASYORDER_API_URL
  const token = process.env.AUTOPRECISION_EASYORDER_TOKEN
  if (!base || !token) throw new EasyOrderError('EasyOrder non configuré')

  let res: Response
  try {
    res = await fetch(base.replace(/\/$/, '') + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'X-Auth-Token': token, Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store', // prices and stock are live
      signal: AbortSignal.timeout(20_000),
    })
  } catch (err) {
    throw new EasyOrderError(`EasyOrder injoignable (${err instanceof Error ? err.message : 'erreur réseau'})`)
  }
  // Errors come as RFC 7807 bodies; the spec says to trust the HTTP code.
  if (!res.ok) throw new EasyOrderError(`EasyOrder : HTTP ${res.status}`, res.status)
  return (await res.json()) as T
}

/* ------------------------------------------------------------------ */
/*  Shapes (subset of the OpenAPI schemas)                             */
/* ------------------------------------------------------------------ */

/** One supplier enabled on the account. */
export interface ConnectorConfig {
  connectorConfId: number
  connectorConfLabel?: string
  connectorLabel?: string
  connectorType?: string
  canOrder?: boolean
  isErp?: boolean
  isPrincipal?: boolean
  deliveryMethods?: string[]
  defaultDeliveryMethod?: string | null
}

/** An article is identified by its reference and its TecDoc manufacturer code. */
export interface ArticleInput {
  artNr: string
  dlNr?: number
  quantity?: number
  /** Supplier's own id for the article: send back what the availability call returned. */
  supplierArticleIdentifier?: string
}

export interface AvailabilityDetail {
  status?: 'OK' | 'ERROR'
  statusText?: string
  availability?: 'AVAILABLE' | 'SHORTAGE' | 'UNKNOWN' | 'INSUFFICIENT_STOCK'
  supplierArticleIdentifier?: string
  currentAvailability?: number
  projectedAvailability?: number
  minPurchaseQuantity?: number
  multiplePurchaseQuantity?: number
  packagingQuantity?: number
  dateQualifier?: 'AT' | 'BEFORE' | 'AFTER'
  /** Delivery to the shop, French local time without a zone ("2026-11-25T12:00:00"). */
  deliveryDate?: string
  /** Manufacturer's public price. Suppliers that do not know it send 0 or nothing. */
  publicPrice?: number
  purchaseBase?: number
  purchaseFixed?: number
  saleBase?: number
  saleFixed?: number
  totalDiscount?: number
  prixConsigne?: number
  shippingCost?: number
  depot?: string
}

export interface ConnectorAvailability {
  connectorConfId: number
  connectorLabel?: string
  connectorConfLabel?: string
  isPrincipal?: boolean
  connectorResponse?: AvailabilityDetail
}

export interface ArticleAvailability extends ArticleInput {
  /** One entry per supplier asked. A failing supplier does not fail the call: its entry has status ERROR. */
  responses?: ConnectorAvailability[]
}

export interface SupplierOrderRequest {
  /** Our own order reference; the supplier keeps it and it is used for tracking. */
  orderRef: string
  note?: string
  /** Must be one of the connector's deliveryMethods; its default applies when left out. */
  deliveryMethod?: string
  articles: ArticleInput[]
}

export interface SupplierOrderResult {
  orderNumber?: string
  articles?: (ArticleInput & {
    response?: { connectorConfId?: number; connectorResponse?: { orderStatus?: 'OK' | 'ERROR'; statusText?: string } }
  })[]
}

/* ------------------------------------------------------------------ */
/*  Calls                                                              */
/* ------------------------------------------------------------------ */

/** Suppliers enabled on the account. No supplier is queried: the answer is immediate. */
export const listConnectorConfigs = () => call<ConnectorConfig[]>('/connectors/configs')

/**
 * Live availability and prices. Without `connectorConfId` every supplier of
 * the account is asked in parallel; with it, only that one.
 * The answer comes once the slowest supplier has replied or timed out (30 s on
 * their side): fine for one supplier, too slow for a page. Pages use
 * `streamAvailability`.
 */
export function checkAvailability(articles: ArticleInput[], connectorConfId?: number): Promise<ArticleAvailability[]> {
  const query = connectorConfId === undefined ? '' : `?connectorConfId=${connectorConfId}`
  return call<ArticleAvailability[]>(`/connectors/availability${query}`, articles)
}

const articleKey = (a: Pick<ArticleInput, 'artNr' | 'dlNr'>) => `${a.dlNr ?? ''}|${a.artNr}`

/**
 * Same question through the streaming route: each supplier's answer is taken
 * as it arrives, and after `deadlineMs` the call returns with what the faster
 * suppliers said. The articles come back in the order given, each with the
 * answers received so far (possibly none).
 */
export async function streamAvailability(articles: ArticleInput[], deadlineMs = 6_000): Promise<ArticleAvailability[]> {
  const base = process.env.AUTOPRECISION_EASYORDER_API_URL
  const token = process.env.AUTOPRECISION_EASYORDER_TOKEN
  if (!base || !token) throw new EasyOrderError('EasyOrder non configuré')

  const merged = new Map<string, ArticleAvailability>(articles.map((a) => [articleKey(a), { ...a, responses: [] }]))
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), deadlineMs)
  let events = 0

  /** One server-sent event: `availability` carries one supplier's answers, `complete` ends the stream. */
  const take = (block: string) => {
    let event = 'message'
    const data: string[] = []
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim()
      else if (line.startsWith('data:')) data.push(line.slice(5).trimStart())
    }
    if (event === 'complete') return true
    if (!data.length) return false
    events++
    let rows: ArticleAvailability[]
    try {
      rows = JSON.parse(data.join('\n')) as ArticleAvailability[]
    } catch {
      return false // a malformed event must not lose the others
    }
    for (const row of Array.isArray(rows) ? rows : []) {
      const target = merged.get(articleKey(row))
      if (target) target.responses!.push(...(row.responses ?? []))
    }
    return false
  }

  try {
    const res = await fetch(base.replace(/\/$/, '') + '/connectors/availability/stream', {
      method: 'POST',
      headers: { 'X-Auth-Token': token, Accept: 'text/event-stream', 'Content-Type': 'application/json' },
      body: JSON.stringify(articles),
      cache: 'no-store',
      signal: ctrl.signal,
    })
    if (!res.ok || !res.body) throw new EasyOrderError(`EasyOrder : HTTP ${res.status}`, res.status)
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    reading: for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n')
      let end: number
      while ((end = buffer.indexOf('\n\n')) !== -1) {
        const complete = take(buffer.slice(0, end))
        buffer = buffer.slice(end + 2)
        if (complete) break reading
      }
    }
  } catch (err) {
    if (err instanceof EasyOrderError) throw err
    // Deadline reached with some answers in hand: that is the normal case, the slow suppliers are left out.
    if (!ctrl.signal.aborted || events === 0) {
      throw new EasyOrderError(`EasyOrder injoignable (${ctrl.signal.aborted ? `aucune réponse en ${deadlineMs} ms` : err instanceof Error ? err.message : 'erreur réseau'})`)
    }
  } finally {
    clearTimeout(timer)
    ctrl.abort() // closes the connection when we stopped reading on `complete`
  }
  return articles.map((a) => merged.get(articleKey(a))!)
}

/** Sends a firm order to one supplier. Real, and not reversible from here. */
export async function placeOrder(connectorConfId: number, order: SupplierOrderRequest): Promise<SupplierOrderResult> {
  if (!areSupplierOrdersEnabled()) {
    throw new EasyOrderError('Commandes fournisseur désactivées (AUTOPRECISION_ORDERS_ENABLED n’est pas "true")')
  }
  return call<SupplierOrderResult>(`/connectors/${connectorConfId}/order/order`, order)
}
