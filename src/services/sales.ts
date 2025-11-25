import { supabase } from '@/lib/supabase/client'
import { Sale } from '@/types'

export const salesService = {
  async getSales() {
    const { data, error } = await supabase
      .from('kiwify_sales')
      .select('*')
      .order('purchase_date', { ascending: false })

    if (error) throw error

    return data.map(mapToSale)
  },
}

function mapToSale(row: any): Sale {
  return {
    id: row.id,
    kiwifyTransactionId: row.kiwify_transaction_id,
    productId: row.product_id,
    productName: row.product_name,
    amount: Number(row.amount),
    currency: row.currency,
    buyerEmail: row.buyer_email,
    buyerName: row.buyer_name,
    purchaseDate: row.purchase_date,
    status: row.status,
    paymentMethod: row.payment_method,
    rawPayload: row.raw_payload,
    createdAt: row.created_at,
  }
}
