import { useAuth } from '../../lib/auth'
import { updateLessonYoutube, updateFreeYoutube } from '../../lib/api'
import { useToast } from '../../lib/toast'
import YoutubeEmbed from '../../components/YoutubeEmbed'

export default function AdminContent() {
  const { db, refresh, user } = useAuth()
  const toast = useToast()

  const setLesson = async (id, youtube_id) => {
    await updateLessonYoutube(id, youtube_id, user.email)
    await refresh()
  }

  const setFree = async (id, youtube_id) => {
    await updateFreeYoutube(id, youtube_id, user.email)
    await refresh()
  }

  return (
    <div>
      <h1 className="serif text-4xl">Conteudo</h1>
      <p className="mt-2 text-ink-500">Cole o ID do YouTube (a parte depois de v=). Capas vao no Storage.</p>

      <h2 className="serif mt-10 text-2xl">Gratuitos</h2>
      <div className="mt-4 space-y-4">
        {db.freeContent.map((f) => (
          <div key={f.id} className="card grid gap-4 p-5 md:grid-cols-2">
            <div>
              <p className="font-semibold">{f.title}</p>
              <input
                className="mt-3"
                value={f.youtube_id || ''}
                placeholder="ID YouTube"
                onChange={(e) => setFree(f.id, e.target.value)}
              />
            </div>
            <YoutubeEmbed id={f.youtube_id} title={f.title} />
          </div>
        ))}
      </div>

      <h2 className="serif mt-10 text-2xl">Aulas pagas</h2>
      <div className="mt-4 space-y-4">
        {db.lessons.map((l) => (
          <div key={l.id} className="card grid gap-4 p-5 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-sage-600">
                {db.courses.find((c) => c.id === l.course_id)?.title}
              </p>
              <p className="font-semibold">{l.title}</p>
              <input
                className="mt-3"
                value={l.youtube_id || ''}
                onChange={(e) => setLesson(l.id, e.target.value)}
              />
              <button className="btn-ghost mt-3 py-2 text-xs" onClick={() => toast('ID salvo.')}>
                Ok
              </button>
            </div>
            <YoutubeEmbed id={l.youtube_id} title={l.title} />
          </div>
        ))}
      </div>
    </div>
  )
}
