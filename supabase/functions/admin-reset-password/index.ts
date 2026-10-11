import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const auth = req.headers.get('Authorization') || ''
  const url = Deno.env.get('SUPABASE_URL')!
  const anon = Deno.env.get('SUPABASE_ANON_KEY')!
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } })
  const { data: authUser } = await userClient.auth.getUser()
  const { data: me } = await userClient
    .from('profiles')
    .select('role, email, tenant_id')
    .eq('id', authUser.user?.id)
    .single()

  if (me?.role !== 'superadmin') {
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: cors })
  }

  const body = await req.json()
  const admin = createClient(url, service)

  if (body.action === 'create') {
    const { data, error } = await admin.auth.admin.createUser({
      email: body.email,
      password: body.password || '142569',
      email_confirm: true,
      user_metadata: { name: body.name, role: 'client', plan_id: body.plan_id || '' },
    })
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }
    if (body.plan_id && data.user) {
      await admin.from('profiles').update({ plan_id: body.plan_id, name: body.name }).eq('id', data.user.id)
    }
    await admin.from('audit_logs').insert({
      tenant_id: me.tenant_id,
      actor: me.email,
      action: 'usuario.criado',
      detail: body.email,
    })
    return new Response(JSON.stringify({ ok: true, id: data.user?.id }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  const { user_id, new_password } = body
  const { error } = await admin.auth.admin.updateUserById(user_id, { password: new_password })
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
  await admin.from('audit_logs').insert({
    tenant_id: me.tenant_id,
    actor: me.email,
    action: 'senha.redefinida',
    detail: user_id,
  })
  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
})
