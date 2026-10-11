import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { HAS_SUPABASE } from './config'
import { supabase } from './supabase'
import {
  fetchDb,
  loginRemote,
  registerRemote,
  logoutRemote,
  loadProfile,
  requestResetRemote,
  confirmResetRemote,
  aliasEmail,
} from './api'
import { loadDb, saveDb, createUser } from './store'
import { writeLog } from './logs'

const AuthCtx = createContext(null)

function sessionKey() {
  return 'ana.session'
}

function demoLogin(email, password) {
  const current = loadDb()
  const found = current.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (!found) return { ok: false, error: 'E-mail ou senha invalidos.' }
  if (found.status === 'blocked') return { ok: false, error: 'Esta conta esta bloqueada.' }
  localStorage.setItem(sessionKey(), found.id)
  writeLog('login', found.email, found.email)
  return { ok: true, user: found }
}

export function AuthProvider({ children }) {
  const [db, setDb] = useState(() => (HAS_SUPABASE ? { plans: [], freeContent: [], courses: [], lessons: [], notices: [], messages: [], sessions: [], payments: [], users: [], logs: [], tenant: {} } : loadDb()))
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(!HAS_SUPABASE)

  const refresh = async (currentUser = user) => {
    const next = await fetchDb(currentUser)
    setDb(next)
    if (currentUser && HAS_SUPABASE) {
      const fresh = await loadProfile(currentUser.id)
      if (fresh) setUser(fresh)
      return next
    }
    if (currentUser && !HAS_SUPABASE) {
      const fresh = next.users.find((u) => u.id === currentUser.id) || null
      setUser(fresh)
    }
    return next
  }

  useEffect(() => {
    let alive = true
    async function boot() {
      if (!HAS_SUPABASE) {
        try {
          const id = localStorage.getItem(sessionKey())
          const found = id ? loadDb().users.find((u) => u.id === id) : null
          if (alive) {
            setUser(found || null)
            setDb(loadDb())
            setReady(true)
          }
        } catch {
          if (alive) setReady(true)
        }
        return
      }
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user
      if (sessionUser) {
        const profile = await loadProfile(sessionUser.id)
        if (alive) {
          setUser(profile)
          setDb(await fetchDb(profile))
        }
      } else if (alive) {
        setDb(await fetchDb(null))
      }
      if (alive) setReady(true)
    }
    boot()
    if (!HAS_SUPABASE) return () => { alive = false }
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null)
        setDb(await fetchDb(null))
        return
      }
      const profile = await loadProfile(session.user.id)
      setUser(profile)
      setDb(await fetchDb(profile))
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    if (HAS_SUPABASE) {
      const res = await loginRemote(email, password)
      if (!res.ok) return res
      setUser(res.user)
      setDb(await fetchDb(res.user))
      return res
    }
    const res = demoLogin(email, password)
    if (res.ok) {
      setUser(res.user)
      setDb(loadDb())
    }
    return res
  }

  const logout = async () => {
    if (user) writeLog('logout', user.email, user.email)
    if (HAS_SUPABASE) await logoutRemote()
    localStorage.removeItem(sessionKey())
    setUser(null)
    setDb(await fetchDb(null))
  }

  const register = async ({ name, email, password, plan_id }) => {
    if (HAS_SUPABASE) {
      const res = await registerRemote({ name, email, password, plan_id })
      if (!res.ok) return res
      if (res.user) {
        setUser(res.user)
        setDb(await fetchDb(res.user))
      }
      return res
    }
    const current = loadDb()
    if (current.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'Ja existe uma conta com este e-mail.' }
    }
    const created = createUser(current, { name, email, password, plan_id: plan_id || 'plan-livre' }, email)
    localStorage.setItem(sessionKey(), created.id)
    setUser(created)
    setDb(loadDb())
    writeLog('cadastro', created.email, created.email)
    return { ok: true, user: created }
  }

  const requestReset = async (email) => {
    if (HAS_SUPABASE) return requestResetRemote(email)
    const current = loadDb()
    const found = current.users.find((u) => u.email.toLowerCase() === email.toLowerCase() || aliasEmail(u.email) === aliasEmail(email))
    writeLog('senha.pedido', email, email)
    if (!found) return { ok: true }
    const token = crypto.randomUUID().slice(0, 8)
    found.reset_token = token
    found.reset_expires = Date.now() + 1000 * 60 * 30
    saveDb(current)
    return { ok: true, demoToken: token }
  }

  const confirmReset = async (email, token, password) => {
    if (HAS_SUPABASE) return confirmResetRemote(password)
    const current = loadDb()
    const found = current.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!found || found.reset_token !== token || Date.now() > found.reset_expires) {
      return { ok: false, error: 'Token invalido ou expirado.' }
    }
    found.password = password
    found.reset_token = null
    found.reset_expires = null
    saveDb(current)
    writeLog('senha.redefinida', found.email, found.email)
    return { ok: true }
  }

  const value = useMemo(
    () => ({ user, db, ready, login, logout, register, requestReset, confirmReset, refresh }),
    [user, db, ready]
  )

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50 text-ink-500">
        Carregando o espaco...
      </div>
    )
  }

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}

export function planOf(user, db) {
  if (!user) return db.plans.find((p) => p.slug === 'livre') || { name: 'Livre', has_courses: false, sessions_month: 0 }
  return db.plans.find((p) => p.id === user.plan_id) || db.plans[0] || { name: 'Livre', has_courses: false, sessions_month: 0 }
}

export function canAccessCourse(plan, course) {
  if (!plan) return false
  if (course.plan_min === 'livre') return true
  if (course.plan_min === 'cursos') return plan.has_courses
  if (course.plan_min === 'acompanhamento') return plan.has_mentorship
  return false
}
