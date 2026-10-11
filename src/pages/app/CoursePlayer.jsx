import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth, planOf, canAccessCourse } from '../../lib/auth'
import YoutubeEmbed from '../../components/YoutubeEmbed'

export default function CoursePlayer() {
  const { id } = useParams()
  const { user, db } = useAuth()
  const plan = planOf(user, db)
  const course = (db.courses || []).find((c) => c.id === id)
  const lessons = (db.lessons || []).filter((l) => l.course_id === id).sort((a, b) => a.sort - b.sort)
  const [current, setCurrent] = useState(lessons[0])
  if (!course) return <Navigate to="/app/cursos" replace />
  if (!canAccessCourse(plan, course)) {
    return (
      <div className="card max-w-lg p-8">
        <h1 className="serif text-3xl">Conteudo exclusivo</h1>
        <p className="mt-3 text-ink-500">Este curso pede o plano {course.plan_min}.</p>
        <Link to="/app/conta" className="btn-primary mt-6">
          Ver planos
        </Link>
      </div>
    )
  }
  return (
    <div>
      <Link to="/app/cursos" className="text-sm text-sage-700">
        Voltar aos cursos
      </Link>
      <h1 className="serif mt-3 text-4xl">{course.title}</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <div className="card p-4">
          <YoutubeEmbed id={current?.youtube_id} title={current?.title} />
          <h2 className="serif mt-4 px-2 text-2xl">{current?.title}</h2>
          <p className="px-2 text-sm text-ink-500">{current?.minutes} min</p>
        </div>
        <aside className="card p-4">
          <p className="px-2 text-xs uppercase tracking-widest text-sage-600">Aulas</p>
          <ul className="mt-3 space-y-1">
            {lessons.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => setCurrent(l)}
                  className={`w-full rounded-2xl px-3 py-3 text-left text-sm ${
                    current?.id === l.id ? 'bg-sage-600 text-white' : 'hover:bg-cream-100'
                  }`}
                >
                  {l.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
