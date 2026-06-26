'use client'

import { useEffect, useRef, useState } from 'react'

// Smoothly scroll to the contact section (the hero's "search"/CTA target while
// the real vehicle lookup is not wired up yet).
function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

// Lower-case + strip accents so "etrier" matches "Étrier", "batt" matches
// "Batterie", etc.
const deburr = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

// Render a suggestion with the matched portion emphasised.
function highlightMatch(text: string, query: string) {
  const idx = deburr(text).indexOf(deburr(query))
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-secondary-700">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Left column — vehicle identification card                          */
/* ------------------------------------------------------------------ */

// Common car parts (French) offered as autocomplete hints in the
// "Pièce recherchée" field. The input stays free-text: a customer can pick a
// suggestion or type anything that is not in the list.
const PART_SUGGESTIONS = [
  // Freinage
  'Plaquettes de freins avant',
  'Plaquettes de freins arrière',
  'Disques de frein avant',
  'Disques de frein arrière',
  'Étrier de frein',
  'Mâchoires de frein',
  'Tambour de frein',
  'Liquide de frein',
  'Flexible de frein',
  'Câble de frein à main',
  'Maître-cylindre de frein',
  'Kit de freins',
  // Filtration
  'Filtre à huile',
  'Filtre à air',
  'Filtre à carburant',
  "Filtre d'habitacle (pollen)",
  // Distribution / moteur
  'Kit de distribution',
  'Courroie de distribution',
  "Courroie d'accessoire",
  'Galet tendeur',
  'Pompe à eau',
  'Joint de culasse',
  "Bougies d'allumage",
  'Bougies de préchauffage',
  "Bobine d'allumage",
  'Injecteur',
  'Vanne EGR',
  'Turbocompresseur',
  'Support moteur',
  // Embrayage
  "Kit d'embrayage",
  "Butée d'embrayage",
  'Volant moteur',
  // Suspension / direction
  'Amortisseur avant',
  'Amortisseur arrière',
  'Ressort de suspension',
  'Rotule de direction',
  'Rotule de suspension',
  'Biellette de barre stabilisatrice',
  'Triangle de suspension',
  'Silentbloc',
  'Roulement de roue',
  'Cardan de transmission',
  'Crémaillère de direction',
  // Refroidissement
  'Radiateur de refroidissement',
  'Thermostat',
  'Durite de radiateur',
  'Ventilateur de refroidissement',
  "Vase d'expansion",
  // Électricité / démarrage
  'Batterie',
  'Alternateur',
  'Démarreur',
  'Capteur ABS',
  'Sonde lambda',
  'Capteur de température',
  'Capteur de vilebrequin (PMH)',
  "Débitmètre d'air",
  // Échappement
  "Pot d'échappement",
  'Silencieux',
  'Catalyseur',
  'Filtre à particules (FAP)',
  "Collecteur d'échappement",
  // Éclairage / visibilité
  'Ampoule de phare',
  'Phare avant',
  'Feu arrière',
  'Clignotant',
  'Rétroviseur',
  "Balais d'essuie-glace",
  // Alimentation
  'Pompe à carburant',
  "Pompe à injection",
  'Bouchon de vidange',
  // Pneus / roues
  'Pneu',
  'Jante',
]

function VehicleFinder() {
  const [plate, setPlate] = useState('')
  const [part, setPart] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const partBoxRef = useRef<HTMLDivElement>(null)

  const query = part.trim()
  // Only start suggesting once at least 2 characters have been typed.
  const matches =
    query.length >= 2
      ? PART_SUGGESTIONS.filter((p) => deburr(p).includes(deburr(query)))
      : []
  const showList = open && matches.length > 0

  const selectPart = (value: string) => {
    setPart(value)
    setOpen(false)
    setActiveIndex(-1)
  }

  const handlePartKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % matches.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + matches.length) % matches.length)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectPart(matches[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Close the suggestion list when clicking outside the field.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (partBoxRef.current && !partBoxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Visual-only for now: send the user to the contact section.
    scrollToContact()
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

        {/* Part searched — free text with styled autocomplete (opens at 2+ chars) */}
        <div ref={partBoxRef} className="relative mt-4">
          {/* search icon */}
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={part}
            onChange={(e) => {
              setPart(e.target.value)
              setOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handlePartKeyDown}
            placeholder="Pièce recherchée"
            aria-label="Pièce recherchée"
            autoComplete="off"
            role="combobox"
            aria-expanded={showList}
            aria-controls="part-suggestions"
            className="w-full h-14 pl-12 pr-4 rounded-xl text-base text-gray-900 placeholder:text-gray-400 outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-secondary-500"
          />

          {showList && (
            <ul
              id="part-suggestions"
              role="listbox"
              className="absolute z-30 left-0 right-0 mt-2 max-h-64 overflow-auto rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-gray-200"
            >
              {matches.map((p, i) => (
                <li key={p} role="option" aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => selectPart(p)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      i === activeIndex
                        ? 'bg-secondary-50 text-secondary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        i === activeIndex ? 'bg-secondary-600' : 'bg-gray-300'
                      }`}
                    />
                    <span className="truncate">{highlightMatch(p, query)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

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
              onClick={scrollToContact}
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
    <section className="relative overflow-hidden pt-36 lg:pt-44 pb-12 lg:pb-16">
      {/* Blurred photo background — keeps the finder card and carousel legible */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/hero.png"
          alt=""
          className="h-full w-full object-cover object-center scale-105 blur-[3px]"
        />
        {/* Lighter overlay so the photo shows through while keeping the white
            card and the promo carousel readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/55 via-gray-900/35 to-secondary-900/45" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 flex">
            <VehicleFinder />
          </div>
          <div className="lg:col-span-7 flex">
            <PromoCarousel />
          </div>
        </div>

        {/* Tagline below both columns */}
        <h1 className="anton-regular uppercase text-center leading-tight tracking-wide mt-10 lg:mt-14 text-2xl sm:text-3xl lg:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Ici trouvez l'excellence
          </span>
          <span className="block text-white">
            Là où les prix font la différence
          </span>
        </h1>
      </div>
    </section>
  )
}
