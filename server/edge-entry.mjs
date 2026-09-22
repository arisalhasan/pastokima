import {createClient} from '@supabase/supabase-js';
import {createHandler} from './supabase-handler.mjs';
const url=Deno.env.get('SUPABASE_URL');
const db=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
const extra=(Deno.env.get('PASTOKIMA_PREVIEW_ORIGINS')||'').split(',').filter(Boolean);
const handler=createHandler(db,{
 allowedOrigins:['https://pastokima.com','https://www.pastokima.com','https://pastokima-git-codex-supabase-migration-aris-projects-bdd80841.vercel.app','http://localhost:4173',...extra],
 siteOrigin:Deno.env.get('PASTOKIMA_SITE_ORIGIN')||'https://pastokima.com',
 functionBase:url+'/functions/v1/pastokima-cms',
 writesEnabled:Deno.env.get('PASTOKIMA_WRITE_ENABLED')!=='false'
});
Deno.serve(handler);
