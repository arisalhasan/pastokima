import {initial,schema,menu,Problem,applyPatch,validateValue,changes,render,parseCommand} from './content.mjs';
import {cleanJPEG,cleanMP4} from './media.mjs';

const now=()=>Math.floor(Date.now()/1000);
const uuid=s=>typeof s==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
const checked=async query=>{const {data,error}=await query;if(error)throw new Error('Database operation failed');return data;};
const rpc=async(db,name,args)=>{const data=await checked(db.rpc(name,args));if(data?.error)throw new Problem(data.error,data.status||409);return data;};
async function bytes(request,limit){
 if(Number(request.headers.get('Content-Length'))>limit)throw new Problem('File is too large.',413);
 const reader=request.body?.getReader();if(!reader)throw new Problem('Missing request body.');
 const parts=[];let length=0;
 for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>limit){await reader.cancel();throw new Problem('File is too large.',413);}parts.push(value);}
 const result=new Uint8Array(length);let offset=0;for(const part of parts){result.set(part,offset);offset+=part.length;}return result;
}
async function bodyJSON(request){
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw new Problem('JSON required.',415);
 try{return JSON.parse(new TextDecoder().decode(await bytes(request,65536)));}catch(e){if(e instanceof Problem)throw e;throw new Problem('Invalid JSON.');}
}
export async function verifiedOwner(request,db){
 const authorization=request.headers.get('Authorization')||'';
 if(!authorization.startsWith('Bearer '))throw new Problem('Please sign in.',401);
 const token=authorization.slice(7);
 const {data,error}=await db.auth.getUser(token);
 if(error||!data?.user?.email_confirmed_at||!data.user.email)throw new Problem('Please sign in with a verified email.',401);
 const owner=await checked(db.from('cms_owners').select('email').eq('email',data.user.email.toLowerCase()).eq('enabled',true).maybeSingle());
 if(!owner)throw new Problem('This account has no restaurant editing access.',403);
 // Claims are inspected only after the exact token has been verified by Auth.
 let claims;try{claims=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{throw new Problem('Invalid session.',401);}
 if(claims.sub!==data.user.id||!uuid(claims.session_id))throw new Problem('Invalid session.',401);
 if(claims.aal!=='aal2')throw new Problem('Complete two-factor sign-in.',403);
 const session=await rpc(db,'cms_session_active',{p_user:data.user.id,p_session:claims.session_id});
 if(!session)throw new Problem('Your session has ended. Sign in again.',401);
 return {actor:data.user.id,email:data.user.email};
}
async function state(db){const row=await checked(db.from('cms_state').select('revision,content').eq('id',1).single());return {revision:row.revision,values:row.content};}
async function rate(db,user,kind,max){if(!await rpc(db,'cms_rate',{p_key:user.actor+':'+kind,p_max:max}))throw new Problem('Too many requests. Try again in a few minutes.',429);}
async function verifyMedia(db,values){
 const ids=[...new Set(Object.values(values).filter(v=>typeof v==='string'&&v.startsWith('/media/')).map(v=>v.slice(7)))];
 if(!ids.length)return;
 const rows=await checked(db.from('cms_media').select('id,type').in('id',ids).eq('deleted',0));
 for(const [key,f] of Object.entries(schema))if(['image','video'].includes(f.type)&&values[key].startsWith('/media/')){
  const row=rows.find(r=>r.id===values[key].slice(7));if(!row||(f.type==='video')!==(row.type==='video/mp4'))throw new Problem('Selected media is unavailable or the wrong type.',409);
 }
}
async function propose(db,user,current,next,summary){
 const diff=changes(current.values,next);if(!diff.length)throw new Problem('There are no changes to publish.');await verifyMedia(db,next);
 const id=crypto.randomUUID(),expires=now()+600;
 await checked(db.from('cms_proposals').insert({id,actor:user.actor,base:current.revision,content:next,summary,expires}));
 return {id,expires,revision:current.revision,changes:diff,summary};
}
async function signedMedia(db,id){
 const {data,error}=await db.storage.from('restaurant-media').createSignedUrl(id,120);
 if(error)throw new Problem('File unavailable.',404);return data.signedUrl;
}
async function mediaURLs(db,values){
 const result={...values};for(const [key,value] of Object.entries(result))if(typeof value==='string'&&value.startsWith('/media/'))result[key]=await signedMedia(db,value.slice(7));return result;
}
export function createHandler(db,{allowedOrigins=[],siteOrigin='https://pastokima.com',functionBase='',writesEnabled=true}={}){
 return async request=>{
  const origin=request.headers.get('Origin'),allowed=allowedOrigins.includes(origin);
  let response;
  try{
   const path=new URL(request.url).pathname.replace(/^(?:\/functions\/v1)?\/pastokima-cms(?=\/|$)/,'');
   if(request.method==='OPTIONS'){
    if(!allowed)throw new Problem('Origin not allowed.',403);
    response=new Response(null,{status:204});
   }else if(path==='/public/state'&&request.method==='GET'){
    response=json(await state(db));
   }else if(path.startsWith('/public/media/')&&['GET','HEAD'].includes(request.method)){
    const id=path.slice('/public/media/'.length);if(!uuid(id))throw new Problem('File not found.',404);
    const current=await state(db);if(!Object.values(current.values).includes('/media/'+id))throw new Problem('File not found.',404);
    const row=await checked(db.from('cms_media').select('id').eq('id',id).eq('deleted',0).maybeSingle());if(!row)throw new Problem('File not found.',404);
    response=Response.redirect(await signedMedia(db,id),302);
   }else if(path.startsWith('/admin/')){
    const user=await verifiedOwner(request,db);
    if(!['GET','POST'].includes(request.method))throw new Problem('Method not allowed.',405);
    if(request.method==='POST'){
     if(!writesEnabled)throw new Problem('Editing is temporarily locked.',423);
     if(!allowed||request.headers.get('X-Restaurant-Request')!=='dashboard')throw new Problem('Use the restaurant dashboard.',403);
     await rate(db,user,'writes',120);
    }
    if(path==='/admin/state'&&request.method==='GET'){
     await checked(db.from('cms_proposals').delete().lt('expires',now()));
     await checked(db.from('cms_limits').delete().lt('bucket',Math.floor(now()/600)-144));
     const current=await state(db);
     await checked(db.from('cms_history').delete().lt('created',now()-30*86400).neq('revision',current.revision));
     response=json({...current,schema,menu,email:user.email,writeEnabled:writesEnabled,aiEnabled:false,mediaBase:functionBase+'/public/media/'});
    }else if(path==='/admin/history'&&request.method==='GET'){
     response=json(await checked(db.from('cms_history').select('id,revision,created,summary').order('revision',{ascending:false}).limit(50)));
    }else if(path==='/admin/media'&&request.method==='GET'){
     const rows=await checked(db.from('cms_media').select('id,type,size,created,deleted').neq('deleted',2).order('created',{ascending:false}).limit(100));
     response=json(await Promise.all(rows.map(async row=>({...row,previewURL:row.deleted?null:await signedMedia(db,row.id)}))));
    }else if(path==='/admin/export'&&request.method==='GET'){
     response=json({exportedAt:new Date().toISOString(),...await state(db),history:await checked(db.from('cms_history').select('revision,created,summary,content').order('revision',{ascending:false}).limit(50)),media:await checked(db.from('cms_media').select('id,type,size,created').eq('deleted',0))});
    }else if(path==='/admin/preview'&&request.method==='POST'){
     const body=await bodyJSON(request);if(!uuid(body.id))throw new Problem('Invalid preview.');
     const p=await checked(db.from('cms_proposals').select('content').eq('id',body.id).eq('actor',user.actor).eq('used',false).gte('expires',now()).maybeSingle());
     if(!p)throw new Problem('Preview expired or unavailable.',404);
     const html=render(body.page||'/',await mediaURLs(db,p.content));if(!html)throw new Problem('Unknown page.',404);
     response=json({html:html.replace('<head>','<head><base href="'+(allowed?origin:siteOrigin)+'/">').replace('<body>','<body><div class="preview-banner">Unpublished preview</div>')});
    }else if(path==='/admin/upload'&&request.method==='POST'){
     await rate(db,user,'upload',10);
     if(request.headers.get('X-Media-Rights')!=='confirmed')throw new Problem('Confirm media publishing rights.');
     const type=request.headers.get('Content-Type');if(!['image/jpeg','video/mp4'].includes(type))throw new Problem('Use a JPEG photo or MP4 video.',415);
     let data=await bytes(request,type==='image/jpeg'?5*1024*1024:20*1024*1024);data=type==='image/jpeg'?cleanJPEG(data):cleanMP4(data);
     const id=crypto.randomUUID();if(!await rpc(db,'cms_reserve_media',{p_id:id,p_type:type,p_size:data.length}))throw new Problem('Media library is full. Remove unused uploads.',413);
     try{
      const {error}=await db.storage.from('restaurant-media').upload(id,data,{contentType:type,upsert:false});if(error)throw new Error('Upload failed');
      await checked(db.from('cms_media').update({deleted:0}).eq('id',id).eq('deleted',2));
     }catch(e){await db.from('cms_media').update({deleted:1}).eq('id',id);await db.storage.from('restaurant-media').remove([id]);throw e;}
     response=json({id,url:'/media/'+id,type,size:data.length,previewURL:await signedMedia(db,id)},201);
    }else if(request.method==='POST'){
     const body=await bodyJSON(request);
     if(path==='/admin/publish'){
      if(body.confirm!==true||!uuid(body.id))throw new Problem('Explicit confirmation is required.');
      response=json(await rpc(db,'cms_publish',{p_id:body.id,p_actor:user.actor}));
     }else if(path==='/admin/cancel'){
      if(!uuid(body.id))throw new Problem('Invalid preview.');await checked(db.from('cms_proposals').delete().eq('id',body.id).eq('actor',user.actor).eq('used',false));response=json({message:'Preview cancelled.'});
     }else if(path==='/admin/delete-media'){
      if(body.confirm!==true||!uuid(body.id))throw new Problem('Confirm permanent deletion.');
      await rpc(db,'cms_mark_media_deleted',{p_id:body.id});const {error}=await db.storage.from('restaurant-media').remove([body.id]);if(error)throw new Error('Storage delete failed');
      await checked(db.from('cms_media').delete().eq('id',body.id).eq('deleted',1));response=json({message:'Unused upload permanently deleted.'});
     }else{
      const current=await state(db);if(body.revision!==current.revision)throw new Problem('The website changed. Reload before editing.',409);
      if(path==='/admin/propose')response=json(await propose(db,user,current,applyPatch(current.values,body.patch),'Update restaurant content'));
      else if(path==='/admin/assistant'){
       await rate(db,user,'assistant',20);if(typeof body.message!=='string'||body.message.length>1200)throw new Problem('Keep requests under 1,200 characters.');
       if(body.mode==='ai')throw new Problem('External AI is not enabled. Use guided commands.',503);
       const result=parseCommand(body.message,current.values);response=json(result.patch?await propose(db,user,current,applyPatch(current.values,result.patch),'Assistant-prepared restaurant update'):result);
      }else if(path==='/admin/restore'){
       if(!Number.isSafeInteger(body.id))throw new Problem('Invalid saved version.');
       const row=await checked(db.from('cms_history').select('revision,content').eq('id',body.id).maybeSingle());if(!row)throw new Problem('Saved version unavailable.',404);
       const next={};for(const key of Object.keys(schema)){validateValue(key,row.content[key]);next[key]=row.content[key];}response=json(await propose(db,user,current,next,'Restore content revision '+row.revision));
      }else throw new Problem('Not found.',404);
     }
    }else throw new Problem('Not found.',404);
   }else throw new Problem('Not found.',404);
  }catch(error){response=json({error:error instanceof Problem?error.message:'Service temporarily unavailable. Reload before retrying.'},error instanceof Problem?error.status:503);}
  const result=new Response(response.body,response);
  result.headers.set('Cache-Control','private, no-store');result.headers.set('X-Content-Type-Options','nosniff');result.headers.set('Vary','Origin');
  if(allowed){result.headers.set('Access-Control-Allow-Origin',origin);result.headers.set('Access-Control-Allow-Methods','GET,POST,OPTIONS');result.headers.set('Access-Control-Allow-Headers','authorization,apikey,content-type,x-restaurant-request,x-media-rights');}
  return result;
 };
}
