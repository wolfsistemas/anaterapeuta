import { useAuth } from '../../lib/auth'
import { updatePlanRemote } from '../../lib/api'
import { useToast } from '../../lib/toast'

export default function AdminPlans() {
  const { db, refresh, user } = useAuth()
  const toast = useToast()

  const patch = async (id, field, value) => {
    try {
      await updatePlanRemote(id, { [field]: value }, user.email)
      await refresh()
    } catch (err) {
      toast(err.message || 'Falha ao salvar plano.', 'err')
    }
  }

  return (
    <div>
      <h1 className="serif text-4xl">Planos</h1>
      <p className="mt-2 text-ink-500">Preco, sessoes mensais e o que cada plano libera.</p>
      <div className="mt-8 grid gap-5">
        {db.plans.map((p) => (
          <div key={p.id} className="card grid gap-4 p-6 md:grid-cols-4">
            <div>
              <p className="serif text-2xl">{p.name}</p>
              <p className="text-xs uppercase tracking-widest text-sage-600">{p.slug}</p>
            </div>
            <label className="text-sm">
              Preco (centavos)
              <input
                type="number"
                value={p.price_cents}
                onChange={(e) => patch(p.id, 'price_cents', Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              Sessoes / mes
              <input
                type="number"
                value={p.sessions_month}
                onChange={(e) => patch(p.id, 'sessions_month', Number(e.target.value))}
              />
            </label>
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={p.has_courses}
                  onChange={(e) => patch(p.id, 'has_courses', e.target.checked)}
                />
                Cursos
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={p.has_mentorship}
                  onChange={(e) => patch(p.id, 'has_mentorship', e.target.checked)}
                />
                Mentoria
              </label>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary mt-6" onClick={() => toast('Planos salvos no Supabase.')}>
        Confirmar
      </button>
    </div>
  )
}
