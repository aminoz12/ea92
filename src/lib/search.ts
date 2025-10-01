import Fuse from 'fuse.js'
import type { FuseResult } from 'fuse.js'

export interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  image?: string
  image1?: string
  image2?: string
  image3?: string
  inStock: boolean
  brand?: string
  partNumber?: string
}

// Sample product data - in a real app, this would come from an API
export const products: Product[] = [
  {
    id: '1',
    name: 'Filtre à air moteur',
    category: 'Filtres',
    description: 'Filtre à air haute performance pour moteurs essence et diesel',
    price: 25.99,
    image1: '/images/products/filtre1.png',
    image2: '/images/products/filtre2.png',
    inStock: true,
    brand: 'MANN-FILTER',
    partNumber: 'C 30 011'
  },
  {
    id: '2',
    name: 'Plaquettes de frein avant',
    category: 'Freinage',
    description: 'Plaquettes de frein céramique pour freinage optimal',
    price: 89.50,
    image1: '/images/products/freinage1.png',
    image2: '/images/products/freinage2.png',
    inStock: true,
    brand: 'BREMBO',
    partNumber: 'P 85 001'
  },
  {
    id: '3',
    name: 'Huile moteur 5W-30',
    category: 'Lubrifiants',
    description: 'Huile moteur synthétique 5W-30 pour tous types de moteurs',
    price: 45.00,
    image1: '/images/products/huile1.png',
    image2: '/images/products/huile2.png',
    inStock: true,
    brand: 'TOTAL',
    partNumber: 'H 5W30'
  },
  {
    id: '4',
    name: 'Bougie d\'allumage',
    category: 'Allumage',
    description: 'Bougie d\'allumage iridium pour moteurs essence',
    price: 12.99,
    inStock: false,
    brand: 'NGK',
    partNumber: 'B 1234'
  },
  {
    id: '5',
    name: 'Courroie de distribution',
    category: 'Distribution',
    description: 'Courroie de distribution renforcée pour moteurs diesel',
    price: 125.00,
    image1: '/images/products/cour1.png',
    image2: '/images/products/cour2.png',
    image3: '/images/products/cour3.png',
    inStock: true,
    brand: 'GATES',
    partNumber: 'C 5678'
  }
]

const fuse = new Fuse(products, {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'category', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'brand', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
})

export function searchProducts(query: string): FuseResult<Product>[] {
  if (!query.trim()) {
    return []
  }
  
  return fuse.search(query)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  )
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.inStock).slice(0, 4)
}

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}





