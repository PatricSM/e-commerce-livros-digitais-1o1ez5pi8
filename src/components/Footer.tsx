import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight">
                Livraria Digital
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Sua fonte confiável para os melhores livros digitais. Leia em
              qualquer lugar, a qualquer hora.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  className="hover:text-primary transition-colors"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="hover:text-primary transition-colors"
                >
                  Área Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Livraria Digital. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
