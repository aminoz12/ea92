import type { BlogIconName } from '@/lib/blog'

// Presentational-only (no hooks) so it works in both server and client trees.
export function BlogIcon({ name, className }: { name: BlogIconName; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true,
  } as const

  switch (name) {
    case 'brake':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3.5" />
          <path strokeLinecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        </svg>
      )
    case 'filter':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 4v3l5 5v7l2 1v-8l5-5V4" />
        </svg>
      )
    case 'battery':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="11" rx="2" />
          <path strokeLinecap="round" d="M7 7V5h3v2M14 7V5h3v2M8 12h3M9.5 10.5v3M14 12h2" />
        </svg>
      )
    case 'belt':
      return (
        <svg {...common}>
          <circle cx="8" cy="12" r="4" />
          <circle cx="17" cy="12" r="2.5" />
          <path strokeLinecap="round" d="M8 8h9M8 16h9" />
        </svg>
      )
    case 'road':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 21l2-18M16 21l-2-18M12 6v2M12 12v2M12 18v1" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
        </svg>
      )
  }
}
