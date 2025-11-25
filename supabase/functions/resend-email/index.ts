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
  // Handle CORS preflight requests
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

    if (!to || !productLink || !productName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #c96442;">Sua compra foi confirmada!</h1>
        </div>
        
        <p>Olá, <strong>${buyerName}</strong>!</p>
        
        <p>Obrigado por adquirir <strong>${productName}</strong>.</p>
        
        <p>Seu pagamento de <strong>R$ ${purchaseAmount.toFixed(2)}</strong> foi processado com sucesso.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
          <p style="margin-bottom: 20px; font-size: 16px;">Seu produto digital já está disponível para download:</p>
          <a href="${productLink}" style="background-color: #c96442; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Baixar Meu Livro
          </a>
        </div>
        
        <p style="font-size: 14px;">Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:</p>
        <p style="font-size: 12px; color: #666; word-break: break-all;">
          <a href="${productLink}" style="color: #c96442;">${productLink}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        
        <p style="font-size: 12px; color: #888; text-align: center;">
          Livraria Digital - Todos os direitos reservados.<br>
          Este é um e-mail automático, por favor não responda.
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
