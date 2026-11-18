import Link from 'next/link'
import { Icon } from './Icon'

// Left-aligned section title with an optional "see all" link (shop style).
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  link,
  aside,
  tone = 'light',
  as: Tag = 'h2',
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  link?: { href: string; label: string }
  aside?: React.ReactNode // replaces the link on the right (e.g. a rating badge)
  tone?: 'light' | 'dark'
  as?: 'h1' | 'h2'
}) {
  const dark = tone === 'dark'
  return (
    <div className={`mb-6 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between ${dark ? 'border-white/10' : 'border-gray-200'}`}>
      <div>
        {eyebrow && (
          <p className={`mb-1.5 text-xs font-bold uppercase tracking-[0.18em] ${dark ? 'text-secondary-400' : 'text-secondary-600'}`}>
            {eyebrow}
          </p>
        )}
        <Tag className={`font-display text-3xl font-bold leading-tight lg:text-4xl ${dark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </Tag>
        {subtitle && <p className={`mt-1.5 max-w-2xl text-sm sm:text-base ${dark ? 'text-white/70' : 'text-gray-500'}`}>{subtitle}</p>}
      </div>
      {aside}
      {!aside && link && (
        <Link
          href={link.href}
          className={`inline-flex shrink-0 items-center gap-1.5 text-sm font-bold ${dark ? 'text-white hover:text-secondary-300' : 'text-secondary-600 hover:text-secondary-700'}`}
        >
          {link.label}
          <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.2} />
        </Link>
      )}
    </div>
  )
}
