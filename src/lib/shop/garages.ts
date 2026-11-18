// DEMO partner garages — replace with the real partner network (name,
// address, opening slots). Each garage commits to the fixed prices in
// FITTING_JOBS (lib/shop/config.ts).
export interface PartnerGarage {
  id: string
  name: string
  city: string
  distanceKm: number
  nextSlot: string
  rating: number
}

export const DEMO_GARAGES: PartnerGarage[] = [
  { id: 'nanterre-centre', name: 'Garage partenaire Nanterre Centre', city: 'Nanterre', distanceKm: 1.2, nextSlot: 'Demain, 9 h', rating: 4.8 },
  { id: 'rueil', name: 'Garage partenaire Rueil-Malmaison', city: 'Rueil-Malmaison', distanceKm: 3.8, nextSlot: 'Jeudi, 14 h', rating: 4.7 },
  { id: 'colombes', name: 'Garage partenaire Colombes', city: 'Colombes', distanceKm: 4.5, nextSlot: 'Vendredi, 10 h', rating: 4.6 },
]
