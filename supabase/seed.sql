-- Depois de criar os usuarios no Auth (superadmin@local e terapeuta@local),
-- ajuste os UUIDs abaixo. No modo demo do front isso nao e necessario.

do $$
declare
  t uuid;
  p_livre uuid;
  p_cursos uuid;
  p_acomp uuid;
begin
  select id into t from public.tenants where slug = 'ana';

  insert into public.plans (tenant_id, slug, name, price_cents, sessions_month, has_courses, has_mentorship, sort)
  values
    (t, 'livre', 'Livre', 0, 0, false, false, 1),
    (t, 'cursos', 'Cursos', 9700, 0, true, false, 2),
    (t, 'acompanhamento', 'Acompanhamento', 89700, 4, true, true, 3)
  on conflict (tenant_id, slug) do nothing;

  select id into p_livre from public.plans where tenant_id = t and slug = 'livre';
  select id into p_cursos from public.plans where tenant_id = t and slug = 'cursos';
  select id into p_acomp from public.plans where tenant_id = t and slug = 'acompanhamento';

  insert into public.free_content (tenant_id, title, kind, minutes, youtube_id, excerpt)
  values
    (t, 'Por que a terapia muda o chao embaixo dos pes', 'artigo', 6, '', 'Um texto curto sobre parar o automatico.'),
    (t, 'Respirar antes de responder', 'video', 8, 'SLOT_YOUTUBE_GRATUITO_1', 'Pratica guiada. Cole o ID do YouTube.'),
    (t, 'O que a mentoria nao e', 'artigo', 5, '', 'Mentoria e direcao, nao conselho barato.');
end $$;
