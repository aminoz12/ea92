'use client'

import { useEffect, useRef, useState } from 'react'
import { SITE } from '@/lib/site'

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
  const [status, setStatus] = useState<'idle' | 'searching' | 'available'>('idle')
  const partBoxRef = useRef<HTMLDivElement>(null)

  // Pre-filled WhatsApp message with the customer's plate / part.
  const waMessage =
    "Bonjour, je souhaite vérifier la disponibilité d'une pièce" +
    (part ? ` : ${part}` : '') +
    (plate ? ` (véhicule ${plate})` : '') +
    '.'
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waMessage)}`

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
    setOpen(false)
    // Visual-only: simulate an availability lookup, then show the result.
    setStatus('searching')
    setTimeout(() => setStatus('available'), 1500)
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
            onChange={(e) => {
              setPlate(e.target.value.toUpperCase())
              setStatus('idle')
            }}
            placeholder="AA-456-BB"
            aria-label="Plaque d'immatriculation"
            required
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
              setStatus('idle')
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handlePartKeyDown}
            placeholder="Pièce recherchée"
            aria-label="Pièce recherchée"
            required
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

        {status === 'available' ? (
          <div className="mt-4">
            {/* Availability result */}
            <div className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 ring-1 ring-green-200">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div className="leading-tight">
                <p className="font-display font-bold text-green-800">Pièce disponible !</p>
                <p className="text-xs text-green-700/80">Commandez-la dès maintenant.</p>
              </div>
            </div>

            <div className="mt-3 space-y-2.5">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-green-600 hover:bg-green-700 text-white font-display font-bold text-sm shadow-md transition-colors"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.739-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Commander par WhatsApp
              </a>
              <a
                href={`tel:${SITE.phone}`}
                className="flex w-full h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-secondary-600 hover:bg-secondary-700 text-white font-display font-bold text-sm shadow-md transition-colors"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Appeler
              </a>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            disabled={status === 'searching'}
            className="mt-4 flex w-full h-14 items-center justify-center gap-2 rounded-xl bg-secondary-600 hover:bg-secondary-700 disabled:opacity-80 disabled:cursor-wait text-white font-display font-bold text-base shadow-lg hover:shadow-xl transition-all"
          >
            {status === 'searching' ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Recherche en cours…
              </>
            ) : (
              'Vérifier la disponibilité'
            )}
          </button>
        )}
      </form>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Right column — promo carousel                                      */
/* ------------------------------------------------------------------ */

interface Slide {
  image: string
  alt: string
  cta: string
}

// Promo banners — add more as images arrive, each with its own CTA label.
const SLIDES: Slide[] = [
  { image: '/promo1.jpeg', alt: 'Promotion Espace Auto 92', cta: 'JE PROFITE' },
  { image: '/promo2.jpeg', alt: 'Promotion Espace Auto 92', cta: "JE PRENDS L'OFFRE" },
  { image: '/promo3.jpeg', alt: 'Promotion Espace Auto 92', cta: 'PROFITEZ MAINTENANT' },
]

function PromoCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const multiple = SLIDES.length > 1

  // Auto-advance every 5s unless paused (only with several slides).
  useEffect(() => {
    if (paused || !multiple) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [paused, multiple])

  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-0 rounded-3xl overflow-hidden shadow-xl">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.image}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover"
          />

          {/* CTA overlaid on the banner — calls the shop */}
          <a
            href={`tel:${SITE.phone}`}
            aria-label={`${slide.cta} — appeler le ${SITE.phoneDisplay}`}
            className={`absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-xl bg-secondary-600 hover:bg-secondary-700 px-7 py-3 text-white font-display font-extrabold tracking-wide text-sm sm:text-base shadow-xl transition-colors ${
              multiple ? 'bottom-14' : 'bottom-6'
            }`}
          >
            {slide.cta}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      ))}

      {/* Controls: pause/play + dots (only with several slides) */}
      {multiple && (
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
                key={s.image}
                onClick={() => setIndex(i)}
                aria-label={`Aller à la promotion ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      )}
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
