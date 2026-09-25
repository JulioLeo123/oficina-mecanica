create extension if not exists "pgcrypto";

create table if not exists clientes (
    id          uuid primary key default gen_random_uuid(),
    nome        text not null,
    telefone    text not null,
    email       text,
    criado_em   timestamptz not null default now()
);

create table if not exists veiculos (
    id          uuid primary key default gen_random_uuid(),
    cliente_id  uuid not null references clientes(id) on delete cascade,
    placa       text not null,
    marca       text not null,
    modelo      text not null,
    ano         integer,
    criado_em   timestamptz not null default now()
);

create index if not exists idx_veiculos_cliente on veiculos(cliente_id);

create type status_os as enum (
    'aberta',
    'diagnostico',
    'orcamento_pendente',
    'aprovada',
    'nao_aprovada',
    'em_execucao',
    'finalizada'
);

create table if not exists ordens_servico (
    id            uuid primary key default gen_random_uuid(),
    cliente_id    uuid not null references clientes(id),
    veiculo_id    uuid not null references veiculos(id),
    status        status_os not null default 'aberta',
    descricao     text,
    criado_em     timestamptz not null default now(),
    atualizado_em timestamptz not null default now()
);

create index if not exists idx_os_cliente on ordens_servico(cliente_id);
create index if not exists idx_os_veiculo on ordens_servico(veiculo_id);
create index if not exists idx_os_status on ordens_servico(status);

create or replace function trg_set_atualizado_em()
returns trigger as $$
begin
    new.atualizado_em = now();
    return new;
end;
$$ language plpgsql;

create trigger set_atualizado_em
before update on ordens_servico
for each row execute function trg_set_atualizado_em();
