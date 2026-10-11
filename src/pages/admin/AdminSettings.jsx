import { useAuth } from '../../lib/auth'
import { updateTenantRemote } from '../../lib/api'
import { HAS_SUPABASE, BRAND } from '../../lib/config'
import { useToast } from '../../lib/toast'

export default function AdminSettings() {
  const { db, refresh, user } = useAuth()
  const toast = useToast()

  return (
    <div className="max-w-xl">
      <h1 className="serif text-4xl">Ajustes</h1>
      <div className="card mt-8 space-y-4 p-6">
        <label className="text-sm">
          Nome do tenant
          <input
            defaultValue={db.tenant?.name || ''}
            onBlur={async (e) => {
              await updateTenantRemote({ name: e.target.value }, user.email)
              await refresh()
            }}
          />
        </label>
        <label className="text-sm">
          Link Meet / Zoom padrao
          <input
            defaultValue={db.tenant?.meet_url || ''}
            onBlur={async (e) => {
              await updateTenantRemote({ meet_url: e.target.value }, user.email)
              await refresh()
            }}
          />
        </label>
        <p className="text-sm text-ink-500">
          WhatsApp {BRAND.whatsapp} · @{BRAND.instagram} · {BRAND.email}
        </p>
        <p className="text-sm">Supabase: {HAS_SUPABASE ? 'conectado' : 'modo demo (localStorage).'}</p>
        <button className="btn-ghost" onClick={() => toast('Dados agora vivem no Supabase.')}>
          Tenant {db.tenant?.slug || 'ana'}
        </button>
      </div>
    </div>
  )
}
