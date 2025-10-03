import { useState } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { getFeaturedProducts, searchProducts } from '../../lib/search'
import { formatPrice } from '../../lib/utils'

export function ProductsSection() {
  const { t } = useLocale()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const featuredProducts = getFeaturedProducts()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      const results = searchProducts(query)
      setSearchResults(results.map(result => result.item))
      setIsSearching(false)
    } else {
      setSearchResults([])
    }
  }

  const displayProducts = searchQuery ? searchResults : featuredProducts

  return (
    <section id="products" className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative">
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            {t('products.title')}
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
          </h2>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium mb-6">
            {t('products.subtitle')}
          </p>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            <Input
              type="text"
                placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-red-500 focus:ring-red-500/20 transition-all duration-300 shadow-lg hover:shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSearchResults([])
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isSearching ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Recherche en cours...</p>
            </div>
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-200/60 dark:border-gray-700/60 group-hover:border-red-200 dark:group-hover:border-red-500/30 group-hover:-translate-y-3 group-hover:shadow-red-500/20">
                  {/* Red Shadow Background */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/5 via-transparent to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Subtle Red Glow */}
                  <div className="absolute inset-0 rounded-3xl shadow-2xl shadow-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Product Image Container */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden m-3 rounded-xl">
                    {/* First Image - Default */}
                    <div className="absolute inset-0 transition-all duration-500 group-hover:opacity-0 group-hover:scale-95">
                      <img 
                        src={product.image1 || '/images/products/default-1.jpg'} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = '/images/products/placeholder-1.jpg'
                        }}
                      />
                    </div>
                    
                    {/* Second Image - Hover (Fast transition) */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 ${
                      product.name === 'Courroie de distribution' 
                        ? 'duration-200 delay-0' 
                        : 'duration-500'
                    }`}>
                      <img 
                        src={product.image2 || '/images/products/default-2.jpg'} 
                        alt={`${product.name} - Vue alternative`}
                        className={`w-full h-full object-cover transition-transform ${
                          product.name === 'Huile moteur 5W-30' 
                            ? 'duration-500 group-hover:scale-110' 
                            : product.name === 'Courroie de distribution'
                            ? 'duration-200 group-hover:scale-105'
                            : 'duration-500 group-hover:scale-105'
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = '/images/products/placeholder-2.jpg'
                        }}
                      />
                    </div>
                    
                    {/* Third Image - For Courroie only (Very fast transition) */}
                    {product.image3 && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-150 delay-100 transform translate-y-2 group-hover:translate-y-0">
                        <img 
                          src={product.image3} 
                          alt={`${product.name} - Vue détaillée`}
                          className="w-full h-full object-cover transition-transform duration-150 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = '/images/products/placeholder-2.jpg'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Stock Status Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                        product.inStock 
                          ? 'bg-green-500/90 text-white border border-green-400' 
                          : 'bg-red-500/90 text-white border border-red-400'
                      }`}>
                        {product.inStock ? t('products.inStock') : t('products.outOfStock')}
                      </span>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    
                    {/* Corner Accents */}
                    <div className="absolute top-1 left-1 w-2 h-2 bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div>
                    <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-red-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-400"></div>
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-red-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-500"></div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 pt-2">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {product.category}
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-150"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    
                    {/* Product Details */}
                    <div className="space-y-2 mb-4">
                      {product.brand && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium mr-2">{t('products.brand')}:</span>
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs font-semibold">{product.brand}</span>
                        </div>
                      )}
                      
                      {product.partNumber && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium mr-2">{t('products.partNumber')}:</span>
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">{product.partNumber}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs"
                        disabled={!product.inStock}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6.5M17 18a2 2 0 100 4 2 2 0 000-4zM7 18a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        {t('products.addToCart')}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {t('search.noResults')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Essayez avec d'autres mots-clés ou parcourez nos catégories
              </p>
              <Button 
                onClick={() => setSearchQuery('')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Voir tous les produits
              </Button>
            </div>
          </div>
        )}

        {/* View All Products Button */}
        {!searchQuery && displayProducts.length > 0 && (
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
              Voir tous les produits
            </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                Par catégorie
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}





