import { useState } from 'react'
import { useAuth } from '../../lib/auth'
import { addNoticeRemote } from '../../lib/api'
import { useToast } from '../../lib/toast'

export default function AdminNotices() {
  const { db, refresh, user } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ title: '', body: '', audience: 'all' })

  return (
    <div>
      <h1 className="serif text-4xl">Avisos</h1>
      <form
        className="card mt-8 max-w-xl space-y-3 p-6"
        onSubmit={async (e) => {
          e.preventDefault()
          try {
            await addNoticeRemote(form, user.email)
            await refresh()
            toast('Aviso publicado.')
            setForm({ title: '', body: '', audience: 'all' })
          } catch (err) {
            toast(err.message || 'Falha ao publicar.', 'err')
          }
        }}
      >
        <input placeholder="Titulo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea rows={4} placeholder="Texto" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
        <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
          <option value="all">Todos</option>
          <option value="livre">Plano Livre</option>
          <option value="cursos">Plano Cursos</option>
          <option value="acompanhamento">Plano Acompanhamento</option>
        </select>
        <button className="btn-primary" type="submit">
          Publicar
        </button>
      </form>
      <div className="mt-8 space-y-3">
        {db.notices.map((n) => (
          <article key={n.id} className="card p-5">
            <p className="text-xs text-ink-500">
              {n.audience} · {new Date(n.created_at).toLocaleString('pt-BR')}
            </p>
            <h2 className="serif text-xl">{n.title}</h2>
            <p className="text-sm text-ink-500">{n.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
