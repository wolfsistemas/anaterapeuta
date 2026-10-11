import { Link } from 'react-router-dom'
import { useAuth, planOf } from '../../lib/auth'

export default function Overview() {
  const { user, db } = useAuth()
  const plan = planOf(user, db)
  const unread = (db.messages || []).filter((m) => m.to_user_id === user.id && !m.read).length
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-sage-600">Ola</p>
      <h1 className="serif mt-2 text-4xl">{user.name}</h1>
      <p className="mt-2 text-ink-500">
        Seu plano agora e <strong>{plan.name}</strong>.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link to="/app/cursos" className="card p-6">
          <p className="text-xs uppercase tracking-widest text-sage-600">Cursos</p>
          <p className="serif mt-2 text-2xl">{plan.has_courses ? 'Liberados' : 'Bloqueados'}</p>
          <p className="mt-2 text-sm text-ink-500">
            {plan.has_courses ? 'Assista no seu ritmo.' : 'Assine Cursos ou Acompanhamento.'}
          </p>
        </Link>
        <Link to="/app/sessoes" className="card p-6">
          <p className="text-xs uppercase tracking-widest text-sage-600">Sessoes</p>
          <p className="serif mt-2 text-2xl">{plan.sessions_month} / mes</p>
          <p className="mt-2 text-sm text-ink-500">Link Meet/Zoom do plano, quando incluso.</p>
        </Link>
        <Link to="/app/inbox" className="card p-6">
          <p className="text-xs uppercase tracking-widest text-sage-600">Inbox</p>
          <p className="serif mt-2 text-2xl">{unread} nova(s)</p>
          <p className="mt-2 text-sm text-ink-500">Avisos pessoais da Ana.</p>
        </Link>
      </div>
    </div>
  )
}
