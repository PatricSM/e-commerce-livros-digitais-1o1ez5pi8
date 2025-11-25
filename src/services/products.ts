import { supabase } from '@/lib/supabase/client'
import { Product } from '@/types'

export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(mapToProduct)
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return mapToProduct(data)
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>) {
    const dbProduct = mapToDbProduct(product)
    const { data, error } = await supabase
      .from('products')
      .insert(dbProduct)
      .select()
      .single()

    if (error) throw error

    return mapToProduct(data)
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const dbProduct = mapToDbProductPartial(product)
    const { data, error } = await supabase
      .from('products')
      .update({ ...dbProduct, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return mapToProduct(data)
  },

  async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) throw error
  },
}

function mapToProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    price: Number(row.price),
    description: row.description,
    category: row.category,
    coverUrl: row.cover_url,
    fileUrl: row.file_url,
    pages: row.pages,
    language: row.language,
    publisher: row.publisher,
    kiwifyCheckoutLink: row.kiwify_checkout_link,
    createdAt: row.created_at,
  }
}

function mapToDbProduct(product: Omit<Product, 'id' | 'createdAt'>) {
  return {
    title: product.title,
    author: product.author,
    price: product.price,
    description: product.description,
    category: product.category,
    cover_url: product.coverUrl,
    file_url: product.fileUrl,
    pages: product.pages,
    language: product.language,
    publisher: product.publisher,
    kiwify_checkout_link: product.kiwifyCheckoutLink,
  }
}

function mapToDbProductPartial(product: Partial<Product>) {
  const dbProduct: any = {}
  if (product.title !== undefined) dbProduct.title = product.title
  if (product.author !== undefined) dbProduct.author = product.author
  if (product.price !== undefined) dbProduct.price = product.price
  if (product.description !== undefined)
    dbProduct.description = product.description
  if (product.category !== undefined) dbProduct.category = product.category
  if (product.coverUrl !== undefined) dbProduct.cover_url = product.coverUrl
  if (product.fileUrl !== undefined) dbProduct.file_url = product.fileUrl
  if (product.pages !== undefined) dbProduct.pages = product.pages
  if (product.language !== undefined) dbProduct.language = product.language
  if (product.publisher !== undefined) dbProduct.publisher = product.publisher
  if (product.kiwifyCheckoutLink !== undefined)
    dbProduct.kiwify_checkout_link = product.kiwifyCheckoutLink
  return dbProduct
}
