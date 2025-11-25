import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface EmailPayload {
  to: string
  subject: string
  productName: string
  productLink: string
  buyerName: string
  purchaseAmount: number
}

export const onRequest = async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    const {
      to,
      subject,
      productName,
      productLink,
      buyerName,
      purchaseAmount,
    }: EmailPayload = await req.json()

    if (!to || !productLink) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Olá, ${buyerName}!</h1>
        <p>Obrigado por sua compra de <strong>${productName}</strong>.</p>
        <p>Seu pagamento de R$ ${purchaseAmount.toFixed(2)} foi confirmado.</p>
        <p>Você pode baixar seu produto digital clicando no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${productLink}" style="background-color: #c96442; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Baixar Agora
          </a>
        </div>
        <p>Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
        <p><a href="${productLink}">${productLink}</a></p>
        <hr />
        <p style="font-size: 12px; color: #666;">
          Este é um e-mail automático. Por favor, não responda.
        </p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Livraria Digital <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: htmlContent,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend API Error:', data)
      throw new Error(data.message || 'Failed to send email')
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in resend-email function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
