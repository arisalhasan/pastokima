import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const content=JSON.parse(readFileSync('generated/content.json','utf8'));
for(const [route,html] of Object.entries(content.pages)){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'duplicate IDs');
 for(const m of html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)){
  const path=m[1];if(path.startsWith('#'))assert(ids.includes(path.slice(1)),`missing anchor ${path}`);
  else if(!/^(https?:|tel:|data:|@@)/.test(path)&&!['/admin/','/privacy/'].includes(path)&&!content.pages[path])assert(existsSync('dist/client/'+path.replace(/^\//,'')),`missing target ${path}`);
 }
 assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1,route+' heading count');
 assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
 assert(!html.includes('{{'));assert(!html.includes('autoplay'));assert(!html.includes('<form'));
}
assert.equal(content.menu.length,126);assert.equal((content.pages['/menu/'].match(/class="menu-panel"/g)||[]).length,10);
const home=content.pages['/'];assert(home.includes('353 five-star reviews'));assert(!home.includes('503 reviews'));assert(!home.includes('4.3 <small>/ 5</small>'));assert.equal((home.match(/<small>Google Maps<\/small>/g)||[]).length,3);assert(!home.includes('Google review · excerpt'));
for(const html of Object.values(content.pages)){assert(!html.includes('href="/admin/"'));assert.equal((html.match(/class="social-icon"/g)||[]).length,3);assert(!html.replace(/<span class="link-arrow" aria-hidden="true">↗<\/span>/g,'').includes('↗'));}
assert(content.pages['/contact/'].includes('id="load-map"'));assert(!content.pages['/contact/'].includes('<iframe'));
assert(existsSync('dist/server/index.js'));assert(!existsSync('dist/client/admin/index.html'));
const night=content.pages['/greek-night/'];assert(night.includes('playsinline controls'));assert(!night.includes('playsinline muted'));assert(!night.includes('id="film-button"'));
assert(home.includes('class="header-call" href="tel:@@PHONE@@">Call for a table</a>'));
console.log('PASS: generated routes, local assets/anchors, page headings, complete menu, sourced reviews, opt-in map, protected dashboard routing.');
