import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const token = Deno.env.get('MP_ACCESS_TOKEN')
  if (!token) {
    return new Response(JSON.stringify({ error: 'MP_ACCESS_TOKEN ausente' }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
  const { plan, user, back_url } = await req.json()
  const body = {
    items: [
      {
        title: `Ana | ${plan?.name || 'Plano'}`,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: (plan?.price_cents || 0) / 100,
      },
    ],
    payer: { email: user?.email },
    back_urls: {
      success: back_url,
      failure: back_url,
      pending: back_url,
    },
    auto_return: 'approved',
    metadata: { user_id: user?.id, plan_id: plan?.id, tenant: 'ana' },
    notification_url: Deno.env.get('MP_WEBHOOK_URL'),
  }
  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
})
