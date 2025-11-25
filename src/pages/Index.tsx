import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, TrendingUp, Book, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { useProductStore } from '@/stores/useProductStore'

const Index = () => {
  const { products, fetchProducts, isLoading } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Get latest 4 products
  const featuredProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4)

  const categories = [
    { name: 'Ficção', icon: Book },
    { name: 'Negócios', icon: TrendingUp },
    { name: 'Fantasia', icon: Star },
    { name: 'Tecnologia', icon: Book },
  ]

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-muted py-20 md:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 animate-fade-in-up">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium w-fit">
                Novas Leituras Disponíveis
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Descubra sua Próxima Leitura Favorita
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Explore nossa vasta coleção de livros digitais. De clássicos
                atemporais aos lançamentos mais quentes, temos algo para cada
                leitor.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild className="gap-2">
                  <Link to="/catalogo">
                    Explorar Catálogo <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/catalogo?sort=popular">Mais Vendidos</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto animate-fade-in duration-1000">
              <img
                src="https://img.usecurling.com/p/600/400?q=reading%20ebook%20tablet"
                alt="Lendo ebook"
                className="rounded-xl shadow-2xl object-cover aspect-video"
              />
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      </section>

      {/* Featured Section */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Lançamentos em Destaque
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            Confira as últimas adições à nossa biblioteca digital.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link to="/catalogo">Ver Todos os Livros</Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/30 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Categorias Populares
            </h2>
            <p className="max-w-[700px] text-muted-foreground">
              Navegue pelos gêneros mais amados pelos nossos leitores.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/catalogo?category=${category.name}`}
                className="group relative overflow-hidden rounded-lg bg-background border p-6 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3 text-center h-40"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <category.icon className="h-6 w-6" />
                </div>
                <span className="font-semibold text-lg">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="container px-4 md:px-6 mb-12">
        <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Fique por dentro das novidades
            </h2>
            <p className="text-primary-foreground/80 md:text-lg">
              Inscreva-se na nossa newsletter para receber ofertas exclusivas e
              recomendações personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              />
              <Button variant="secondary" className="font-semibold">
                Inscrever-se
              </Button>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 -mt-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>
      </section>
    </div>
  )
}

export default Index
