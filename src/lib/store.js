import { seed } from './seed'
import { writeLog } from './logs'

const KEY = 'ana.db.v1'

function clone(v) {
  return JSON.parse(JSON.stringify(v))
}

export function loadDb() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  const fresh = clone(seed)
  localStorage.setItem(KEY, JSON.stringify(fresh))
  return fresh
}

export function saveDb(db) {
  localStorage.setItem(KEY, JSON.stringify(db))
  return db
}

export function resetDb() {
  localStorage.removeItem(KEY)
  return loadDb()
}

export function getPlan(db, planId) {
  return db.plans.find((p) => p.id === planId)
}

export function upsertUser(db, user) {
  const i = db.users.findIndex((u) => u.id === user.id)
  if (i >= 0) db.users[i] = user
  else db.users.push(user)
  saveDb(db)
  return user
}

export function changePlan(db, userId, planId, actor) {
  const user = db.users.find((u) => u.id === userId)
  if (!user) return null
  user.plan_id = planId
  saveDb(db)
  writeLog('plano.alterado', `${user.email} -> ${planId}`, actor)
  return user
}

export function resetPassword(db, userId, nextPassword, actor) {
  const user = db.users.find((u) => u.id === userId)
  if (!user) return null
  user.password = nextPassword
  saveDb(db)
  writeLog('senha.redefinida', user.email, actor)
  return user
}

export function addNotice(db, notice, actor) {
  db.notices.unshift({ ...notice, id: crypto.randomUUID(), created_at: new Date().toISOString() })
  saveDb(db)
  writeLog('aviso.criado', notice.title, actor)
}

export function addMessage(db, msg, actor) {
  db.messages.unshift({ ...msg, id: crypto.randomUUID(), created_at: new Date().toISOString(), read: false })
  saveDb(db)
  writeLog('inbox.enviada', msg.body.slice(0, 80), actor)
}

export function addPayment(db, payment) {
  db.payments.unshift({ ...payment, id: crypto.randomUUID(), created_at: new Date().toISOString() })
  saveDb(db)
}

export function setUserStatus(db, userId, status, actor) {
  const user = db.users.find((u) => u.id === userId)
  if (!user) return
  user.status = status
  saveDb(db)
  writeLog('usuario.status', `${user.email} -> ${status}`, actor)
}

export function createUser(db, payload, actor) {
  const user = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    status: 'active',
    phone: '',
    role: 'client',
    ...payload,
  }
  db.users.push(user)
  saveDb(db)
  writeLog('usuario.criado', user.email, actor)
  return user
}
