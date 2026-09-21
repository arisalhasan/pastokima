import {initial,schema,menu,escape,Problem,applyPatch,validateValue,changes,render,parseCommand,interpretAI} from './content.mjs';
import {cleanJPEG,cleanMP4} from './media.mjs';
import dashboard from '../dashboard/index.html';
import privacy from '../dashboard/privacy.html';
const now=()=>Math.floor(Date.now()/1000);
const stmt=(env,sql,...args)=>env.DB.prepare(sql).bind(...args);
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8'}});
async function identity(request,env){
 const id=request.headers.get('oai-authenticated-user-id'),email=request.headers.get('oai-authenticated-user-email');
 const allowed=(env.ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
 if(!id||!email)throw new Problem('Sign in with your authorised account.',401);
 if(!allowed.includes(email.toLowerCase()))throw new Problem('This account is not an authorised restaurant editor.',403);
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(id));
 return {actor:[...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join(''),email};
}
function mutationGuard(request,env){
 if(env.WRITE_ENABLED!=='true')throw new Problem('Editing is temporarily locked by the site administrator.',423);
 if(!env.APP_ORIGIN||request.headers.get('Origin')!==env.APP_ORIGIN||request.headers.get('X-Restaurant-Request')!=='dashboard'||request.headers.get('Sec-Fetch-Site')==='cross-site')throw new Problem('This request did not come from the restaurant dashboard.',403);
}
async function boundedBytes(request,limit){
 if(Number(request.headers.get('Content-Length'))>limit)throw new Problem('File or request is too large.',413);
 const reader=request.body?.getReader();if(!reader)throw new Problem('Missing request body.');const chunks=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new Problem('File or request is too large.',413);}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}return bytes;
}
async function bodyJSON(request){if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw new Problem('JSON request required.',415);try{return JSON.parse(new TextDecoder().decode(await boundedBytes(request,65536)));}catch(e){if(e instanceof Problem)throw e;throw new Problem('Invalid request.');}}
async function rate(env,actor,kind,maximum){
 const window=Math.floor(now()/600),key=actor+':'+kind;
 const row=await stmt(env,'INSERT INTO cms_limits (key,window,count) VALUES (?,?,1) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN window=excluded.window THEN count+1 ELSE 1 END,window=excluded.window RETURNING count',key,window).first();
 if(row.count>maximum)throw new Problem('Too many requests. Please try again in a few minutes.',429);
}
async function readState(env,initialize=false){
 if(initialize){await env.DB.batch([stmt(env,'INSERT OR IGNORE INTO cms_state (id,revision,content,last_op) VALUES (1,0,?,?)',JSON.stringify(initial),'initial'),stmt(env,'INSERT OR IGNORE INTO cms_history (operation,revision,content,actor,created,summary) SELECT ?,0,?,?,?,? FROM cms_state WHERE id=1 AND revision=0','initial',JSON.stringify(initial),'system',now(),'Original restaurant content')]);}
 const row=await stmt(env,'SELECT revision,content FROM cms_state WHERE id=1').first();return row?{revision:row.revision,values:JSON.parse(row.content)}:{revision:0,values:initial};
}
async function cleanup(env){await env.DB.batch([stmt(env,'DELETE FROM cms_proposals WHERE expires < ?',now()),stmt(env,'DELETE FROM cms_limits WHERE window < ?',Math.floor(now()/600)-144),stmt(env,'DELETE FROM cms_history WHERE created < ? AND revision <> (SELECT revision FROM cms_state WHERE id=1)',now()-30*86400)]);}
async function verifyMedia(env,values){
 for(const [key,f] of Object.entries(schema))if(['image','video'].includes(f.type)&&values[key].startsWith('/media/')){
  const row=await stmt(env,'SELECT type FROM cms_media WHERE id=? AND deleted=0',values[key].slice(7)).first();
  if(!row||((f.type==='video')!==(row.type==='video/mp4')))throw new Problem('A selected media file is missing or is the wrong type. Upload it again.',409);
 }
}
async function proposal(env,user,current,next,summary){
 const diff=changes(current.values,next);if(!diff.length)throw new Problem('There are no changes to publish.');await verifyMedia(env,next);
 const id=crypto.randomUUID(),expires=now()+600;
 await stmt(env,'INSERT INTO cms_proposals (id,actor,base,content,summary,expires,used) VALUES (?,?,?,?,?,?,0)',id,user.actor,current.revision,JSON.stringify(next),summary,expires).run();
 return json({id,expires,revision:current.revision,changes:diff,summary});
}
async function publish(env,user,id){
 const p=await stmt(env,'SELECT * FROM cms_proposals WHERE id=? AND actor=?',id,user.actor).first();
 if(!p)throw new Problem('This proposal is unavailable.',404);if(p.used)return json({message:'This change was already published.',alreadyPublished:true});
 if(p.expires<now())throw new Problem('This preview expired. Please prepare the change again.',409);
 const next=JSON.parse(p.content);await verifyMedia(env,next);
 const mediaIDs=[...new Set(Object.values(next).filter(x=>x.startsWith('/media/')).map(x=>x.slice(7)))];
 const mediaCheck=mediaIDs.length?` AND (SELECT count(*) FROM cms_media WHERE deleted=0 AND id IN (${mediaIDs.map(()=>'?').join(',')}))=?`:'';
 const results=await env.DB.batch([
  stmt(env,`UPDATE cms_state SET content=?,revision=revision+1,last_op=? WHERE id=1 AND revision=? AND EXISTS (SELECT 1 FROM cms_proposals WHERE id=? AND actor=? AND used=0 AND expires>=?)${mediaCheck}`,p.content,id,p.base,id,user.actor,now(),...mediaIDs,...(mediaIDs.length?[mediaIDs.length]:[])),
  stmt(env,'INSERT OR IGNORE INTO cms_history (operation,revision,content,actor,created,summary) SELECT ?,revision,content,?,?,? FROM cms_state WHERE id=1 AND last_op=?',id,user.actor,now(),p.summary,id),
  stmt(env,'UPDATE cms_proposals SET used=1 WHERE id=? AND actor=? AND EXISTS (SELECT 1 FROM cms_state WHERE id=1 AND last_op=?)',id,user.actor,id)
 ]);
 if(results[0].meta.changes!==1){const done=await stmt(env,'SELECT operation FROM cms_history WHERE operation=? AND actor=?',id,user.actor).first();if(done)return json({message:'This change was already published.',alreadyPublished:true});throw new Problem('The website changed since this preview. Reload and review your edit again.',409);}
 return json({message:'Published to the prototype.',revision:p.base+1});
}
async function upload(request,env,user){
 await rate(env,user.actor,'upload',10);
 if(request.headers.get('X-Media-Rights')!=='confirmed')throw new Problem('Confirm you have permission to publish this media.');
 const type=request.headers.get('Content-Type');if(!['image/jpeg','video/mp4'].includes(type))throw new Problem('Use a photo or an MP4 video.',415);
 let bytes=await boundedBytes(request,type==='image/jpeg'?5*1024*1024:20*1024*1024);
 bytes=type==='image/jpeg'?cleanJPEG(bytes):cleanMP4(bytes);
 const id=crypto.randomUUID();const reservation=await stmt(env,'INSERT INTO cms_media (id,type,size,created,deleted) SELECT ?,?,?,?,2 WHERE (SELECT COALESCE(sum(size),0) FROM cms_media)+?<=?',id,type,bytes.length,now(),bytes.length,300*1024*1024).run();
 if(reservation.meta.changes!==1)throw new Problem('The media library is full. Remove unused uploads first.',413);
 try{await env.BUCKET.put(id,bytes,{httpMetadata:{contentType:type}});await stmt(env,'UPDATE cms_media SET deleted=0 WHERE id=? AND deleted=2',id).run();}catch(e){await stmt(env,'UPDATE cms_media SET deleted=1 WHERE id=?',id).run();await env.BUCKET.delete(id);throw e;}
 return json({id,url:'/media/'+id,type,size:bytes.length},201);
}
async function removeMedia(env,id){
 if(!/^[a-f0-9-]{36}$/.test(id))throw new Problem('Invalid file.');
 const row=await stmt(env,'SELECT * FROM cms_media WHERE id=?',id).first();if(!row)throw new Problem('File not found.',404);
 if(row.deleted===2)throw new Problem('This file is still uploading. Try again after the upload finishes.',409);
 const path='/media/'+id;
 if(!row.deleted){const res=await stmt(env,'UPDATE cms_media SET deleted=1 WHERE id=? AND NOT EXISTS (SELECT 1 FROM cms_state WHERE instr(content,?)>0) AND NOT EXISTS (SELECT 1 FROM cms_proposals WHERE used=0 AND expires>=? AND instr(content,?)>0)',id,path,now(),path).run();if(res.meta.changes!==1)throw new Problem('This file is still in use or in an unexpired preview. Replace it, cancel the preview, then delete it.',409);}
 await env.BUCKET.delete(id);await stmt(env,'DELETE FROM cms_media WHERE id=? AND deleted=1',id).run();
 return json({message:'Uploaded file permanently deleted. Old versions that used it cannot be restored.'});
}
async function handle(request,env){
 const url=new URL(request.url),path=url.pathname;
 if(path==='/privacy/')return new Response(privacy,{headers:{'Content-Type':'text/html; charset=utf-8'}});
 if(path.startsWith('/admin')||path.startsWith('/api/admin/')){
  let user;try{user=await identity(request,env);}catch(e){if(path==='/admin/'&&e.status===401)return new Response('<!doctype html><html lang="en"><title>Owner sign-in</title><h1>Restaurant owner dashboard</h1><p>Sign in with an authorised account.</p><a href="/signin-with-chatgpt?return_to=%2Fadmin%2F" target="_top">Sign in with ChatGPT</a></html>',{status:401,headers:{'Content-Type':'text/html'}});throw e;}
  if(path==='/admin'||path==='/admin/')return new Response(dashboard,{headers:{'Content-Type':'text/html; charset=utf-8'}});
  if(!env.DB||!env.BUCKET)throw new Problem('Dashboard storage is unavailable. Please try again later.',503);
  if(path==='/admin/preview/'&&request.method==='GET'){
   const p=await stmt(env,'SELECT content FROM cms_proposals WHERE id=? AND actor=? AND expires>=? AND used=0',url.searchParams.get('id'),user.actor,now()).first();if(!p)throw new Problem('Preview expired or unavailable.',404);
   const route=url.searchParams.get('page')||'/';const body=render(route,JSON.parse(p.content));if(!body)throw new Problem('Unknown page.',404);
   return new Response(body.replace('<body>','<body><div class="preview-banner">Unpublished preview · <a href="/admin/">Return to dashboard</a></div>'),{headers:{'Content-Type':'text/html; charset=utf-8'}});
  }
  if(request.method==='GET'){
   if(path==='/api/admin/state'){const state=await readState(env,true);await cleanup(env);return json({...state,schema,menu,email:user.email,writeEnabled:env.WRITE_ENABLED==='true',aiEnabled:env.AI_ENABLED==='true'&&env.AI_PRIVACY_APPROVED==='true'&&!!env.OPENAI_API_KEY&&!!env.OPENAI_MODEL});}
   if(path==='/api/admin/history')return json((await stmt(env,'SELECT id,revision,created,summary FROM cms_history ORDER BY revision DESC LIMIT 50').all()).results);
   if(path==='/api/admin/media')return json((await stmt(env,'SELECT id,type,size,created,deleted FROM cms_media WHERE deleted<>2 ORDER BY created DESC LIMIT 100').all()).results);
   if(path==='/api/admin/export'){const state=await readState(env);const history=(await stmt(env,'SELECT revision,created,summary,content FROM cms_history ORDER BY revision DESC LIMIT 50').all()).results;const media=(await stmt(env,'SELECT id,type,size,created FROM cms_media WHERE deleted=0').all()).results;return json({exportedAt:new Date().toISOString(),...state,history,media});}
   throw new Problem('Not found.',404);
  }
  if(request.method!=='POST')throw new Problem('Method not allowed.',405);
  mutationGuard(request,env);await rate(env,user.actor,'writes',120);await readState(env,true);
  if(path==='/api/admin/upload')return upload(request,env,user);
  const body=await bodyJSON(request);
  if(path==='/api/admin/propose'){
   const current=await readState(env);if(body.revision!==current.revision)throw new Problem('The website changed. Reload before editing.',409);
   const next=applyPatch(current.values,body.patch);const diff=changes(current.values,next);return proposal(env,user,current,next,diff.length===1?'Update '+diff[0].label:`Update ${diff.length} restaurant fields`);
  }
  if(path==='/api/admin/assistant'){
   await rate(env,user.actor,'assistant',20);if(typeof body.message!=='string'||body.message.length>1200)throw new Problem('Keep requests under 1,200 characters.');
   const current=await readState(env);if(body.revision!==current.revision)throw new Problem('Reload to use the latest website content.',409);
   const result=body.mode==='ai'?await interpretAI(body.message,env):parseCommand(body.message,current.values);
   if(!result.patch)return json({message:result.message});
   return proposal(env,user,current,applyPatch(current.values,result.patch),'Assistant-prepared restaurant update');
  }
  if(path==='/api/admin/publish'){if(body.confirm!==true||typeof body.id!=='string')throw new Problem('Explicit confirmation is required.');return publish(env,user,body.id);}
  if(path==='/api/admin/cancel'){await stmt(env,'DELETE FROM cms_proposals WHERE id=? AND actor=? AND used=0',body.id,user.actor).run();return json({message:'Preview cancelled.'});}
  if(path==='/api/admin/restore'){
   const row=await stmt(env,'SELECT content,revision FROM cms_history WHERE id=?',body.id).first();if(!row)throw new Problem('Saved version is no longer available.',404);
   const current=await readState(env);if(body.revision!==current.revision)throw new Problem('Reload before restoring.',409);
   const next=JSON.parse(row.content);for(const key of Object.keys(schema))next[key]=validateValue(key,next[key]);return proposal(env,user,current,next,'Restore content revision '+row.revision);
  }
  if(path==='/api/admin/delete-media'){if(body.confirm!==true)throw new Problem('Confirm permanent deletion.');return removeMedia(env,body.id);}
  throw new Problem('Not found.',404);
 }
 if(path.startsWith('/media/')){
  const id=path.slice(7);if(!/^[a-f0-9-]{36}$/.test(id))throw new Problem('File not found.',404);
  const current=await readState(env);if(!Object.values(current.values).includes(path))await identity(request,env);
  const row=await stmt(env,'SELECT type FROM cms_media WHERE id=? AND deleted=0',id).first();if(!row)throw new Problem('File not found.',404);
  const requestedRange=request.headers.get('Range');if(requestedRange&&!/^bytes=(?:\d+-\d*|-\d+)$/.test(requestedRange))throw new Problem('Unsupported byte range.',416);
  const object=await env.BUCKET.get(id,requestedRange?{range:request.headers}:undefined);if(!object)throw new Problem('File not found.',404);
  const headers=new Headers({'Content-Type':row.type,'Accept-Ranges':'bytes','Content-Disposition':'inline'});let status=200;
  if(requestedRange&&object.range){status=206;headers.set('Content-Range',`bytes ${object.range.offset}-${object.range.offset+object.range.length-1}/${object.size}`);headers.set('Content-Length',String(object.range.length));}else headers.set('Content-Length',String(object.size));
  return new Response(request.method==='HEAD'?null:object.body,{status,headers});
 }
 if(request.method!=='GET'&&request.method!=='HEAD')throw new Problem('Method not allowed.',405);
 const route=path==='/'?'/':path.replace(/\/$/,'')+'/';
 if(['/', '/menu/','/greek-night/','/gallery/','/contact/'].includes(route)){
  const current=await readState(env);return new Response(request.method==='HEAD'?null:render(route,current.values),{headers:{'Content-Type':'text/html; charset=utf-8'}});
 }
 if(env.ASSETS)return env.ASSETS.fetch(request);throw new Problem('Page not found.',404);
}
export default {async fetch(request,env){
 let response;try{response=await handle(request,env);}catch(error){if(!(error instanceof Problem))console.error('Restaurant request failed:',error?.name||'Error');response=json({error:error instanceof Problem?error.message:'The service is temporarily unavailable. Your changes have not been confirmed. Please reload to check before retrying.'},error instanceof Problem?error.status:503);}
 const out=new Response(response.body,response);out.headers.set('Cache-Control','private, no-store');out.headers.set('X-Content-Type-Options','nosniff');out.headers.set('Referrer-Policy','no-referrer');out.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');out.headers.set('X-Robots-Tag','noindex, nofollow');out.headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; media-src 'self' blob:; connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com");return out;
}};
