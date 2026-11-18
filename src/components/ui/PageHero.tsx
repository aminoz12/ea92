import Image from 'next/image'

// Dark photo hero shared by the content pages (same look as /pro and
// /montage-garage). The photo goes through next/image: resized and served
// as WebP/AVIF instead of the multi-megabyte source PNG.
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imagePosition = 'center',
  stats,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  intro?: React.ReactNode
  image: string
  imagePosition?: string
  stats?: { value: string; label: string }[]
  children?: React.ReactNode // call-to-action buttons
}) {
  return (
    <section className="relative overflow-hidden bg-gray-900 text-white">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-40" style={{ objectPosition: imagePosition }} />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/85 to-gray-900/20" />
      <div className="relative max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-400">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-tight lg:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-white/80">{intro}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        {stats && (
          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 backdrop-blur-sm">
                <dt className="font-display text-2xl font-extrabold">{s.value}</dt>
                <dd className="text-xs text-white/70">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}

export const heroPrimaryBtn =
  'inline-flex h-12 items-center gap-2 rounded-xl bg-secondary-600 px-6 font-display font-bold text-white hover:bg-secondary-700'
export const heroSecondaryBtn =
  'inline-flex h-12 items-center gap-2 rounded-xl bg-white/10 px-6 font-semibold text-white ring-1 ring-white/30 hover:bg-white/20'
