// Persistent scam-warning banner shown above the navbar on every page.
// Espace Auto 92 does NOT sell parts on Facebook / social networks — this
// notice warns customers against impersonation scams.
//
// NOTE: this bar sits inside the fixed <Header>, so its height adds to the
// fixed-header height. Keep the messages short enough to stay on ONE line
// (a wrapping bar would grow taller than the page top-offsets allow). If you
// lengthen them, bump the `pt-*` offsets on the pages that clear the header.
export function AnnouncementBar() {
  const WarningIcon = ({ className }: { className: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  )

  return (
    <div
      role="alert"
      className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white shadow-md ring-1 ring-inset ring-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 px-3 py-2.5 text-center">
        <WarningIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 animate-pulse text-yellow-300" />

        <p className="font-display font-extrabold uppercase tracking-wide leading-snug text-sm md:text-base lg:text-lg">
          {/* Shorter wording on phones so the bar stays on one line */}
          <span className="sm:hidden">
            Arnaques : Espace Auto 92 ne vend{' '}
            <span className="text-yellow-300">rien sur Facebook</span>&nbsp;!
          </span>
          <span className="hidden sm:inline">
            Attention aux arnaques : Espace Auto 92 ne vend{' '}
            <span className="text-yellow-300">rien sur Facebook</span>
          </span>
        </p>

        {/* Second icon on wider screens for a more balanced, noticeable bar */}
        <WarningIcon className="hidden sm:block w-6 h-6 shrink-0 animate-pulse text-yellow-300" />
      </div>
    </div>
  )
}
