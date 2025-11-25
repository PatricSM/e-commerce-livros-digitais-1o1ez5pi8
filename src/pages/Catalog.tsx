import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X, Loader2 } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { useProductStore } from '@/stores/useProductStore'
import { Separator } from '@/components/ui/separator'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, fetchProducts, isLoading } = useProductStore()

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 200])
  const [sortOption, setSortOption] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Initialize from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategories([categoryParam])
    }
    const qParam = searchParams.get('q')
    if (qParam) {
      setSearchQuery(qParam)
    }
  }, [searchParams])

  // Derived Data
  const categories = Array.from(new Set(products.map((p) => p.category)))
  const maxPrice =
    products.length > 0 ? Math.max(...products.map((p) => p.price), 100) : 200

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(product.category)
        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1]
        const matchesSearch =
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.author.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesPrice && matchesSearch
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'title-asc':
            return a.title.localeCompare(b.title)
          case 'newest':
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
        }
      })
  }, [products, selectedCategories, priceRange, sortOption, searchQuery])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, maxPrice])
    setSearchQuery('')
    setSearchParams({})
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Categorias</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label
                htmlFor={`cat-${category}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-4">Preço</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, maxPrice]}
            value={priceRange}
            max={maxPrice}
            step={1}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Limpar Filtros
      </Button>
    </div>
  )

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-6">
          <div className="sticky top-24">
            <h2 className="text-lg font-bold mb-6">Filtros</h2>
            <FilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Catálogo ({filteredProducts.length})
            </h1>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden flex-1">
                    <Filter className="mr-2 h-4 w-4" /> Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais Recentes</SelectItem>
                  <SelectItem value="price-asc">
                    Preço: Menor para Maior
                  </SelectItem>
                  <SelectItem value="price-desc">
                    Preço: Maior para Menor
                  </SelectItem>
                  <SelectItem value="title-asc">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Bar (Local) */}
          <div className="mb-6">
            <div className="relative">
              <Input
                placeholder="Pesquisar no catálogo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                Nenhum livro encontrado com os filtros selecionados.
              </p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Limpar todos os filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
