// Persistent scam-warning banner shown above the navbar on every page.
// Espace Auto 92 does NOT sell parts on Facebook / social networks — this
// notice warns customers against impersonation scams.
export function AnnouncementBar() {
  return (
    <div
      role="alert"
      className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 px-4 py-2 text-center">
        <svg
          className="w-5 h-5 shrink-0 animate-pulse"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <p className="font-display font-bold uppercase tracking-wide leading-tight text-sm sm:text-base">
          {/* Shorter wording on phones so the bar stays on one line */}
          <span className="sm:hidden">Arnaques : nous ne vendons pas sur Facebook&nbsp;!</span>
          <span className="hidden sm:inline">
            Attention aux arnaques — Espace Auto 92 ne vend aucune pièce sur Facebook ni sur les réseaux sociaux.
          </span>
        </p>
      </div>
    </div>
  )
}
