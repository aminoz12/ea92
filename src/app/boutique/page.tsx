import { redirect } from 'next/navigation'

// The shop runs on the real parts catalogue: vehicle → part families → articles,
// under /pieces. Every "Boutique" link of the site lands there.
//
// The demo product list that used to be this page (views/shop/CatalogView, fed
// by lib/shop/catalog.server) is no longer linked from here; its product pages
// (/boutique/<slug>) still exist for the home-page sections that use them.
export default function Page() {
  redirect('/pieces')
}
