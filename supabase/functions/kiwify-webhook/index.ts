import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log('Hello from kiwify-webhook!')

export const onRequest = async (req: Request) => {
  // Handle CORS preflight requests if needed, though webhooks usually just POST
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // Create a Supabase client with the SERVICE ROLE KEY to bypass RLS for inserts
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const payload = await req.json()
    console.log('Received payload:', JSON.stringify(payload))

    // Extract fields - adapting to potential Kiwify payload structure
    const transactionId =
      payload.order_id || payload.transaction_id || payload.id
    const productId =
      payload.product_id || (payload.product && payload.product.id)
    const productName =
      payload.product_name || (payload.product && payload.product.name)

    // Amount handling - assuming cents if integer
    let amount = payload.amount
    if (payload.commissions && payload.commissions.charge_amount) {
      amount = payload.commissions.charge_amount
    }

    // If amount is an integer, assume cents and divide by 100.
    // If it's a float (has decimal), assume it's already formatted.
    // This is a heuristic.
    let finalAmount = 0
    if (amount) {
      const numAmount = Number(amount)
      if (Number.isInteger(numAmount)) {
        finalAmount = numAmount / 100
      } else {
        finalAmount = numAmount
      }
    }

    const currency =
      payload.currency ||
      (payload.commissions && payload.commissions.currency) ||
      'BRL'

    const buyerEmail = payload.customer?.email || payload.email
    const buyerName =
      payload.customer?.full_name || payload.name || payload.customer?.name

    const purchaseDate =
      payload.created_at || payload.approved_date || new Date().toISOString()
    const status = payload.status || payload.order_status
    const paymentMethod = payload.payment_method || payload.payment_type

    if (!transactionId) {
      return new Response(JSON.stringify({ error: 'Missing transaction ID' }), {
        status: 400,
      })
    }

    // Insert into database
    const { error } = await supabaseClient.from('kiwify_sales').upsert(
      {
        kiwify_transaction_id: transactionId,
        product_id: productId || 'unknown',
        product_name: productName || 'Produto Desconhecido',
        amount: finalAmount,
        currency: currency,
        buyer_email: buyerEmail || 'unknown@email.com',
        buyer_name: buyerName || 'Cliente Desconhecido',
        purchase_date: purchaseDate,
        status: status || 'unknown',
        payment_method: paymentMethod || 'unknown',
        raw_payload: payload,
      },
      {
        onConflict: 'kiwify_transaction_id',
        ignoreDuplicates: true,
      },
    )

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }

    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      { status: 200 },
    )
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
