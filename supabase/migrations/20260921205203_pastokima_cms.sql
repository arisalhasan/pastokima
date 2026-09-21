-- Application data is only accessible to the verified Edge Function.
-- No browser role receives table or RPC access.
create table public.cms_owners (
 email text primary key check (email = lower(email)),
 enabled boolean not null default true
);
create table public.cms_state (
 id integer primary key check (id=1), revision integer not null default 0,
 content jsonb not null check (jsonb_typeof(content)='object'), last_op uuid
);
create table public.cms_history (
 id bigint generated always as identity primary key, operation uuid unique not null,
 revision integer not null unique, content jsonb not null, actor uuid,
 created bigint not null, summary text not null
);
create table public.cms_proposals (
 id uuid primary key, actor uuid not null, base integer not null,
 content jsonb not null, summary text not null, expires bigint not null,
 used boolean not null default false
);
create index cms_proposals_actor_idx on public.cms_proposals(actor);
create index cms_proposals_expiry_idx on public.cms_proposals(expires);
create table public.cms_media (
 id uuid primary key, type text not null check(type in ('image/jpeg','video/mp4')),
 size integer not null check(size between 1 and 20971520), created bigint not null,
 deleted integer not null default 2 check(deleted in (0,1,2))
);
create table public.cms_limits (key text primary key, bucket bigint not null, count integer not null);
alter table public.cms_owners enable row level security;
alter table public.cms_state enable row level security;
alter table public.cms_history enable row level security;
alter table public.cms_proposals enable row level security;
alter table public.cms_media enable row level security;
alter table public.cms_limits enable row level security;
revoke all on public.cms_owners,public.cms_state,public.cms_history,public.cms_proposals,public.cms_media,public.cms_limits from public,anon,authenticated;
grant all on public.cms_owners,public.cms_state,public.cms_history,public.cms_proposals,public.cms_media,public.cms_limits to service_role;
grant usage,select on sequence public.cms_history_id_seq to service_role;

create function public.cms_rate(p_key text,p_max integer) returns boolean
language plpgsql security invoker set search_path='' as $$
declare n integer; w bigint := floor(extract(epoch from now())/600);
begin
 insert into public.cms_limits as l(key,bucket,count) values(p_key,w,1)
 on conflict(key) do update set count=case when l.bucket=excluded.bucket then l.count+1 else 1 end,bucket=excluded.bucket returning count into n;
 return n<=p_max;
end;$$;

create function public.cms_publish(p_id uuid,p_actor uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare p public.cms_proposals; s public.cms_state; t bigint:=extract(epoch from now())::bigint; media_id text;
begin
 -- One consistent lock order for publish, reservation and deletion.
 select * into s from public.cms_state where id=1 for update;
 select * into p from public.cms_proposals where id=p_id and actor=p_actor for update;
 if not found then return jsonb_build_object('error','Preview unavailable.','status',404); end if;
 if p.used then return jsonb_build_object('alreadyPublished',true,'message','This change was already published.'); end if;
 if p.expires<t then return jsonb_build_object('error','Preview expired. Prepare it again.','status',409); end if;
 if p.base<>s.revision then return jsonb_build_object('error','The website changed. Reload and review your edit again.','status',409); end if;
 for media_id in select distinct substr(value,8) from jsonb_each_text(p.content) where value like '/media/%' loop
  if not exists(select 1 from public.cms_media where id::text=media_id and deleted=0) then
   return jsonb_build_object('error','A selected media file is unavailable.','status',409);
  end if;
 end loop;
 update public.cms_state set content=p.content,revision=s.revision+1,last_op=p_id where id=1;
 insert into public.cms_history(operation,revision,content,actor,created,summary) values(p_id,s.revision+1,p.content,p_actor,t,p.summary);
 update public.cms_proposals set used=true where id=p_id;
 return jsonb_build_object('message','Published to the website.','revision',s.revision+1);
end;$$;

create function public.cms_reserve_media(p_id uuid,p_type text,p_size integer) returns boolean
language plpgsql security invoker set search_path='' as $$
begin
 perform id from public.cms_state where id=1 for update;
 if (select coalesce(sum(size),0) from public.cms_media)+p_size>314572800 then return false; end if;
 insert into public.cms_media(id,type,size,created) values(p_id,p_type,p_size,extract(epoch from now())::bigint);
 return true;
end;$$;

create function public.cms_mark_media_deleted(p_id uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare m public.cms_media; path text:='/media/'||p_id::text;
begin
 perform id from public.cms_state where id=1 for update;
 select * into m from public.cms_media where id=p_id for update;
 if not found then return jsonb_build_object('error','File not found.','status',404); end if;
 if m.deleted=2 then return jsonb_build_object('error','Upload is still being processed.','status',409); end if;
 if exists(select 1 from public.cms_state s,jsonb_each_text(s.content) v where v.value=path)
 or exists(select 1 from public.cms_proposals p,jsonb_each_text(p.content) v where not p.used and p.expires>=extract(epoch from now()) and v.value=path)
 then return jsonb_build_object('error','This file is in use or in an active preview.','status',409); end if;
 update public.cms_media set deleted=1 where id=p_id;
 return jsonb_build_object('ok',true);
end;$$;

revoke all on function public.cms_rate(text,integer),public.cms_publish(uuid,uuid),public.cms_reserve_media(uuid,text,integer),public.cms_mark_media_deleted(uuid) from public,anon,authenticated;
grant execute on function public.cms_rate(text,integer),public.cms_publish(uuid,uuid),public.cms_reserve_media(uuid,text,integer),public.cms_mark_media_deleted(uuid) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('restaurant-media','restaurant-media',false,20971520,array['image/jpeg','video/mp4']);

grant usage on schema auth to service_role;
grant select(id,user_id,not_after) on auth.sessions to service_role;
create function public.cms_session_active(p_user uuid,p_session uuid) returns boolean
language sql security invoker set search_path='' as $$
 select exists(select 1 from auth.sessions where id=p_session and user_id=p_user and (not_after is null or not_after>now()));
$$;
revoke all on function public.cms_session_active(uuid,uuid) from public,anon,authenticated;
grant execute on function public.cms_session_active(uuid,uuid) to service_role;
