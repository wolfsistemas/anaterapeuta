import { supabase } from './supabase'
import { HAS_SUPABASE } from './config'
import { seed } from './seed'
import * as local from './store'
import { writeLog as writeLocalLog, readLogs, clearLogs } from './logs'

export function aliasEmail(input) {
  const v = (input || '').trim().toLowerCase()
  if (!v) return v
  if (v === 'superadmin') return 'superadmin@ana.local'
  if (v === 'terapeuta') return 'terapeuta@ana.local'
  if (!v.includes('@')) return `${v}@ana.local`
  return v
}

function emptyDb() {
  return {
    tenant: { id: '', slug: 'ana', name: 'Ana | Terapia e Mentoria', meet_url: '' },
    plans: [],
    users: [],
    freeContent: [],
    courses: [],
    lessons: [],
    notices: [],
    messages: [],
    sessions: [],
    payments: [],
    logs: [],
  }
}

function mapDb({ tenant, plans, users, freeContent, courses, lessons, notices, messages, sessions, payments, logs }) {
  return {
    tenant: tenant || emptyDb().tenant,
    plans: plans || [],
    users: users || [],
    freeContent: freeContent || [],
    courses: courses || [],
    lessons: lessons || [],
    notices: notices || [],
    messages: messages || [],
    sessions: sessions || [],
    payments: payments || [],
    logs: logs || [],
  }
}

async function logRemote(action, detail, actor) {
  if (!supabase) return
  try {
    await supabase.rpc('write_log', { p_action: action, p_detail: `${actor || ''} ${detail || ''}`.trim() })
  } catch {
    /* ignore */
  }
}

export async function fetchDb(user) {
  if (!HAS_SUPABASE || !supabase) {
    const db = local.loadDb()
    db.logs = readLogs()
    return db
  }

  const db = emptyDb()
  const [tenantRes, plansRes, freeRes, coursesRes, lessonsRes] = await Promise.all([
    supabase.from('tenants').select('*').eq('slug', 'ana').maybeSingle(),
    supabase.from('plans').select('*').order('sort'),
    supabase.from('free_content').select('*'),
    supabase.from('courses').select('*'),
    supabase.from('lessons').select('*').order('sort'),
  ])

  db.tenant = tenantRes.data || db.tenant
  db.plans = plansRes.data || []
  db.freeContent = freeRes.data || []
  db.courses = coursesRes.data || []
  db.lessons = lessonsRes.data || []

  if (user) {
    const [noticesRes, messagesRes, sessionsRes, paymentsRes] = await Promise.all([
      supabase.from('notices').select('*').order('created_at', { ascending: false }),
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      supabase.from('session_balances').select('*'),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
    ])
    db.notices = noticesRes.data || []
    db.messages = messagesRes.data || []
    db.sessions = sessionsRes.data || []
    db.payments = paymentsRes.data || []

    if (user.role === 'superadmin') {
      const [{ data: users }, { data: logs }] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(400),
      ])
      db.users = users || []
      db.logs = (logs || []).map((l) => ({
        id: l.id,
        at: l.created_at,
        actor: l.actor,
        action: l.action,
        detail: l.detail,
      }))
    } else {
      const { data: adminId } = await supabase.rpc('admin_profile_id')
      db.users = [user]
      if (adminId) db.users.push({ id: adminId, role: 'superadmin', name: 'Ana', email: 'superadmin' })
      db.logs = []
    }
  }

  return mapDb(db)
}

export async function loginRemote(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: aliasEmail(email),
    password,
  })
  if (error) return { ok: false, error: error.message }
  const profile = await loadProfile(data.user.id)
  if (!profile) return { ok: false, error: 'Perfil nao encontrado.' }
  if (profile.status === 'blocked') {
    await supabase.auth.signOut()
    return { ok: false, error: 'Esta conta esta bloqueada.' }
  }
  await logRemote('login', profile.email, profile.email)
  return { ok: true, user: profile }
}

export async function registerRemote({ name, email, password, plan_id }) {
  const resolved = aliasEmail(email)
  const { data, error } = await supabase.auth.signUp({
    email: resolved,
    password,
    options: { data: { name, plan_id: plan_id || '' } },
  })
  if (error) return { ok: false, error: error.message }
  if (!data.user) return { ok: false, error: 'Nao foi possivel criar a conta.' }
  if (data.session) {
    const profile = await loadProfile(data.user.id)
    await logRemote('cadastro', resolved, resolved)
    return { ok: true, user: profile }
  }
  return { ok: true, user: null, confirm: true }
}

export async function logoutRemote() {
  await supabase.auth.signOut()
}

export async function loadProfile(id) {
  const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
  return data
}

