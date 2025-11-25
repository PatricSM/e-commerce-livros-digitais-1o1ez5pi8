import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { Product } from '@/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/produto/${product.id}`} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-border/50">
        <div className="aspect-[2/3] w-full overflow-hidden bg-muted relative">
          <img
            src={product.coverUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="pointer-events-none"
            >
              <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
            </Button>
          </div>
        </div>
        <CardContent className="flex-1 p-4">
          <div className="text-xs text-muted-foreground mb-1">
            {product.category}
          </div>
          <h3 className="font-semibold leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.author}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
          <span className="font-bold text-lg">
            R$ {product.price.toFixed(2)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
