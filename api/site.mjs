import {render} from '../server/content.mjs';
import config from '../site-config.json' with {type:'json'};
export default async function handler(req,res){
 const url=new URL(req.url,'https://pastokima.com');
 const route=url.searchParams.get('route')||url.pathname;
 if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;res.end();return;}
 const base=config.supabaseURL+'/functions/v1/'+config.functionName;
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 if(route.startsWith('/media/')){
  const id=route.slice(7);if(!/^[a-f0-9-]{36}$/.test(id)){res.statusCode=404;res.end();return;}
  res.setHeader('Cache-Control','no-store');res.writeHead(302,{Location:base+'/public/media/'+id});res.end();return;
 }
 const path=route==='/'?'/':route.replace(/\/$/,'')+'/';
 if(!['/','/menu/','/greek-night/','/gallery/','/contact/'].includes(path)){res.statusCode=404;res.end('Page not found');return;}
 try{
  const response=await fetch(base+'/public/state',{signal:AbortSignal.timeout(8000),cache:'no-store'});if(!response.ok)throw new Error('Content unavailable');
  const {values}=await response.json();let html=render(path,values);
  html=html.replace(/<meta name="robots"[^>]*>/g,'').replace('</head>',`<link rel="canonical" href="https://pastokima.com${path}"></head>`);
  res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','public, max-age=0, must-revalidate');
  res.end(req.method==='HEAD'?undefined:html);
 }catch{res.statusCode=503;res.setHeader('Retry-After','30');res.setHeader('Cache-Control','no-store');res.end('The website is temporarily unavailable. Please try again shortly.');}
}
