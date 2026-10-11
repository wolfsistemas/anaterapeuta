import { useAuth } from '../../lib/auth'
import { updatePaymentStatus } from '../../lib/api'
import { useToast } from '../../lib/toast'

export default function AdminPayments() {
  const { db, refresh, user } = useAuth()
  const toast = useToast()

  const setStatus = async (id, status) => {
    await updatePaymentStatus(id, status, user.email)
    await refresh()
    toast('Status atualizado.')
  }

  return (
    <div>
      <h1 className="serif text-4xl">Pagamentos</h1>
      <p className="mt-2 text-ink-500">Pedidos no Supabase. Webhook Mercado Pago entra com MP_ACCESS_TOKEN.</p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-ink-500">
            <tr>
              <th className="py-3">Quando</th>
              <th>Aluno</th>
              <th>Valor</th>
              <th>Metodo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {db.payments.map((p) => (
              <tr key={p.id} className="border-t border-cream-200">
                <td className="py-3">{new Date(p.created_at).toLocaleString('pt-BR')}</td>
                <td>{db.users.find((u) => u.id === p.user_id)?.email}</td>
                <td>R$ {(p.amount_cents / 100).toFixed(2)}</td>
                <td>{p.method}</td>
                <td>
                  <select value={p.status} onChange={(e) => setStatus(p.id, e.target.value)}>
                    <option value="pending_mp">pendente</option>
                    <option value="approved">aprovado</option>
                    <option value="rejected">recusado</option>
                    <option value="refunded">estornado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
