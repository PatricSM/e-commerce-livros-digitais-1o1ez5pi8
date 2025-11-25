import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log('Hello from kiwify-webhook!')

export const onRequest = async (req: Request) => {
  // Handle CORS preflight requests if needed
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
    // Create a Supabase client with the SERVICE ROLE KEY to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const payload = await req.json()
    console.log('Received payload:', JSON.stringify(payload))

    // Extract fields
    const transactionId =
      payload.order_id || payload.transaction_id || payload.id
    const productId =
      payload.product_id || (payload.product && payload.product.id)
    const productName =
      payload.product_name || (payload.product && payload.product.name)

    // Amount handling
    let amount = payload.amount
    if (payload.commissions && payload.commissions.charge_amount) {
      amount = payload.commissions.charge_amount
    }

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
    const status = (payload.status || payload.order_status || '').toLowerCase()
    const paymentMethod = payload.payment_method || payload.payment_type

    if (!transactionId) {
      return new Response(JSON.stringify({ error: 'Missing transaction ID' }), {
        status: 400,
      })
    }

    // 1. Upsert sale into database
    // We removed ignoreDuplicates: true to allow status updates (e.g. pending -> paid)
    const { error: upsertError } = await supabaseClient
      .from('kiwify_sales')
      .upsert(
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
        },
      )

    if (upsertError) {
      console.error('Database error:', upsertError)
      return new Response(JSON.stringify({ error: upsertError.message }), {
        status: 500,
      })
    }

    // 2. Check if we should send email
    if (status === 'paid' || status === 'approved') {
      // Check if email was already sent
      const { data: saleData, error: saleError } = await supabaseClient
        .from('kiwify_sales')
        .select('email_sent_at')
        .eq('kiwify_transaction_id', transactionId)
        .single()

      if (saleError) {
        console.error('Error fetching sale:', saleError)
      } else if (saleData && !saleData.email_sent_at) {
        // Email not sent yet, proceed to find product file

        // Try to find product by matching Kiwify Product ID in the checkout link
        // This assumes the user put the Kiwify checkout link in the product definition
        const { data: productData, error: productError } = await supabaseClient
          .from('products')
          .select('title, file_url')
          .ilike('kiwify_checkout_link', `%${productId}%`)
          .maybeSingle()

        if (productError) {
          console.error('Error fetching product:', productError)
        } else if (productData && productData.file_url) {
          // 3. Send Email via resend-email function
          const { error: functionError } =
            await supabaseClient.functions.invoke('resend-email', {
              body: {
                to: buyerEmail,
                subject: `Seu ebook "${productData.title}" chegou!`,
                productName: productData.title,
                productLink: productData.file_url,
                buyerName: buyerName,
                purchaseAmount: finalAmount,
              },
            })

          if (functionError) {
            console.error('Error invoking resend-email:', functionError)
          } else {
            // 4. Update email_sent_at
            await supabaseClient
              .from('kiwify_sales')
              .update({ email_sent_at: new Date().toISOString() })
              .eq('kiwify_transaction_id', transactionId)

            console.log(
              `Email sent successfully for transaction ${transactionId}`,
            )
          }
        } else {
          console.warn(
            `Product file not found for Kiwify Product ID: ${productId}. Make sure the product exists and has a matching checkout link.`,
          )
        }
      } else {
        console.log(
          `Email already sent for transaction ${transactionId}, skipping.`,
        )
      }
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
