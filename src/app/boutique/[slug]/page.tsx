import { redirect } from 'next/navigation'

// The demo product pages that lived here are gone with the demo catalogue: the
// shop sells the real parts catalogue, per vehicle, under /pieces. Old links
// (bookmarks, a cart saved in the browser) land on the vehicle choice.
export default function Page() {
  redirect('/pieces')
}
