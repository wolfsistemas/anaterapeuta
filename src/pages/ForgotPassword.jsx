import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { HAS_SUPABASE } from '../lib/config'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export default function ForgotPassword() {
  const { requestReset } = useAuth()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(null)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const res = await requestReset(email.trim())
    if (!res.ok) {
      setError(res.error)
      return
    }
    setDone(res)
  }

  return (
    <div className="min-h-screen">
      <SiteHeader solid />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="serif text-4xl">Esqueci a senha</h1>
        <p className="mt-2 text-sm text-ink-500">
          {HAS_SUPABASE
            ? 'Enviamos um link de redefinicao para o e-mail da conta, se ela existir.'
            : 'No modo demo o token aparece abaixo.'}
        </p>
        <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
          <label className="block text-sm">
            E-mail ou usuario
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          {error && <p className="text-sm text-clay-600">{error}</p>}
          <button className="btn-primary w-full" type="submit">
            Enviar link
          </button>
        </form>
        {done && (
          <div className="card mt-6 p-5 text-sm">
            <p>Se a conta existir, o pedido foi registrado.</p>
            {done.demoToken && (
              <p className="mt-3">
                Token demo: <strong>{done.demoToken}</strong>
                <br />
                <Link className="text-sage-700" to={`/redefinir-senha?email=${encodeURIComponent(email)}&token=${done.demoToken}`}>
                  Abrir tela de redefinicao
                </Link>
              </p>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
