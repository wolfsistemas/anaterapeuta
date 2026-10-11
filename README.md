# Ana | Terapia e Mentoria

SaaS de terapia, mentoria e cursos online. Front estatico no GitHub Pages, dados e auth no Supabase, pagamentos no Mercado Pago.

Site: `https://wolfsistemas.github.io/anaterapeuta/`

## Contas de teste (modo demo)

Sem keys do Supabase o app roda 100% no navegador (localStorage).

- Superadmin: `superadmin` / `142569`
- Aluno plano Cursos: `terapeuta` / `142569`

## Stack

- Vite + React + Tailwind
- GitHub Pages (`base` = `/anaterapeuta/`)
- Supabase (Postgres, Auth, Storage, Edge Functions)
- Mercado Pago (PIX + cartao)
- PWA + Web Push
- Multitenant por `tenant_id` / `slug`

## Planos da landing

| Plano | Valor | O que entra |
| --- | --- | --- |
| Livre | Gratis | Conteudos abertos |
| Cursos | R$ 97/mes | Cursos + videos YouTube unlisted |
| Acompanhamento | R$ 897/mes | Cursos + mentoria + 4 sessoes (link Meet/Zoom) |

## Como rodar local

```bash
npm install
npm run dev
```

O preview local usa a porta 5173. Para o build de Pages:

```bash
VITE_BASE=/anaterapeuta/ npm run build
```

## Ligar o Supabase

1. Crie o projeto e rode `supabase/schema.sql` no SQL Editor.
2. Rode `supabase/seed.sql`.
3. Copie `.env.example` para `.env` e preencha:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

4. Crie no Auth os usuarios `superadmin` e `terapeuta` (senha `142569`) e amarre em `profiles`.
5. Deploy das functions:

```bash
supabase functions deploy checkout
supabase functions deploy mp-webhook
supabase functions deploy admin-reset-password
supabase functions deploy send-push
```

Secrets das functions: `MP_ACCESS_TOKEN`, `MP_WEBHOOK_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VAPID_PRIVATE_KEY`.

## GitHub Pages

1. Repo Settings > Pages > GitHub Actions.
2. Secrets do repositorio (opcional ate ter Supabase):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CONTACT_WHATSAPP`
- `VITE_CONTACT_INSTAGRAM`
- `VITE_CONTACT_EMAIL`
- `VITE_VAPID_PUBLIC_KEY`

3. Push em `main` dispara `.github/workflows/pages.yml`.

## Midia

- Videos de venda e aulas: YouTube (unlisted). Cole o ID no Superadmin > Conteudo.
- Fotos e arquivos de curso: Supabase Storage. Slots na landing e nos cards (`SLOT_FOTO_HERO`, `SLOT_CAPA_CURSO`).
- Gratuitos na landing; pagos so no painel do aluno com plano ativo.

## Painel do aluno

Inicio, Cursos (player YouTube), Sessoes (saldo + link Meet/Zoom), Avisos, Inbox, Conta (troca de plano + push).

## Superadmin

Usuarios (criar, bloquear, reset de senha, inbox), Planos, Conteudo, Avisos, Pagamentos, Logs, Ajustes (Meet padrao, restaurar demo).

## Contato placeholder

Troque no `.env` ou nos secrets:

- WhatsApp `5500000000000`
- Instagram `@anaterapeuta`
- E-mail `contato@anaterapeuta.com.br`
