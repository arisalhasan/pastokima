import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandler,verifiedOwner} from '../server/supabase-handler.mjs';
const actor='aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',session='bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
const jwt=claims=>'header.'+Buffer.from(JSON.stringify({sub:actor,session_id:session,aal:'aal2',...claims})).toString('base64url')+'.signature';
function database({valid=true,owner=true,active=true,confirmed=true}={}){
 return {auth:{getUser:async token=>valid?{data:{user:{id:actor,email:'owner@example.com',email_confirmed_at:confirmed?'2026-09-21':null}}}:{error:{message:'invalid'},data:{user:null}}},from:()=>({select(){return this;},eq(){return this;},async maybeSingle(){return {data:owner?{email:'owner@example.com'}:null};}}),rpc:async()=>({data:active})};
}
const request=(headers={})=>new Request('https://backend.example/admin/state',{headers});
test('Sites identity headers cannot authenticate the migrated dashboard',async()=>{
 await assert.rejects(verifiedOwner(request({'oai-authenticated-user-id':actor,'oai-authenticated-user-email':'owner@example.com'}),database()),e=>e.status===401);
});
test('forged JWT is rejected before its claims are used',async()=>{
 await assert.rejects(verifiedOwner(request({Authorization:'Bearer '+jwt({})}),database({valid:false})),e=>e.status===401);
});
test('verified accounts still require a confirmed email and owner membership',async()=>{
 for(const [opts,status] of [[{confirmed:false},401],[{owner:false},403]])await assert.rejects(verifiedOwner(request({Authorization:'Bearer '+jwt({})}),database(opts)),e=>e.status===status);
});
test('password-only sessions cannot read or edit restaurant content',async()=>{
 await assert.rejects(verifiedOwner(request({Authorization:'Bearer '+jwt({aal:'aal1'})}),database()),e=>e.status===403);
});
test('revoked sessions are rejected even if the access token has not expired',async()=>{
 await assert.rejects(verifiedOwner(request({Authorization:'Bearer '+jwt({})}),database({active:false})),e=>e.status===401);
});
test('an active verified owner with MFA is accepted',async()=>{
 assert.deepEqual(await verifiedOwner(request({Authorization:'Bearer '+jwt({})}),database()),{actor,email:'owner@example.com'});
});
test('malicious origins and unsupported methods cannot mutate',async()=>{
 const handler=createHandler(database(),{allowedOrigins:['https://restaurant.example']});
 for(const origin of ['https://evil.example','null']){
  const response=await handler(new Request('https://backend.example/admin/publish',{method:'POST',headers:{Authorization:'Bearer '+jwt({}),Origin:origin,'X-Restaurant-Request':'dashboard','Content-Type':'application/json'},body:'{}'}));
  assert.equal(response.status,403);assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);
 }
 const preflight=await handler(new Request('https://backend.example/admin/publish',{method:'OPTIONS',headers:{Origin:'https://evil.example'}}));assert.equal(preflight.status,403);
});
test('private media cannot be downloaded through the public endpoint',async()=>{
 const db={from:()=>({select(){return this;},eq(){return this;},async single(){return {data:{revision:0,content:{}}};}})};
 const response=await createHandler(db)(new Request('https://backend.example/public/media/'+actor));assert.equal(response.status,404);
});
