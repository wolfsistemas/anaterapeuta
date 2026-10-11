import { useAuth, planOf } from '../../lib/auth'

export default function Notices() {
  const { user, db } = useAuth()
  const plan = planOf(user, db)
  const list = (db.notices || []).filter((n) => n.audience === 'all' || n.audience === plan.slug)
  return (
    <div>
      <h1 className="serif text-4xl">Avisos</h1>
      <div className="mt-8 space-y-4">
        {list.map((n) => (
          <article key={n.id} className="card p-6">
            <p className="text-xs text-ink-500">{new Date(n.created_at).toLocaleDateString('pt-BR')}</p>
            <h2 className="serif mt-1 text-2xl">{n.title}</h2>
            <p className="mt-2 text-ink-500">{n.body}</p>
          </article>
        ))}
        {!list.length && <p className="text-ink-500">Nenhum aviso por enquanto.</p>}
      </div>
    </div>
  )
}
