import { useAuth } from '../../lib/auth'
import { Link } from 'react-router-dom'

export default function AdminHome() {
  const { db } = useAuth()
  const logs = (db.logs || []).slice(0, 6)
  const livreId = db.plans.find((p) => p.slug === 'livre')?.id
  const paying = (db.users || []).filter((u) => u.plan_id && u.plan_id !== livreId && u.role !== 'superadmin').length
  const money = (db.payments || []).filter((p) => p.status === 'approved').reduce((s, p) => s + p.amount_cents, 0)
  return (
    <div>
      <h1 className="serif text-4xl">Painel</h1>
      <p className="mt-2 text-ink-500">Visao simples do que esta acontecendo na casa.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Usuarios', value: (db.users || []).length },
          { label: 'Assinantes', value: paying },
          { label: 'Aprovado', value: `R$ ${(money / 100).toFixed(0)}` },
          { label: 'Cursos', value: (db.courses || []).length },
        ].map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-xs uppercase tracking-widest text-sage-600">{c.label}</p>
            <p className="serif mt-2 text-3xl">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="serif text-2xl">Ultimos logs</h2>
            <Link to="/admin/logs" className="text-sm text-sage-700">
              Ver todos
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {logs.map((l) => (
              <li key={l.id}>
                <span className="text-ink-500">{new Date(l.at).toLocaleString('pt-BR')} · </span>
                <strong>{l.action}</strong> — {l.detail}
              </li>
            ))}
            {!logs.length && <li className="text-ink-500">Ainda nao ha registros.</li>}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="serif text-2xl">Atalhos</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/admin/usuarios">Redefinir senha de um aluno</Link>
            <Link to="/admin/planos">Ajustar valores e sessoes</Link>
            <Link to="/admin/conteudo">Colar IDs do YouTube</Link>
            <Link to="/admin/avisos">Mandar um aviso</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
