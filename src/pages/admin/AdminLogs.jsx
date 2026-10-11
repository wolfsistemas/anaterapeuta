import { useAuth } from '../../lib/auth'
import { clearLogsRemote } from '../../lib/api'
import { useToast } from '../../lib/toast'

export default function AdminLogs() {
  const { db, refresh } = useAuth()
  const toast = useToast()
  const list = db.logs || []
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="serif text-4xl">Logs</h1>
          <p className="mt-2 text-ink-500">Registro simples: quem fez o que, e quando.</p>
        </div>
        <button
          className="btn-ghost"
          onClick={async () => {
            await clearLogsRemote()
            await refresh()
            toast('Logs limpos.')
          }}
        >
          Limpar
        </button>
      </div>
      <ul className="mt-8 space-y-2">
        {list.map((l) => (
          <li key={l.id} className="card grid gap-1 p-4 text-sm md:grid-cols-[180px_140px_1fr]">
            <span className="text-ink-500">{new Date(l.at).toLocaleString('pt-BR')}</span>
            <span className="font-semibold">{l.action}</span>
            <span>
              {l.actor} — {l.detail}
            </span>
          </li>
        ))}
        {!list.length && <p className="text-ink-500">Sem registros.</p>}
      </ul>
    </div>
  )
}
