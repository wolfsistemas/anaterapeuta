import { useState } from 'react'
import { useAuth } from '../../lib/auth'
import { addMessageRemote } from '../../lib/api'
import { useToast } from '../../lib/toast'

export default function Inbox() {
  const { user, db, refresh } = useAuth()
  const toast = useToast()
  const [body, setBody] = useState('')
  const admin = db.users.find((u) => u.role === 'superadmin')
  const list = db.messages.filter((m) => m.to_user_id === user.id || m.from_user_id === user.id)

  const send = async (e) => {
    e.preventDefault()
    try {
      await addMessageRemote(
        { from_role: 'client', from_user_id: user.id, to_user_id: admin?.id || user.id, body },
        user.email
      )
      setBody('')
      await refresh()
      toast('Mensagem enviada.')
    } catch (err) {
      toast(err.message || 'Nao foi possivel enviar.', 'err')
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="serif text-4xl">Inbox</h1>
      <p className="mt-2 text-ink-500">Canal interno. Nao use para urgencia clinica.</p>
      <form onSubmit={send} className="card mt-8 space-y-3 p-5">
        <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} required placeholder="Escreva para a Ana" />
        <button className="btn-primary" type="submit">
          Enviar
        </button>
      </form>
      <div className="mt-6 space-y-3">
        {list.map((m) => (
          <div key={m.id} className="card p-5 text-sm">
            <p className="text-xs text-ink-500">
              {m.from_role === 'admin' ? 'Ana' : 'Voce'} · {new Date(m.created_at).toLocaleString('pt-BR')}
            </p>
            <p className="mt-2">{m.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
