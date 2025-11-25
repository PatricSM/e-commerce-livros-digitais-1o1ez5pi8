import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, Check, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProductCard } from '@/components/ProductCard'
import { useProductStore } from '@/stores/useProductStore'
import { useCartStore } from '@/stores/useCartStore'
import { toast } from 'sonner'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const { getProduct, products, fetchProducts, isLoading } = useProductStore()
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  }, [fetchProducts, products.length])

  const product = getProduct(id || '')

  if (isLoading && !product) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
      </div>
    )
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.title} adicionado ao carrinho!`)
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Product Image */}
        <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[3/4] max-h-[600px] mx-auto w-full max-w-md overflow-hidden rounded-xl shadow-xl bg-muted">
          <img
            src={product.coverUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {product.title}
            </h1>
            <p className="text-xl text-muted-foreground">{product.author}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              R$ {product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao Carrinho
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              Comprar Agora
            </Button>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Entrega imediata via download</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Formatos PDF e EPUB inclusos</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Descrição</h3>
            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold block">Editora</span>
              <span className="text-muted-foreground">
                {product.publisher || 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-semibold block">Idioma</span>
              <span className="text-muted-foreground">
                {product.language || 'Português'}
              </span>
            </div>
            <div>
              <span className="font-semibold block">Páginas</span>
              <span className="text-muted-foreground">
                {product.pages || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section (Mock) */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Avaliações</h2>
        <div className="bg-muted/30 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-yellow-500">
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
            </div>
            <span className="font-medium">Excelente leitura!</span>
          </div>
          <p className="text-muted-foreground">
            "Um livro incrível, não consegui parar de ler. Recomendo a todos que
            gostam do gênero." - Maria Silva
          </p>
          <Separator />
          <div className="flex items-center gap-4">
            <div className="flex items-center text-yellow-500">
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="h-5 w-5" />
            </div>
            <span className="font-medium">Muito bom</span>
          </div>
          <p className="text-muted-foreground">
            "História envolvente e personagens bem construídos." - João Santos
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Você também pode gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