export async function requestResetRemote(email) {
  const resolved = aliasEmail(email)
  const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}/redefinir-senha`
  const { error } = await supabase.auth.resetPasswordForEmail(resolved, { redirectTo })
  if (error) return { ok: false, error: error.message }
  await logRemote('senha.pedido', resolved, resolved)
  return { ok: true }
}

export async function confirmResetRemote(password) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { ok: false, error: error.message }
  await logRemote('senha.redefinida', 'self', 'self')
  return { ok: true }
}

export async function changePlanRemote(userId, planId, actor) {
  if (!HAS_SUPABASE) return local.changePlan(local.loadDb(), userId, planId, actor)
  const { error } = await supabase.from('profiles').update({ plan_id: planId }).eq('id', userId)
  if (error) throw error
  await logRemote('plano.alterado', `${userId} -> ${planId}`, actor)
}

export async function setStatusRemote(userId, status, actor) {
  if (!HAS_SUPABASE) return local.setUserStatus(local.loadDb(), userId, status, actor)
  const { error } = await supabase.from('profiles').update({ status }).eq('id', userId)
  if (error) throw error
  await logRemote('usuario.status', `${userId} -> ${status}`, actor)
}

export async function addNoticeRemote(notice, actor) {
  if (!HAS_SUPABASE) return local.addNotice(local.loadDb(), notice, actor)
  const tenant = (await supabase.from('tenants').select('id').eq('slug', 'ana').maybeSingle()).data
  const { error } = await supabase.from('notices').insert({
    tenant_id: tenant.id,
    title: notice.title,
    body: notice.body,
    audience: notice.audience || 'all',
  })
  if (error) throw error
  await logRemote('aviso.criado', notice.title, actor)
}

export async function addMessageRemote(msg, actor) {
  if (!HAS_SUPABASE) return local.addMessage(local.loadDb(), msg, actor)
  const tenant = (await supabase.from('tenants').select('id').eq('slug', 'ana').maybeSingle()).data
  const { error } = await supabase.from('messages').insert({
    tenant_id: tenant.id,
    from_role: msg.from_role,
    from_user_id: msg.from_user_id || null,
    to_user_id: msg.to_user_id,
    body: msg.body,
  })
  if (error) throw error
  await logRemote('inbox.enviada', msg.body.slice(0, 80), actor)
}

export async function requestPlanChange(planId) {
  if (!HAS_SUPABASE) {
    const db = local.loadDb()
    const plan = db.plans.find((p) => p.id === planId)
    const sessionId = localStorage.getItem('ana.session')
    local.addPayment(db, {
      user_id: sessionId,
      plan_id: planId,
      amount_cents: plan.price_cents,
      status: plan.price_cents ? 'pending_mp' : 'approved',
      method: plan.price_cents ? 'mercado_pago' : 'gratis',
    })
    local.changePlan(db, sessionId, planId, 'self')
    return { ok: true, price_cents: plan.price_cents }
  }
  const { data, error } = await supabase.rpc('request_plan_change', { p_plan_id: planId })
  if (error) throw error
  return data
}

export async function updatePlanRemote(id, patch, actor) {
  if (!HAS_SUPABASE) {
    const db = local.loadDb()
    const plan = db.plans.find((p) => p.id === id)
    Object.assign(plan, patch)
    local.saveDb(db)
    return
  }
  const { error } = await supabase.from('plans').update(patch).eq('id', id)
  if (error) throw error
  await logRemote('plano.editado', id, actor)
}

export async function updateLessonYoutube(id, youtube_id, actor) {
  if (!HAS_SUPABASE) {
    const db = local.loadDb()
    const lesson = db.lessons.find((l) => l.id === id)
    if (lesson) lesson.youtube_id = youtube_id
    local.saveDb(db)
    return
  }
  const { error } = await supabase.from('lessons').update({ youtube_id }).eq('id', id)
  if (error) throw error
  await logRemote('conteudo.youtube', id, actor)
}

export async function updateFreeYoutube(id, youtube_id, actor) {
  if (!HAS_SUPABASE) {
    const db = local.loadDb()
    const item = db.freeContent.find((f) => f.id === id)
    if (item) item.youtube_id = youtube_id
    local.saveDb(db)
    return
  }
  const { error } = await supabase.from('free_content').update({ youtube_id }).eq('id', id)
  if (error) throw error
  await logRemote('conteudo.gratuito', id, actor)
}

export async function updatePaymentStatus(id, status, actor) {
  if (!HAS_SUPABASE) {
    const db = local.loadDb()
    const p = db.payments.find((x) => x.id === id)
    if (p) p.status = status
    local.saveDb(db)
    return
  }
  const { error } = await supabase.from('payments').update({ status }).eq('id', id)
  if (error) throw error
  await logRemote('pagamento.status', `${id} -> ${status}`, actor)
}

export async function updateTenantRemote(patch, actor) {
  if (!HAS_SUPABASE) {
    const db = local.loadDb()
    Object.assign(db.tenant, patch)
    local.saveDb(db)
    return
  }
  const { error } = await supabase.from('tenants').update(patch).eq('slug', 'ana')
  if (error) throw error
  await logRemote('ajuste.tenant', JSON.stringify(patch), actor)
}

export async function resetPasswordRemote(userId, newPassword, actor) {
  if (!HAS_SUPABASE) return local.resetPassword(local.loadDb(), userId, newPassword, actor)
  const { data, error } = await supabase.functions.invoke('admin-reset-password', {
    body: { user_id: userId, new_password: newPassword },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  await logRemote('senha.redefinida', userId, actor)
}

export async function createUserRemote(payload, actor) {
  if (!HAS_SUPABASE) return local.createUser(local.loadDb(), payload, actor)
  const { data, error } = await supabase.functions.invoke('admin-reset-password', {
    body: {
      action: 'create',
      email: aliasEmail(payload.email),
      password: payload.password || '142569',
      name: payload.name,
      plan_id: payload.plan_id,
    },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  await logRemote('usuario.criado', payload.email, actor)
  return data
}

export async function clearLogsRemote() {
  if (!HAS_SUPABASE) {
    clearLogs()
    return
  }
  await supabase.from('audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
}

export { seed, writeLocalLog, readLogs }
