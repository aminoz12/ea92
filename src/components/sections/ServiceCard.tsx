import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

interface ServiceCardProps {
  service: {
    id: string
    name: string
    image: string
    color: string
    description: string
  }
  className?: string
}

export function ServiceCard({ service, className = '' }: ServiceCardProps) {
  return (
    <Card className={`group relative overflow-hidden card-modern shadow-red hover:shadow-red-lg ${className}`}>
      
      {/* Content */}
      <CardHeader className="relative z-10 text-center pb-4 pt-4">
        {/* Image - No frame, no shadow, bigger size */}
        <div className="relative mx-auto -mb-4">
          <img
            src={service.image}
            alt={service.name}
            className="w-[238px] h-[238px] mx-auto object-cover group-hover:scale-110 transition-all duration-500"
            loading="lazy"
          />
        </div>
        
        <CardTitle className="text-3xl font-display font-bold text-gray-900 dark:text-white group-hover:text-secondary-600 transition-colors duration-300">
          {service.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
          {service.description}
        </p>
        
        {/* Hover effect line */}
        <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-secondary-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
      </CardContent>
      
    </Card>
  )
}
