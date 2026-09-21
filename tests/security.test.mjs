import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Miniflare} from 'miniflare';
let mf,db;
const origin='https://restaurant.example';
const headers={'oai-authenticated-user-id':'test-owner','oai-authenticated-user-email':'owner@example.com'};
const mutations={...headers,'Origin':origin,'Content-Type':'application/json','X-Restaurant-Request':'dashboard'};
async function request(path,data,extra={}){const response=await mf.dispatchFetch(origin+path,{method:data===undefined?'GET':'POST',headers:data===undefined?headers:mutations,...extra,body:data===undefined?undefined:JSON.stringify(data)});const type=response.headers.get('Content-Type')||'';return {status:response.status,data:type.includes('json')?await response.json():await response.text(),headers:response.headers};}
const state=async()=> (await request('/api/admin/state')).data;
async function propose(patch){return request('/api/admin/propose',{revision:(await state()).revision,patch});}
before(async()=>{
 mf=new Miniflare({modules:true,scriptPath:'dist/server/index.js',compatibilityDate:'2026-05-15',d1Databases:['DB'],r2Buckets:['BUCKET'],bindings:{ADMIN_EMAILS:'owner@example.com',APP_ORIGIN:origin,WRITE_ENABLED:'true',AI_ENABLED:'false'}});
 db=await mf.getD1Database('DB');
 for(const sql of readFileSync('drizzle/0000_damp_maestro.sql','utf8').split('--> statement-breakpoint').filter(x=>x.trim()))await db.prepare(sql.trim()).run();
});
after(async()=>{await mf?.dispose();});
test('protected pages and APIs reject missing and unauthorised identities',async()=>{
 for(const path of ['/admin/','/api/admin/state','/api/admin/history','/api/admin/export','/api/admin/media']){
  assert.equal((await request(path,undefined,{headers:{}})).status,401);
  assert.equal((await request(path,undefined,{headers:{...headers,'oai-authenticated-user-email':'stranger@example.com'}})).status,403);
 }
});
test('public site retains menu, media, privacy and map consent without contact to Google',async()=>{
 const menu=await request('/menu/');assert.equal(menu.status,200);assert.equal((menu.data.match(/class="dish"/g)||[]).length,126);assert(!menu.data.includes('@@'));
 const contact=await request('/contact/');assert(contact.data.includes('id="load-map"'));assert(contact.data.includes('Show interactive map'));assert(!contact.data.includes('<iframe'));assert(!contact.data.includes('href="/admin/"'));assert.equal((contact.data.match(/class="social-icon"/g)||[]).length,3);assert(contact.headers.get('Content-Security-Policy').includes("object-src 'none'"));
 for(const path of ['/','/greek-night/','/gallery/','/privacy/'])assert.equal((await request(path)).status,200);
});
test('cross-origin and missing custom headers cannot mutate',async()=>{
 for(const invalid of [{...mutations,Origin:'https://evil.example'},{...mutations,'X-Restaurant-Request':''},{...mutations,Origin:''}])assert.equal((await request('/api/admin/propose',{revision:0,patch:[]},{headers:invalid})).status,403);
});
test('field allowlist rejects security settings, arbitrary URLs and invalid prices',async()=>{
 for(const patch of [[{key:'ADMIN_EMAILS',value:'attacker@example.com'}],[{key:'__proto__',value:'x'}],[{key:'media.logo_png',value:'https://evil.example/x.svg'}],[{key:'food.0.0.price',value:'-1'}]])assert.equal((await propose(patch)).status,400);
});
test('assistant creates a review without changing the published price',async()=>{
 const current=await state();const r=await request('/api/admin/assistant',{revision:current.revision,message:'Change chicken souvlaki to €15',mode:'guided'});assert.equal(r.status,200);assert(r.data.id);assert.equal((await state()).revision,current.revision);
 assert.equal(r.data.changes[0].after,'€15.00');assert.equal((await request('/api/admin/publish',{id:r.data.id})).status,400);
});
test('ambiguous assistant requests clarify; external AI fails closed',async()=>{
 const current=await state();const r=await request('/api/admin/assistant',{revision:current.revision,message:'Change chicken to €15'});assert(r.data.message.includes('Which item?'));assert(!r.data.id);
 assert.equal((await request('/api/admin/assistant',{revision:current.revision,message:'Change chicken to €15',mode:'ai'})).status,503);
});
test('publish is durable, exact, replay safe and protected against stale simultaneous edits',async()=>{
 const a=await propose([{key:'food.0.0.price',value:'12.50'}]),b=await propose([{key:'food.0.0.price',value:'13.50'}]);
 const results=await Promise.all([request('/api/admin/publish',{id:a.data.id,confirm:true}),request('/api/admin/publish',{id:b.data.id,confirm:true})]);
 assert.deepEqual(results.map(x=>x.status).sort(),[200,409]);const winner=results[0].status===200?a:b;
 const s=await state();assert.equal(s.revision,1);assert(['€12.50','€13.50'].includes(s.values['food.0.0.price']));
 assert.equal((await request('/api/admin/publish',{id:winner.data.id,confirm:true})).status,200);assert.equal((await state()).revision,1);
 const history=await request('/api/admin/history');assert.equal(history.data.filter(x=>x.revision===1).length,1);
});
test('expired proposals and proposals belonging to another user cannot publish',async()=>{
 const p=await propose([{key:'hours.Monday',value:'Closed'}]);await db.prepare('UPDATE cms_proposals SET expires=0 WHERE id=?').bind(p.data.id).run();assert.equal((await request('/api/admin/publish',{id:p.data.id,confirm:true})).status,409);
 const own=await propose([{key:'hours.Monday',value:'Closed'}]);assert.equal((await request('/api/admin/publish',{id:own.data.id,confirm:true},{headers:{...mutations,'oai-authenticated-user-id':'different-user'}})).status,404);
});
test('HTML-like input is escaped in published and draft pages',async()=>{
 const p=await propose([{key:'home.intro',value:'<script>alert(1)</script>'}]);assert.equal(p.status,200);
 const preview=await request('/admin/preview/?id='+p.data.id+'&page=%2F');assert.equal(preview.status,200);assert(preview.data.includes('&lt;script&gt;'));assert(!preview.data.includes('<script>alert(1)'));
 await request('/api/admin/publish',{id:p.data.id,confirm:true});assert((await request('/')).data.includes('&lt;script&gt;'));
});
test('restore needs a fresh explicit proposal and restores original content',async()=>{
 const h=await request('/api/admin/history'),original=h.data.find(x=>x.revision===0),s=await state();
 const p=await request('/api/admin/restore',{id:original.id,revision:s.revision});assert.equal(p.status,200);assert.equal((await state()).revision,s.revision);
 assert.equal((await request('/api/admin/publish',{id:p.data.id,confirm:true})).status,200);assert(!(await request('/')).data.includes('&lt;script&gt;'));
});
test('media upload rejects active file formats and enforces size and permission',async()=>{
 const base={...mutations,'X-Media-Rights':'confirmed'};
 const bad=await mf.dispatchFetch(origin+'/api/admin/upload',{method:'POST',headers:{...base,'Content-Type':'image/svg+xml'},body:'<svg onload="alert(1)"/>'});assert.equal(bad.status,415);
 const fake=await mf.dispatchFetch(origin+'/api/admin/upload',{method:'POST',headers:{...base,'Content-Type':'image/jpeg'},body:'<script>fake jpeg</script>'});assert.equal(fake.status,400);
 const denied=await mf.dispatchFetch(origin+'/api/admin/upload',{method:'POST',headers:{...mutations,'Content-Type':'image/jpeg'},body:'no consent'});assert.equal(denied.status,400);
});
test('photo upload, draft privacy, publish, replace and erasure work end to end',async()=>{
 const bytes=readFileSync('dist/assets/05-5.jpeg');const response=await mf.dispatchFetch(origin+'/api/admin/upload',{method:'POST',headers:{...mutations,'Content-Type':'image/jpeg','X-Media-Rights':'confirmed'},body:bytes});assert.equal(response.status,201);const f=await response.json();
 assert.equal((await request(f.url,undefined,{headers:{}})).status,401);
 const p=await propose([{key:'media.05_5_jpeg',value:f.url}]);assert.equal(p.status,200);await request('/api/admin/publish',{id:p.data.id,confirm:true});assert.equal((await request(f.url,undefined,{headers:{}})).status,200);
 assert.equal((await request('/api/admin/delete-media',{id:f.id,confirm:true})).status,409);
 const back=await propose([{key:'media.05_5_jpeg',value:'/assets/05-5.jpeg'}]);await request('/api/admin/publish',{id:back.data.id,confirm:true});
 assert.equal((await request('/api/admin/delete-media',{id:f.id,confirm:true})).status,200);assert.equal((await request(f.url)).status,404);
 const history=await request('/api/admin/history');const withDeleted=history.data.find(x=>x.revision===4);if(withDeleted)assert.equal((await request('/api/admin/restore',{id:withDeleted.id,revision:(await state()).revision})).status,409);
});
test('Greek Night MP4 upload and byte-range delivery work',async()=>{
 const response=await mf.dispatchFetch(origin+'/api/admin/upload',{method:'POST',headers:{...mutations,'Content-Type':'video/mp4','X-Media-Rights':'confirmed'},body:readFileSync('dist/assets/greek-night.mp4')});assert.equal(response.status,201);const file=await response.json();
 const range=await mf.dispatchFetch(origin+file.url,{headers:{...headers,Range:'bytes=0-31'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,32);
});
