'use client'

import { useEffect, useState } from 'react'

// Smoothly scroll to the parts-ordering form (the hero's "search" target while
// the real vehicle lookup is not wired up yet).
function scrollToParts() {
  document.getElementById('parts-ordering')?.scrollIntoView({ behavior: 'smooth' })
}

/* ------------------------------------------------------------------ */
/*  Left column — vehicle identification card                          */
/* ------------------------------------------------------------------ */

function VehicleFinder() {
  const [plate, setPlate] = useState('')
  const [part, setPart] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Visual-only for now: send the user to the parts-ordering form.
    scrollToParts()
  }

  return (
    <div className="w-full rounded-3xl bg-white shadow-xl ring-1 ring-gray-100 p-6 sm:p-8">
      <h2 className="text-center text-2xl font-display font-bold text-gray-900 mb-6">
        Je commande ma pièce !
      </h2>

      <form onSubmit={handleSubmit}>
        {/* License-plate style input */}
        <div className="flex items-stretch h-14 rounded-xl overflow-hidden ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-secondary-500">
          {/* EU "F" band */}
          <div className="flex items-center justify-center bg-[#003399] px-2.5 select-none">
            <span className="text-white font-bold text-base leading-none">F</span>
          </div>
          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="AA-456-BB"
            aria-label="Plaque d'immatriculation"
            className="flex-1 min-w-0 px-4 text-center text-lg font-bold tracking-wider text-gray-900 placeholder:text-gray-400 placeholder:font-semibold outline-none"
          />
        </div>

        {/* Part searched */}
        <input
          type="text"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          placeholder="Pièce recherchée"
          aria-label="Pièce recherchée"
          className="mt-4 w-full h-14 px-4 rounded-xl text-base text-gray-900 placeholder:text-gray-400 outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-secondary-500"
        />

        <button
          type="submit"
          className="mt-4 w-full h-14 rounded-xl bg-secondary-600 hover:bg-secondary-700 text-white font-display font-bold text-base shadow-lg hover:shadow-xl transition-all"
        >
          Vérifier la disponibilité
        </button>
      </form>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Right column — promo carousel                                      */
/* ------------------------------------------------------------------ */

interface Slide {
  tag: string
  title: string
  highlight: string
  subtitle: string
  gradient: string
  icon: React.ReactNode
}

const filterIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 4v3l5 5v7l2 1v-8l5-5V4" />
  </svg>
)
const brakeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.5" />
    <path strokeLinecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
  </svg>
)
const oilIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3s6 6.5 6 11a6 6 0 11-12 0c0-4.5 6-11 6-11z" />
  </svg>
)
const beltIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <circle cx="8" cy="12" r="4" />
    <circle cx="17" cy="12" r="2.5" />
    <path strokeLinecap="round" d="M8 8h9M8 16h9" />
  </svg>
)

const SLIDES: Slide[] = [
  {
    tag: 'PROMOTION',
    title: 'Filtration',
    highlight: "Jusqu'à -40%",
    subtitle: "Filtrer, c'est prévenir. Entretenez l'avenir.",
    gradient: 'from-secondary-700 to-secondary-900',
    icon: filterIcon,
  },
  {
    tag: 'FREINAGE',
    title: 'Plaquettes & disques',
    highlight: "Jusqu'à -35%",
    subtitle: 'La sécurité avant tout, au meilleur prix.',
    gradient: 'from-gray-800 to-gray-900',
    icon: brakeIcon,
  },
  {
    tag: 'ENTRETIEN',
    title: 'Huile & vidange',
    highlight: "Jusqu'à -30%",
    subtitle: 'Un moteur bien huilé dure plus longtemps.',
    gradient: 'from-secondary-600 to-secondary-800',
    icon: oilIcon,
  },
  {
    tag: 'DISTRIBUTION',
    title: 'Kits de distribution',
    highlight: "Jusqu'à -25%",
    subtitle: 'Grandes marques, pièces d’origine garanties.',
    gradient: 'from-gray-900 to-secondary-900',
    icon: beltIcon,
  },
]

function PromoCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Auto-advance every 5s unless paused.
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [paused])

  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-0 rounded-3xl overflow-hidden shadow-xl">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.title}
          aria-hidden={i !== index}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Decorative oversized icon */}
          <div className="absolute -right-8 -bottom-8 w-64 h-64 text-white/10">
            {slide.icon}
          </div>

          <div className="relative h-full flex flex-col justify-center p-8 sm:p-10">
            <span className="inline-block w-fit px-3 py-1 rounded-md bg-white/15 text-white text-xs font-bold tracking-widest mb-4">
              {slide.tag}
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight">
              {slide.title}
            </h3>
            <p className="mt-3 text-2xl sm:text-3xl font-display font-black text-white">
              {slide.highlight}
              <span className="align-super text-sm">*</span>
            </p>
            <p className="mt-3 text-white/85 text-sm sm:text-base max-w-sm">{slide.subtitle}</p>

            <button
              onClick={scrollToParts}
              className="mt-7 inline-flex w-fit items-center gap-2 px-6 py-3 rounded-xl bg-white text-secondary-700 font-bold shadow-lg hover:bg-gray-100 transition-colors"
            >
              J'en profite
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {/* Controls: pause/play + dots */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Reprendre le défilement' : 'Mettre en pause'}
          className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow"
        >
          {paused ? (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setIndex(i)}
              aria-label={`Aller à la promotion ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export function VehicleHero() {
  return (
    <section className="pt-28 pb-12 lg:pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 flex">
            <VehicleFinder />
          </div>
          <div className="lg:col-span-7 flex">
            <PromoCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}
