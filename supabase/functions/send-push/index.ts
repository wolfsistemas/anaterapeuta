import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { title, body, user_id } = await req.json()
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  let query = sb.from('push_subscriptions').select('*')
  if (user_id) query = query.eq('user_id', user_id)
  const { data } = await query
  return new Response(
    JSON.stringify({
      ok: true,
      queued: data?.length || 0,
      note: 'Use web-push com VAPID_PRIVATE_KEY para disparar de fato.',
      sample: { title, body },
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
