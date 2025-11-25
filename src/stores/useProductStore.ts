import { create } from 'zustand'
import { Product } from '@/types'

interface ProductStore {
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'O Guia do Mochileiro das Galáxias',
    author: 'Douglas Adams',
    price: 29.9,
    description:
      'Uma aventura espacial hilária que segue Arthur Dent, um terráqueo comum, enquanto ele viaja pelo universo após a destruição da Terra.',
    category: 'Ficção Científica',
    coverUrl: 'https://img.usecurling.com/p/300/450?q=galaxy%20book%20cover',
    pages: 208,
    language: 'Português',
    publisher: 'Arqueiro',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    price: 15.5,
    description:
      'Um clássico da literatura brasileira que explora o ciúme e a dúvida de Bentinho em relação à fidelidade de Capitu.',
    category: 'Romance',
    coverUrl: 'https://img.usecurling.com/p/300/450?q=vintage%20book%20cover',
    pages: 256,
    language: 'Português',
    publisher: 'Penguin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: 89.9,
    description:
      'Um manual de agilidade de software. Aprenda a escrever código limpo e a refatorar código legado.',
    category: 'Tecnologia',
    coverUrl: 'https://img.usecurling.com/p/300/450?q=code%20book',
    pages: 464,
    language: 'Inglês',
    publisher: 'Alta Books',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'O Senhor dos Anéis: A Sociedade do Anel',
    author: 'J.R.R. Tolkien',
    price: 59.9,
    description:
      'O início da jornada épica de Frodo Baggins para destruir o Um Anel e salvar a Terra-média.',
    category: 'Fantasia',
    coverUrl: 'https://img.usecurling.com/p/300/450?q=fantasy%20ring%20book',
    pages: 576,
    language: 'Português',
    publisher: 'HarperCollins',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Pai Rico, Pai Pobre',
    author: 'Robert Kiyosaki',
    price: 45.0,
    description:
      'O que os ricos ensinam a seus filhos sobre dinheiro que os pobres e a classe média não ensinam.',
    category: 'Negócios',
    coverUrl: 'https://img.usecurling.com/p/300/450?q=money%20book',
    pages: 336,
    language: 'Português',
    publisher: 'Alta Books',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: '1984',
    author: 'George Orwell',
    price: 22.9,
    description:
      'Uma distopia assustadora sobre um regime totalitário que vigia cada movimento de seus cidadãos.',
    category: 'Ficção',
    coverUrl: 'https://img.usecurling.com/p/300/450?q=eye%20book%20cover',
    pages: 416,
    language: 'Português',
    publisher: 'Companhia das Letras',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Sapiens: Uma Breve História da Humanidade',
    author: 'Yuval Noah Harari',
    price: 54.9,
    description:
      'Uma exploração fascinante da história da nossa espécie, desde os primórdios até o presente.',
    category: 'História',
    coverUrl: 'https://img.usecurling.com/p/300/450?q=human%20history%20book',
    pages: 472,
    language: 'Português',
    publisher: 'L&PM',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Harry Potter e a Pedra Filosofal',
    author: 'J.K. Rowling',
    price: 39.9,
    description:
      'Harry Potter descobre que é um bruxo e começa sua educação mágica em Hogwarts.',
    category: 'Fantasia',
    coverUrl: 'https://img.usecurling.com/p/300/450?q=magic%20wizard%20book',
    pages: 223,
    language: 'Português',
    publisher: 'Rocco',
    createdAt: new Date().toISOString(),
  },
]

export const useProductStore = create<ProductStore>((set, get) => ({
  products: MOCK_PRODUCTS,
  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        {
          ...product,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updatedProduct } : p,
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  getProduct: (id) => get().products.find((p) => p.id === id),
}))
