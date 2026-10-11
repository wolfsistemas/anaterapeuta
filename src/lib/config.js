export const TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG || 'ana'

export const BRAND = {
  name: 'Ana | Terapia e Mentoria',
  short: 'Ana',
  tagline: 'Um espaco para respirar, se ouvir e crescer.',
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP || '5500000000000',
  instagram: import.meta.env.VITE_CONTACT_INSTAGRAM || 'anaterapeuta',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'contato@anaterapeuta.com.br',
}

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
export const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON && !SUPABASE_URL.includes('YOUR_PROJECT'))

export const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
export const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY || ''

export const PLAN_COPY = {
  livre: {
    name: 'Livre',
    price: 0,
    period: 'sempre',
    badge: 'Gratuito',
    summary: 'Conteudos abertos para voce comecar no seu ritmo.',
    includes: ['Biblioteca gratuita', 'Artigos e reflexoes', 'Avisos da comunidade'],
  },
  cursos: {
    name: 'Cursos',
    price: 97,
    period: 'mes',
    badge: 'Mais escolhido',
    summary: 'Todos os cursos gravados, aulas novas e videos exclusivos no YouTube.',
    includes: ['Todos os cursos online', 'Videos pagos (YouTube unlisted)', 'Materiais no Storage', 'Inbox e avisos'],
  },
  acompanhamento: {
    name: 'Acompanhamento',
    price: 897,
    period: 'mes',
    badge: 'Completo',
    summary: 'Cursos + mentoria em grupo + 4 sessoes individuais com link de Meet/Zoom.',
    includes: [
      'Tudo do plano Cursos',
      '4 sessoes individuais / mes',
      'Link Meet/Zoom do plano',
      'Mentoria em grupo',
      'Prioridade na inbox',
    ],
  },
}

export const DEMO_USERS = {
  superadmin: { email: 'superadmin', password: '142569', role: 'superadmin', plan: 'acompanhamento' },
  terapeuta: { email: 'terapeuta', password: '142569', role: 'client', plan: 'cursos' },
}
