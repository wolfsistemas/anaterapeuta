import { Link } from 'react-router-dom'
import { useAuth, planOf, canAccessCourse } from '../../lib/auth'
import { Lock } from 'lucide-react'

export default function Courses() {
  const { user, db } = useAuth()
  const plan = planOf(user, db)
  return (
    <div>
      <h1 className="serif text-4xl">Cursos</h1>
      <p className="mt-2 text-ink-500">Videos no YouTube (unlisted) e capas no Supabase Storage.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {(db.courses || []).map((c) => {
          const ok = canAccessCourse(plan, c)
          return (
            <article key={c.id} className="card p-6">
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-cream-100 text-xs uppercase tracking-widest text-sage-700">
                {c.cover || 'SLOT_CAPA_CURSO'}
              </div>
              <p className="mt-4 text-xs uppercase tracking-widest text-sage-600">
                {c.level} · {c.lessons} aulas · plano {c.plan_min}
              </p>
              <h2 className="serif mt-1 text-2xl">{c.title}</h2>
              <p className="mt-2 text-sm text-ink-500">{c.description}</p>
              {ok ? (
                <Link to={`/app/cursos/${c.id}`} className="btn-primary mt-5 py-2 text-sm">
                  Abrir
                </Link>
              ) : (
                <p className="mt-5 flex items-center gap-2 text-sm text-clay-600">
                  <Lock className="h-4 w-4" /> Incluso no plano {c.plan_min}
                </p>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
