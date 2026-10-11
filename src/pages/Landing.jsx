import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import YoutubeEmbed from '../components/YoutubeEmbed'
import { PLAN_COPY, BRAND } from '../lib/config'
import { useAuth } from '../lib/auth'
import { Leaf, HeartHandshake, Sparkles, CircleCheck } from 'lucide-react'

const reasons = [
  {
    icon: Leaf,
    title: 'Parar o automatico',
    text: 'A terapia cria um intervalo entre o que acontece e o que voce faz com isso. Nesse intervalo cabe escolha.',
  },
  {
    icon: HeartHandshake,
    title: 'Nao fazer sozinha',
    text: 'Dor repetida pede testemunha. Um espaco sigiloso, etico e constante muda o peso do que se carrega.',
  },
  {
    icon: Sparkles,
    title: 'Crescer com direcao',
    text: 'Mentoria e curso nao substituem terapia. Somam: um cuida da raiz, o outro organiza o caminho.',
  },
]

export default function Landing() {
  const { db } = useAuth()
  const free = db.freeContent || []
  return (
    <div id="topo" className="grain min-h-screen">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-16">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.28em] text-sage-600">Espaco de cuidado online</p>
          <h1 className="serif text-4xl leading-tight text-ink-900 md:text-6xl">
            Um lugar calmo para se ouvir — e seguir.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-500">
            {BRAND.tagline} Sessoes individuais, mentoria e cursos gravados. Voce escolhe o quanto de
            acompanhamento faz sentido agora.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#planos" className="btn-primary">
              Ver planos
            </a>
            <a href="#gratuitos" className="btn-ghost">
              Conteudos gratuitos
            </a>
          </div>
          <p className="mt-6 text-xs text-ink-500">
            Foto da Ana: cole a URL do Supabase Storage no campo cover do tenant.
          </p>
        </div>
        <div className="card overflow-hidden">
          <div className="flex aspect-[4/5] items-end bg-gradient-to-br from-sage-100 via-cream-100 to-clay-400/30 p-8">
            <div>
              <p className="serif text-3xl text-ink-900">Ana</p>
              <p className="mt-2 max-w-xs text-sm text-ink-500">
                Terapia, mentoria e formacao. Atendimento online para o Brasil inteiro.
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-sage-700">SLOT_FOTO_HERO</p>
            </div>
          </div>
        </div>
      </section>

      <section id="gratuitos" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sage-600">Para comecar</p>
          <h2 className="serif mt-2 text-3xl md:text-4xl">Conteudos gratuitos</h2>
          <p className="mt-3 max-w-xl text-ink-500">
            Textos e videos abertos. Os IDs de YouTube e as capas do Storage entram depois — a estrutura ja esta pronta.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {free.map((item) => (
              <article key={item.id} className="card p-5">
                {item.kind === 'video' ? (
                  <YoutubeEmbed id={item.youtube_id} title={item.title} />
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-2xl bg-cream-100 text-xs uppercase tracking-widest text-sage-700">
                    {item.cover || 'SLOT_CAPA_ARTIGO'}
                  </div>
                )}
                <p className="mt-4 text-xs uppercase tracking-widest text-sage-600">{item.kind}</p>
                <h3 className="serif mt-1 text-xl">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{item.excerpt}</p>
                <p className="mt-3 text-xs text-ink-500">{item.minutes} min</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="terapia" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sage-600">Por que terapia</p>
          <h2 className="serif mt-2 max-w-2xl text-3xl md:text-4xl">
            Nao e frescura. E um jeito serio de cuidar do que insiste em voltar.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.title} className="card p-7">
                <r.icon className="h-7 w-7 text-sage-600" />
                <h3 className="serif mt-5 text-2xl">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="bg-sage-700 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-sage-200">Ofertas</p>
          <h2 className="serif mt-2 text-3xl md:text-4xl">Tres caminhos. Voce escolhe a intensidade.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {Object.entries(PLAN_COPY).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-3xl p-7 ${
                  key === 'cursos' ? 'bg-white text-ink-900' : 'border border-white/15 bg-white/5'
                }`}
              >
                <p className="text-xs uppercase tracking-widest opacity-70">{plan.badge}</p>
                <h3 className="serif mt-2 text-3xl">{plan.name}</h3>
                <p className="mt-4 text-4xl font-semibold">
                  {plan.price === 0 ? 'Gratis' : `R$ ${plan.price}`}
                  {plan.price > 0 && <span className="text-base font-normal opacity-70">/{plan.period}</span>}
                </p>
                <p className="mt-3 text-sm leading-relaxed opacity-80">{plan.summary}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {plan.includes.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/criar-conta?plano=${key}`}
                  className={`mt-8 inline-flex w-full justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                    key === 'cursos' ? 'bg-sage-600 text-white' : 'bg-white text-sage-800'
                  }`}
                >
                  {plan.price === 0 ? 'Criar conta gratuita' : 'Assinar'}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-sage-100">
            Pagamento via Mercado Pago (PIX ou cartao). Sessoes do plano Acompanhamento usam o link Meet/Zoom do plano.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="serif text-3xl">Quando voce estiver pronta, a porta esta aberta.</h2>
          <p className="mt-4 text-ink-500">
            Conta de teste: <strong>terapeuta</strong> / 142569 · Superadmin: <strong>superadmin</strong> / 142569
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
