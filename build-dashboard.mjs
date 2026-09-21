import {readFileSync,writeFileSync,mkdirSync,cpSync,rmSync} from 'node:fs';
import {build} from 'esbuild';
const source=readFileSync('CONTENT.md','utf8');
const schema={},initial={};
const add=(key,label,type,value,section,max=500)=>{schema[key]={label,type,section,max};initial[key]=value;return `@@${key}@@`};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const menu=[];
for(const [kind,start,end] of [['food','## Food menu','## Drinks'],['drink','## Drinks','## Location']]){
 source.split(start)[1].split(end)[0].split(/^### /m).slice(1).forEach((chunk,gi)=>{
  const [category,...lines]=chunk.split('\n');
  lines.filter(x=>x.startsWith('- ')).forEach((line,ii)=>{
   const parts=line.slice(2).split(' — '),id=`${kind}.${gi}.${ii}`,name=parts[0],description=parts.length>2?parts.slice(1,-1).join(' · '):'',price=parts.at(-1);
   add(id+'.name',name+' · name','text',name,'menu',150);add(id+'.description',name+' · description','text',description,'menu',800);add(id+'.price',name+' · price','price',price,'menu',30);add(id+'.visible',name+' · available','boolean','yes','menu');
   menu.push({id,category:category.trim(),kind});
  });
 });
}
const pages={};for(const slug of ['','menu','greek-night','gallery','contact'])pages[slug?`/${slug}/`:'/']=readFileSync(`dist/${slug?slug+'/':''}index.html`,'utf8');
let index=0;pages['/menu/']=pages['/menu/'].replace(/<article class="dish">[\s\S]*?<\/article>/g,()=>`@@DISH:${menu[index++].id}@@`);
const mediaNames={'05-5.jpeg':'Homepage terrace','09-9.jpeg':'Seafood photo','07-7.jpeg':'Sharing platter','10-10.jpeg':'Grilled chicken','01-1.jpeg':'Greek Night video cover','greek-night.mp4':'Greek Night video','08-8.jpeg':'Gallery · seaside tables','04-4.jpeg':'Gallery · sea view','02-2.jpeg':'Gallery · Greek dancer','06-6.jpeg':'Gallery · table details','11-11.jpeg':'Gallery · celebrations','12-12.jpeg':'Gallery · terrace','03-3.jpeg':'Gallery · performance','13-hero.jpeg':'Gallery · sunset','logo.png':'Restaurant logo'};
for(const [file,label] of Object.entries(mediaNames)){
 const key='media.'+file.replace(/[^a-z0-9]/gi,'_'),token=add(key,label,file.endsWith('.mp4')?'video':'image','/assets/'+file,'media');
 for(const path in pages)pages[path]=pages[path].replaceAll('/assets/'+file,token);
 if(!file.endsWith('.mp4')){
  const altKey='alt.'+file.replace(/[^a-z0-9]/gi,'_');let originalAlt=label;
  for(const page of Object.values(pages)){const tag=page.match(new RegExp('<img[^>]*src="'+token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"[^>]*>'));if(tag){const a=tag[0].match(/alt="([^"]*)"/);if(a?.[1])originalAlt=a[1];break;}}
  const altToken=add(altKey,label+' · image description','text',originalAlt,'mediaAlt',250);
  for(const path in pages)pages[path]=pages[path].replace(/<img[^>]*>/g,tag=>tag.includes(token)?tag.replace(/alt="[^"]*"/,`alt="${altToken}"`):tag);
 }
}
function replaceAllText(key,label,text,section,type='text',max=500){const token=add(key,label,type,text,section,max);for(const path in pages)pages[path]=pages[path].replaceAll(esc(text),token);}
replaceAllText('details.phone','Telephone','+357 97 717607','details','phone',30);
for(const path in pages)pages[path]=pages[path].replaceAll('tel:+35797717607','tel:@@PHONE@@');
replaceAllText('details.address','Address','E704, Argaka 8873, Cyprus','details','text',250);
replaceAllText('details.booking','Booking information','No online bookings. Please call for table availability.','details');
replaceAllText('night.day','Greek Night day','EVERY THURSDAY','details','weekday',50);
replaceAllText('night.description','Greek Night description','Our Traditional Greek Night brings live singers, dancers and a little extra life to the table. This is what Thursdays look like at Pas To Kima.','details','text',1000);
replaceAllText('home.intro','Homepage introduction','Seaside grills, generous plates and a table that feels like yours.','details');
replaceAllText('home.story','Our story','Good olive oil. Fresh herbs. The warmth of charcoal. We cook simple Mediterranean food with Cypriot soul, right beside the sea in Argaka.','details','text',1000);
for(const day of ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']){
 const value=day==='Tuesday'?'Closed':'12:00 – 22:00';const token=add('hours.'+day,day,'hours',value,'hours',40);
 pages['/contact/']=pages['/contact/'].replace(`<td>${day}</td><td>${value}</td>`,`<td>${day}</td><td>${token}</td>`);
}
for(const path in pages){
 if(path==='/contact/')pages[path]=pages[path].replace(/href="https:\/\/www\.google\.com\/maps[^\"]*"/g,'href="@@MAP_URL@@"');
 pages[path]=pages[path].replaceAll('THURSDAY GREEK NIGHT','@@NIGHT_DAY_UPPER@@ GREEK NIGHT').replaceAll('Thursday Greek Night','@@NIGHT_DAY@@ Greek Night').replaceAll('See what Thursdays look like','See what @@NIGHT_DAY@@s look like');
 pages[path]=pages[path].replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/g,'<div class="map-consent"><div class="map-placeholder" id="map-placeholder"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><h3>Pas To Kima</h3><p>@@details.address@@</p><button class="button warm" id="load-map" data-address="@@details.address@@">Show interactive map</button><p class="map-privacy-note">Choose to load Google Maps. Google receives your connection information and may use cookies.</p></div><div id="map-container" aria-live="polite"></div><div class="map-footer"><button id="remove-map" hidden>Remove map</button><a class="underlined" href="@@MAP_URL@@" target="_blank" rel="noopener noreferrer">Get directions</a><a class="underlined" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy information</a></div></div>');
 pages[path]=pages[path].replace('<script src="/app.js"></script>','<script src="/app.js"></script><script src="/privacy-map.js"></script>').replace('<p>© Pas To Kima</p>','<p>© Pas To Kima · <a href="/privacy/">Privacy</a></p>');
}
mkdirSync('generated',{recursive:true});writeFileSync('generated/content.json',JSON.stringify({initial,schema,menu,pages}));
rmSync('dist/server',{recursive:true,force:true});rmSync('dist/client',{recursive:true,force:true});mkdirSync('dist/client',{recursive:true});mkdirSync('dist/server',{recursive:true});
cpSync('dist/assets','dist/client/assets',{recursive:true});
for(const f of ['style.css','pages.css','refinements.css','app.js','scrollcraft.css','scrollcraft.js'])cpSync('dist/'+f,'dist/client/'+f);
for(const f of ['dashboard.css','dashboard.js','privacy-map.js'])cpSync('dashboard/'+f,'dist/client/'+f);
// HTML is served by the Worker only: static files cannot bypass dashboard authentication.
await build({entryPoints:['server/worker.mjs'],bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:'dist/server/index.js',loader:{'.html':'text'},minify:false});
mkdirSync('dist/.openai',{recursive:true});cpSync('.openai/hosting.json','dist/.openai/hosting.json');cpSync('drizzle','dist/.openai/drizzle',{recursive:true});
console.log(`Dashboard Worker built; ${menu.length} dishes and ${Object.keys(mediaNames).length} media slots.`);
// Keep route HTML out of static assets so every page uses current database content.
for(const slug of ['','menu','greek-night','gallery','contact'])rmSync(`dist/${slug?slug+'/':''}index.html`,{force:true});
