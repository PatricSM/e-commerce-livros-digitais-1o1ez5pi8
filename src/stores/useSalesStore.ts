import { create } from 'zustand'
import { Sale } from '@/types'
import { salesService } from '@/services/sales'
import { toast } from 'sonner'

interface SalesStore {
  sales: Sale[]
  isLoading: boolean
  error: string | null
  fetchSales: () => Promise<void>
}

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],
  isLoading: false,
  error: null,
  fetchSales: async () => {
    set({ isLoading: true, error: null })
    try {
      const sales = await salesService.getSales()
      set({ sales, isLoading: false })
    } catch (error: any) {
      console.error('Error fetching sales:', error)
      set({ error: error.message, isLoading: false })
      toast.error('Erro ao carregar vendas')
    }
  },
}))
