import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth, planOf } from '../../lib/auth'
import { Home, BookOpen, Video, Bell, Inbox, UserRound, LogOut, Shield } from 'lucide-react'

const items = [
  { to: '/app', label: 'Inicio', icon: Home, end: true },
  { to: '/app/cursos', label: 'Cursos', icon: BookOpen },
  { to: '/app/sessoes', label: 'Sessoes', icon: Video },
  { to: '/app/avisos', label: 'Avisos', icon: Bell },
  { to: '/app/inbox', label: 'Inbox', icon: Inbox },
  { to: '/app/conta', label: 'Conta', icon: UserRound },
]

export default function AppLayout() {
  const { user, db, logout } = useAuth()
  const plan = planOf(user, db)
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-cream-100 md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-cream-200 bg-cream-50 md:min-h-screen md:border-b-0 md:border-r">
        <div className="px-5 py-6">
          <p className="serif text-xl">Ana</p>
          <p className="text-xs uppercase tracking-widest text-sage-600">Area do aluno</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-2xl px-3 py-2 text-sm ${
                  isActive ? 'bg-sage-600 text-white' : 'text-ink-700 hover:bg-white'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden px-5 py-6 md:block">
          <p className="text-xs text-ink-500">{user.name}</p>
          <p className="text-xs font-semibold text-sage-700">{plan.name}</p>
          {user.role === 'superadmin' && (
            <button className="btn-ghost mt-4 w-full py-2 text-xs" onClick={() => nav('/admin')}>
              <Shield className="h-3 w-3" /> Superadmin
            </button>
          )}
          <button
            className="mt-3 flex items-center gap-2 text-sm text-ink-500"
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
