import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../lib/auth'

export default function SiteHeader({ solid }) {
  const { user } = useAuth()
  return (
    <header
      className={`sticky top-0 z-40 ${
        solid ? 'border-b border-cream-200 bg-cream-50/90 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ink-500 md:flex">
          <a href="#gratuitos" className="hover:text-sage-700">
            Gratuitos
          </a>
          <a href="#terapia" className="hover:text-sage-700">
            Terapia
          </a>
          <a href="#planos" className="hover:text-sage-700">
            Planos
          </a>
          <Link to="/termos" className="hover:text-sage-700">
            Termos
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to={user.role === 'superadmin' ? '/admin' : '/app'} className="btn-primary py-2">
              Entrar no painel
            </Link>
          ) : (
            <>
              <Link to="/entrar" className="btn-ghost py-2 text-sm">
                Entrar
              </Link>
              <Link to="/criar-conta" className="btn-primary py-2 text-sm">
                Comecar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
