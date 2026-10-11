import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  Bell,
  Wallet,
  ScrollText,
  Settings,
  ArrowLeft,
  LogOut,
} from 'lucide-react'

const items = [
  { to: '/admin', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/planos', label: 'Planos', icon: CreditCard },
  { to: '/admin/conteudo', label: 'Conteudo', icon: BookOpen },
  { to: '/admin/avisos', label: 'Avisos', icon: Bell },
  { to: '/admin/pagamentos', label: 'Pagamentos', icon: Wallet },
  { to: '/admin/logs', label: 'Logs', icon: ScrollText },
  { to: '/admin/ajustes', label: 'Ajustes', icon: Settings },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-cream-100 md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-cream-200 bg-ink-900 text-cream-100 md:min-h-screen md:border-b-0">
        <div className="px-5 py-6">
          <p className="serif text-xl text-white">Superadmin</p>
          <p className="text-xs uppercase tracking-widest text-sage-300">Controle da casa</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-2xl px-3 py-2 text-sm ${
                  isActive ? 'bg-sage-600 text-white' : 'text-cream-200 hover:bg-white/10'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden px-5 py-6 md:block">
          <p className="text-xs text-cream-200">{user.name}</p>
          <button className="btn-ghost mt-4 w-full border-white/20 py-2 text-xs text-white" onClick={() => nav('/app')}>
            <ArrowLeft className="h-3 w-3" /> Ver como aluno
          </button>
          <button
            className="mt-3 flex items-center gap-2 text-sm text-cream-200"
            onClick={() => {
              logout()
              nav('/')
            }}
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>
      <main className="px-5 py-8 md:px-10">
        <Outlet />
      </main>
    </div>
  )
}
