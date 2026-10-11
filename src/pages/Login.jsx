import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const res = await login(email.trim(), password)
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    toast('Bem-vinda de volta.')
    nav(res.user.role === 'superadmin' ? '/admin' : '/app')
  }

  return (
    <div className="min-h-screen">
      <SiteHeader solid />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="serif text-4xl">Entrar</h1>
        <p className="mt-2 text-sm text-ink-500">
          Use <strong>superadmin</strong> / 142569 ou <strong>terapeuta</strong> / 142569. Tambem vale o e-mail
          completo @ana.local.
        </p>
        <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
          <label className="block text-sm">
            E-mail ou usuario
            <input value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
          </label>
          <label className="block text-sm">
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="text-sm text-clay-600">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={busy}>
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
          <div className="flex justify-between text-sm text-ink-500">
            <Link to="/esqueci-senha">Esqueci a senha</Link>
            <Link to="/criar-conta">Criar conta</Link>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  )
}
