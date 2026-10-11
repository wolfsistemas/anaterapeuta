import { Link } from 'react-router-dom'
import { BRAND } from '../lib/config'

export default function SiteFooter() {
  return (
    <footer className="border-t border-cream-200 bg-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="serif text-2xl text-ink-900">Ana</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">{BRAND.tagline}</p>
        </div>
        <div className="text-sm text-ink-500">
          <p className="mb-3 font-semibold text-ink-900">Espaco</p>
          <div className="flex flex-col gap-2">
            <Link to="/termos">Termos de uso</Link>
            <Link to="/privacidade">Politica de privacidade</Link>
            <Link to="/entrar">Area do aluno</Link>
          </div>
        </div>
        <div className="text-sm text-ink-500">
          <p className="mb-3 font-semibold text-ink-900">Contato</p>
          <p>WhatsApp: {BRAND.whatsapp}</p>
          <p>Instagram: @{BRAND.instagram}</p>
          <p>{BRAND.email}</p>
        </div>
      </div>
      <p className="border-t border-cream-200 py-5 text-center text-xs text-ink-500">
        Ana | Terapia e Mentoria · atendimento online · Brasil
      </p>
    </footer>
  )
}
