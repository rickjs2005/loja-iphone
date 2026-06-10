-- ============================================================================
--  Rate limit de login persistente (substitui o Map em memória, que zera a
--  cada cold start em serverless). A tabela não é acessível via API: apenas
--  as funções SECURITY DEFINER mexem nela. O app envia um HASH do IP (LGPD).
-- ============================================================================

create table if not exists public.login_attempts (
  ip_hash  text primary key,
  count    integer not null default 0,
  reset_at timestamptz not null
);

alter table public.login_attempts enable row level security;
revoke all on public.login_attempts from anon, authenticated;

-- Consulta: pode tentar logar? (não incrementa)
create or replace function public.login_rate_check(p_ip_hash text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v record;
  v_max constant integer := 5;
begin
  -- Higiene oportunista: descarta janelas mortas há mais de 1 dia.
  delete from login_attempts where reset_at < now() - interval '1 day';

  select * into v from login_attempts where ip_hash = p_ip_hash;
  if v is null or v.reset_at < now() then
    return jsonb_build_object('allowed', true, 'retry_after_ms', 0);
  end if;
  if v.count >= v_max then
    return jsonb_build_object(
      'allowed', false,
      'retry_after_ms', (extract(epoch from (v.reset_at - now())) * 1000)::bigint
    );
  end if;
  return jsonb_build_object('allowed', true, 'retry_after_ms', 0);
end;
$$;

-- Registra uma tentativa que falhou (janela de 15 minutos).
create or replace function public.login_rate_fail(p_ip_hash text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  insert into login_attempts (ip_hash, count, reset_at)
  values (p_ip_hash, 1, now() + interval '15 minutes')
  on conflict (ip_hash) do update set
    count    = case when login_attempts.reset_at < now() then 1
                    else login_attempts.count + 1 end,
    reset_at = case when login_attempts.reset_at < now()
                    then now() + interval '15 minutes'
                    else login_attempts.reset_at end;
end;
$$;

-- Login bem-sucedido: limpa o contador do IP.
create or replace function public.login_rate_reset(p_ip_hash text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  delete from login_attempts where ip_hash = p_ip_hash;
end;
$$;

grant execute on function
  public.login_rate_check(text),
  public.login_rate_fail(text),
  public.login_rate_reset(text)
to anon, authenticated;
