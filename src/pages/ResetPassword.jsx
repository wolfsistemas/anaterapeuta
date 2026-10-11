import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { HAS_SUPABASE } from '../lib/config'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export default function ResetPassword() {
  const { confirmReset } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState(params.get('email') || '')
  const [token, setToken] = useState(params.get('token') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const res = await confirmReset(email.trim(), token.trim(), password)
    if (!res.ok) {
      setError(res.error)
      return
    }
    toast('Senha redefinida.')
    nav('/entrar')
  }

  return (
    <div className="min-h-screen">
      <SiteHeader solid />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="serif text-4xl">Redefinir senha</h1>
        <p className="mt-2 text-sm text-ink-500">
          {HAS_SUPABASE
            ? 'Abra esta pagina pelo link do e-mail e escolha a nova senha.'
            : 'Use o token gerado na tela de esqueci a senha.'}
        </p>
        <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
          {!HAS_SUPABASE && (
            <>
              <label className="block text-sm">
                E-mail ou usuario
                <input value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label className="block text-sm">
                Token
                <input value={token} onChange={(e) => setToken(e.target.value)} required />
              </label>
            </>
          )}
          <label className="block text-sm">
            Nova senha
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </label>
          {error && <p className="text-sm text-clay-600">{error}</p>}
          <button className="btn-primary w-full" type="submit">
            Salvar senha
          </button>
          <p className="text-center text-sm">
            <Link to="/entrar">Voltar ao login</Link>
          </p>
        </form>
      </main>
      <SiteFooter />
    </div>
  )
}
