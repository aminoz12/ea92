import { redirect } from 'next/navigation'

// The PRO portal that lived here was a demonstration fed with made-up
// references, prices and credit lines (views/pro/ProPortalView, kept in the
// repo as the design to build from). It is not shown on the real site: a
// professional lands on the PRO offer, where the contact details are.
// A real portal needs accounts, a login and prices per customer.
export default function Page() {
  redirect('/pro')
}
