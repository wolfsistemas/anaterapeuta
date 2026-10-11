import { useAuth, planOf } from '../../lib/auth'

export default function Sessions() {
  const { user, db } = useAuth()
  const plan = planOf(user, db)
  const row = (db.sessions || []).find((s) => s.user_id === user.id)
  const meet = row?.meet_url || db.tenant?.meet_url
  if (!plan.sessions_month) {
    return (
      <div className="card max-w-lg p-8">
        <h1 className="serif text-3xl">Sessoes</h1>
        <p className="mt-3 text-ink-500">
          O plano {plan.name} nao inclui sessoes individuais. O Acompanhamento libera 4 encontros por mes e o
          link de Meet/Zoom.
        </p>
      </div>
    )
  }
  return (
    <div>
      <h1 className="serif text-4xl">Sessoes</h1>
      <p className="mt-2 text-ink-500">O horario combina-se no atendimento. Aqui fica o link e o saldo do mes.</p>
      <div className="card mt-8 max-w-lg p-8">
        <p className="text-xs uppercase tracking-widest text-sage-600">Saldo</p>
        <p className="serif mt-2 text-4xl">
          {row ? `${row.remaining} restantes` : `${plan.sessions_month} neste mes`}
        </p>
        <p className="mt-2 text-sm text-ink-500">{row?.notes || 'Link fixo do plano.'}</p>
        <a href={meet} target="_blank" rel="noreferrer" className="btn-primary mt-6">
          Abrir Meet / Zoom
        </a>
        <p className="mt-4 break-all text-xs text-ink-500">{meet}</p>
      </div>
    </div>
  )
}
