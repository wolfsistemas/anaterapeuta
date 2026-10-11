import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export default function Register() {
  const { register, db } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const slug = params.get('plano') || 'livre'
  const plan = useMemo(() => db.plans.find((p) => p.slug === slug) || db.plans[0] || { name: 'Livre', price_cents: 0, id: '' }, [db, slug])
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const res = await register({ ...form, plan_id: plan.id })
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    if (res.confirm) {
      toast('Conta criada. Confirme o e-mail se o projeto exigir.')
      nav('/entrar')
      return
    }
    toast('Conta criada.')
    nav('/app')
  }

  return (
    <div className="min-h-screen">
      <SiteHeader solid />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="serif text-4xl">Criar conta</h1>
        <p className="mt-2 text-sm text-ink-500">
          Plano inicial: <strong>{plan.name}</strong>
          {plan.price_cents > 0 ? ` · R$ ${(plan.price_cents / 100).toFixed(0)}/mes` : ' · gratuito'}
        </p>
        <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
          <label className="block text-sm">
            Nome
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="block text-sm">
            E-mail
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label className="block text-sm">
            Senha
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </label>
          {error && <p className="text-sm text-clay-600">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={busy}>
            {busy ? 'Criando...' : 'Continuar'}
          </button>
          <p className="text-center text-sm text-ink-500">
            Ja tem conta? <Link to="/entrar">Entrar</Link>
          </p>
        </form>
      </main>
      <SiteFooter />
    </div>
  )
}
