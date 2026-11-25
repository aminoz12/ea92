import type { Metadata } from 'next'
import { HomePage } from '@/views/HomePage'

// /fr is the same content as the home page — point the canonical to / to avoid
// duplicate-content issues.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function Page() {
  return <HomePage />
}
