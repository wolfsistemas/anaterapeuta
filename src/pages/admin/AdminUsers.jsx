import { useState } from 'react'
import { useAuth } from '../../lib/auth'
import {
  changePlanRemote,
  resetPasswordRemote,
  setStatusRemote,
  createUserRemote,
  addMessageRemote,
} from '../../lib/api'
import { useToast } from '../../lib/toast'

export default function AdminUsers() {
  const { db, refresh, user: me } = useAuth()
  const toast = useToast()
  const [q, setQ] = useState('')
  const livre = db.plans.find((p) => p.slug === 'livre')?.id || ''
  const [form, setForm] = useState({ name: '', email: '', password: '142569', plan_id: livre })
  const [pwd, setPwd] = useState({})
  const [msg, setMsg] = useState({})

  const list = (db.users || []).filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <h1 className="serif text-4xl">Usuarios</h1>
      <p className="mt-2 text-ink-500">Busca, plano, bloqueio, reset de senha e mensagem direta.</p>
      <input className="mt-6 max-w-md" placeholder="Buscar nome ou usuario" value={q} onChange={(e) => setQ(e.target.value)} />

      <form
        className="card mt-6 grid gap-3 p-5 md:grid-cols-4"
        onSubmit={async (e) => {
          e.preventDefault()
          try {
            await createUserRemote({ ...form, plan_id: form.plan_id || livre }, me.email)
            await refresh()
            toast('Usuario criado.')
            setForm({ name: '', email: '', password: '142569', plan_id: livre })
          } catch (err) {
            toast(err.message || 'Falha ao criar.', 'err')
          }
        }}
      >
        <input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <select value={form.plan_id || livre} onChange={(e) => setForm({ ...form, plan_id: e.target.value })}>
          {db.plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button className="btn-primary" type="submit">
          Criar aluno
        </button>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-ink-500">
            <tr>
              <th className="py-3">Pessoa</th>
              <th>Plano</th>
              <th>Status</th>
              <th>Senha</th>
              <th>Inbox</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-t border-cream-200 align-top">
                <td className="py-4">
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-ink-500">{u.email}</p>
                  <p className="text-xs text-ink-500">{u.role}</p>
                </td>
                <td className="py-4">
                  <select
                    value={u.plan_id || ''}
                    onChange={async (e) => {
                      try {
                        await changePlanRemote(u.id, e.target.value, me.email)
                        await refresh()
                        toast('Plano atualizado.')
                      } catch (err) {
                        toast(err.message || 'Falha.', 'err')
                      }
                    }}
                  >
                    {db.plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4">
                  <button
                    className="btn-ghost py-2 text-xs"
                    onClick={async () => {
                      await setStatusRemote(u.id, u.status === 'blocked' ? 'active' : 'blocked', me.email)
                      await refresh()
                    }}
                  >
                    {u.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                  </button>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <input
                      className="w-28 py-2"
                      placeholder="nova senha"
                      value={pwd[u.id] || ''}
                      onChange={(e) => setPwd({ ...pwd, [u.id]: e.target.value })}
                    />
                    <button
                      className="btn-primary py-2 text-xs"
                      onClick={async () => {
                        if (!pwd[u.id]) return
                        try {
                          await resetPasswordRemote(u.id, pwd[u.id], me.email)
                          toast(`Senha de ${u.email} redefinida.`)
                          setPwd({ ...pwd, [u.id]: '' })
                        } catch (err) {
                          toast(err.message || 'Falha no reset. Deploy da function admin-reset-password pendente.', 'err')
                        }
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <input
                      className="w-40 py-2"
                      placeholder="mensagem"
                      value={msg[u.id] || ''}
                      onChange={(e) => setMsg({ ...msg, [u.id]: e.target.value })}
                    />
                    <button
                      className="btn-ghost py-2 text-xs"
                      onClick={async () => {
                        if (!msg[u.id]) return
                        await addMessageRemote({ from_role: 'admin', from_user_id: me.id, to_user_id: u.id, body: msg[u.id] }, me.email)
                        await refresh()
                        toast('Mensagem enviada.')
                        setMsg({ ...msg, [u.id]: '' })
                      }}
                    >
                      Enviar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
