import {createClient} from '@supabase/supabase-js';
import config from '../site-config.json';
export const auth=createClient(config.supabaseURL,config.publishableKey);
export const apiBase=config.supabaseURL+'/functions/v1/'+config.functionName;
export async function apiRequest(path,data,options={}){
 const {data:{session}}=await auth.auth.getSession();
 if(!session)throw new Error('Please sign in.');
 const response=await fetch(apiBase+'/admin/'+path,{method:data===undefined?'GET':'POST',cache:'no-store',headers:{Authorization:'Bearer '+session.access_token,apikey:config.publishableKey,...(data===undefined?{}:{'Content-Type':'application/json','X-Restaurant-Request':'dashboard',...options.headers})},body:data===undefined?undefined:options.raw?data:JSON.stringify(data)});
 const result=await response.json();if(!response.ok)throw new Error(result.error||'Request failed.');return result;
}
export async function startOwner(){
 const host=document.createElement('main');host.className='auth-card';host.innerHTML='<a href="/">Pas To Kima</a><h1>Owner sign-in</h1><p>Use your authorised restaurant account.</p><form id="owner-login"><label>Email<input name="email" type="email" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button type="submit">Sign in</button></form><div id="mfa-panel" hidden><h2>Two-factor verification</h2><p id="mfa-help"></p><div id="mfa-qr"></div><form id="mfa-form"><label>Authenticator code<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required></label><button type="submit">Verify</button></form></div><p id="auth-message" role="status"></p>';
 const shell=[...document.body.children].filter(x=>x.tagName!=='SCRIPT');shell.forEach(x=>x.hidden=true);document.body.prepend(host);
 const message=host.querySelector('#auth-message');let factor;
 const reset=document.createElement('button');reset.type='button';reset.textContent='Use a different account';reset.hidden=true;
 reset.onclick=async()=>{const {error}=await auth.auth.signOut({scope:'local'});if(error){message.textContent=error.message;return;}location.reload();};host.append(reset);
 async function ready(){
  const {data:{session}}=await auth.auth.getSession();if(!session)return;reset.hidden=false;
  const {data,error}=await auth.auth.mfa.getAuthenticatorAssuranceLevel();if(error)throw error;
  if(data.currentLevel==='aal2'){
   await apiRequest('state');host.remove();shell.forEach(x=>x.hidden=false);
   const logout=document.createElement('button');logout.textContent='Sign out';logout.className='secondary';logout.onclick=async()=>{await auth.auth.signOut();location.reload();};document.querySelector('#account-line').after(logout);
   await import('./dashboard.js');return;
  }
  host.querySelector('#owner-login').hidden=true;host.querySelector('#mfa-panel').hidden=false;
  const factors=await auth.auth.mfa.listFactors();if(factors.error)throw factors.error;
  factor=factors.data.totp.find(x=>x.status==='verified')?.id;
  if(!factor){
   for(const item of factors.data.all.filter(x=>x.status==='unverified'))await auth.auth.mfa.unenroll({factorId:item.id});
   const enrolled=await auth.auth.mfa.enroll({factorType:'totp',friendlyName:'Pastokima owner'});if(enrolled.error)throw enrolled.error;factor=enrolled.data.id;
   const image=document.createElement('img');image.alt='Scan with your authenticator app';image.src=enrolled.data.totp.qr_code;host.querySelector('#mfa-qr').replaceChildren(image);
   host.querySelector('#mfa-help').textContent='Scan this code with your authenticator app, then enter the six-digit code. Keep access to that app for future sign-ins.';
  }else host.querySelector('#mfa-help').textContent='Enter the six-digit code from your authenticator app.';
 }
 host.querySelector('#owner-login').onsubmit=async e=>{e.preventDefault();e.submitter.disabled=true;message.textContent='Signing in…';try{const values=new FormData(e.target);const {error}=await auth.auth.signInWithPassword({email:values.get('email'),password:values.get('password')});if(error)throw error;message.textContent='';await ready();}catch(error){message.textContent=error.message;}finally{e.submitter.disabled=false;}};
 host.querySelector('#mfa-form').onsubmit=async e=>{e.preventDefault();e.submitter.disabled=true;try{const {error}=await auth.auth.mfa.challengeAndVerify({factorId:factor,code:new FormData(e.target).get('code')});if(error)throw error;await ready();}catch(error){message.textContent=error.message;}finally{e.submitter.disabled=false;}};
 await ready().catch(error=>message.textContent=error.message);
}
startOwner();
