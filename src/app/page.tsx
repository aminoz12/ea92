import { HomePage } from '@/views/HomePage'
import { getPublicCatalog } from '@/lib/shop/catalog.server'
import { faqSchema } from '@/lib/structuredData'

export default function Page() {
  return (
    <>
      {/* FAQ structured data for rich results / answer engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePage products={getPublicCatalog()} />
    </>
  )
}
