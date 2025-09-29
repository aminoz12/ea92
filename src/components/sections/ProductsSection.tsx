import { useState } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
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
    <section id="products" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('products.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {t('products.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <Input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Products Grid */}
        {isSearching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <Card key={product.id} hover className="group">
                <CardHeader className="p-4">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-4xl">🔧</div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                    {product.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(product.price)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {product.inStock ? t('products.inStock') : t('products.outOfStock')}
                      </span>
                    </div>
                    
                    {product.brand && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{t('products.brand')}:</span> {product.brand}
                      </p>
                    )}
                    
                    {product.partNumber && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{t('products.partNumber')}:</span> {product.partNumber}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={!product.inStock}
                      >
                        {t('products.addToCart')}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        {t('products.viewDetails')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('search.noResults')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Essayez avec d'autres mots-clés
            </p>
          </div>
        )}

        {/* View All Products Button */}
        {!searchQuery && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Voir tous les produits
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}





