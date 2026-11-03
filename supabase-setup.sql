-- Execute no SQL Editor do Supabase após conferir os nomes/tipos das colunas.
-- Este script parte do princípio de que as tabelas já existem em public.

-- Exposição e RLS: permissões de leitura pública para exercícios demonstrativos.
grant usage on schema public to anon, authenticated;
grant select on table public.comentarios to anon, authenticated;
grant insert on table public.comentarios to anon, authenticated;
grant select on table public.candidatos to anon, authenticated;
grant update (votos) on table public.candidatos to anon, authenticated;
grant select on table public.horarios to anon, authenticated;
grant update (reservado, reservado_por) on table public.horarios to anon, authenticated;

alter table public.comentarios enable row level security;
alter table public.candidatos enable row level security;
alter table public.horarios enable row level security;

drop policy if exists "comentarios leitura publica" on public.comentarios;
create policy "comentarios leitura publica" on public.comentarios
for select to anon, authenticated using (true);

drop policy if exists "comentarios insercao publica" on public.comentarios;
create policy "comentarios insercao publica" on public.comentarios
for insert to anon, authenticated with check (char_length(texto) <= 200);

drop policy if exists "candidatos leitura publica" on public.candidatos;
create policy "candidatos leitura publica" on public.candidatos
for select to anon, authenticated using (true);

drop policy if exists "candidatos atualizacao de votos" on public.candidatos;
create policy "candidatos atualizacao de votos" on public.candidatos
for update to anon, authenticated using (true) with check (votos >= 0);

drop policy if exists "horarios leitura publica" on public.horarios;
create policy "horarios leitura publica" on public.horarios
for select to anon, authenticated using (true);

drop policy if exists "horarios reserva de horario livre" on public.horarios;
create policy "horarios reserva de horario livre" on public.horarios
for update to anon, authenticated
using (reservado = false)
with check (reservado = true);

-- Votação atômica: o banco incrementa votos sem depender do valor lido pelo navegador.
create or replace function public.increment_candidate_vote(candidate_id text)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.candidatos
  set votos = coalesce(votos, 0) + 1
  where id::text = candidate_id;
$$;

grant execute on function public.increment_candidate_vote(bigint) to anon, authenticated;

-- Realtime: adicione comentarios, candidatos e horarios à publicação, se ainda não estiverem.
do $$
declare t text;
begin
  foreach t in array array['comentarios','candidatos','horarios'] loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- IMPORTANTE:
-- 1. A função recebe o ID como texto e compara com id::text, aceitando bigint ou uuid.
-- 2. A coluna horarios.reservado_por deve aceitar UUID ou NULL para este exemplo.
--    O frontend grava auth.users.id somente quando há usuário autenticado.
-- 3. Para produção, não deixe votação e reservas irrestritas a visitantes:
--    implemente autenticação, registro de voto por usuário e políticas RLS por identidade.
