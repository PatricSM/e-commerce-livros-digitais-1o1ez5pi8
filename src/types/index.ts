export interface Product {
  id: string
  title: string
  author: string
  price: number
  description: string
  category: string
  coverUrl: string
  fileUrl?: string
  pages?: number
  language?: string
  publisher?: string
  kiwifyCheckoutLink?: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  role?: string
}

export interface Sale {
  id: string
  kiwifyTransactionId: string
  productId: string
  productName: string
  amount: number
  currency: string
  buyerEmail: string
  buyerName: string
  purchaseDate: string
  status: string
  paymentMethod: string
  rawPayload: any
  createdAt: string
}
