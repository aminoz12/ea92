import type { Metadata } from 'next'
import { CartView } from '@/views/shop/CartView'

export const metadata: Metadata = {
  title: 'Mon panier',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <CartView />
}
