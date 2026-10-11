import { useAuth, planOf } from '../../lib/auth'
import { PLAN_COPY } from '../../lib/config'
import { requestPlanChange } from '../../lib/api'
import { useToast } from '../../lib/toast'
import { registerPush, demoNotify } from '../../lib/push'

export default function Account() {
  const { user, db, refresh } = useAuth()
  const plan = planOf(user, db)
  const toast = useToast()

  const subscribe = async (slug) => {
    const next = db.plans.find((p) => p.slug === slug)
    if (!next) return
    try {
      const res = await requestPlanChange(next.id)
      await refresh()
      toast(res?.price_cents ? 'Pedido registrado. Checkout Mercado Pago entra quando a chave MP estiver no ar.' : 'Plano Livre ativado.')
    } catch (err) {
      toast(err.message || 'Nao foi possivel trocar o plano.', 'err')
    }
  }

  return (
    <div>
      <h1 className="serif text-4xl">Conta</h1>
      <div className="card mt-8 max-w-lg p-6">
        <p className="text-sm text-ink-500">Nome</p>
        <p className="font-semibold">{user.name}</p>
        <p className="mt-4 text-sm text-ink-500">Usuario</p>
        <p className="font-semibold">{user.email}</p>
        <p className="mt-4 text-sm text-ink-500">Plano atual</p>
        <p className="font-semibold">{plan.name}</p>
      </div>
      <h2 className="serif mt-10 text-2xl">Trocar plano</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {Object.entries(PLAN_COPY).map(([slug, p]) => (
          <button key={slug} onClick={() => subscribe(slug)} className="card p-5 text-left">
            <p className="serif text-xl">{p.name}</p>
            <p className="mt-1 text-sm text-ink-500">{p.price ? `R$ ${p.price}/mes` : 'Gratis'}</p>
          </button>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          className="btn-ghost"
          onClick={async () => {
            const r = await registerPush()
            toast(r.ok ? 'Push preparado neste navegador.' : r.error)
          }}
        >
          Ativar notificacoes
        </button>
        <button className="btn-ghost" onClick={() => demoNotify('Ana', 'Lembrete: seu espaco continua aqui.')}>
          Testar aviso local
        </button>
      </div>
    </div>
  )
}
