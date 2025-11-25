import { create } from 'zustand'
import { Product } from '@/types'
import { productService } from '@/services/products'
import { toast } from 'sonner'

interface ProductStore {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProduct: (id: string) => Product | undefined
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const products = await productService.getProducts()
      set({ products, isLoading: false })
    } catch (error: any) {
      console.error('Error fetching products:', error)
      set({ error: error.message, isLoading: false })
      toast.error('Erro ao carregar produtos')
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true, error: null })
    try {
      const newProduct = await productService.createProduct(product)
      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false,
      }))
    } catch (error: any) {
      console.error('Error adding product:', error)
      set({ error: error.message, isLoading: false })
      toast.error('Erro ao adicionar produto')
      throw error
    }
  },

  updateProduct: async (id, product) => {
    set({ isLoading: true, error: null })
    try {
      const updatedProduct = await productService.updateProduct(id, product)
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        isLoading: false,
      }))
    } catch (error: any) {
      console.error('Error updating product:', error)
      set({ error: error.message, isLoading: false })
      toast.error('Erro ao atualizar produto')
      throw error
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await productService.deleteProduct(id)
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }))
    } catch (error: any) {
      console.error('Error deleting product:', error)
      set({ error: error.message, isLoading: false })
      toast.error('Erro ao remover produto')
      throw error
    }
  },

  getProduct: (id) => get().products.find((p) => p.id === id),
}))
