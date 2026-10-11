import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const sb = createClient(url, key)
  const payload = await req.json().catch(() => ({}))
  const mpId = payload?.data?.id || payload?.id
  await sb.from('audit_logs').insert({
    tenant_id: (await sb.from('tenants').select('id').eq('slug', 'ana').single()).data?.id,
    actor: 'mercadopago',
    action: 'webhook',
    detail: JSON.stringify(payload).slice(0, 500),
  })
  if (mpId) {
    await sb.from('payments').update({ status: 'approved', mp_id: String(mpId) }).eq('mp_id', String(mpId))
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
})
