/* Progressive enhancement: all menu items are present in the HTML. */
const menuLinks=[...document.querySelectorAll('.menu-index a')];
const panels=[...document.querySelectorAll('.menu-panel')];
const menuNav=document.querySelector('.menu-index');
if(menuNav){
menuNav.setAttribute('role','tablist');
menuNav.setAttribute('aria-orientation',matchMedia('(max-width:700px)').matches?'horizontal':'vertical');
function selectMenu(index,focus=false){menuLinks.forEach((link,i)=>{link.setAttribute('aria-selected',String(i===index));link.tabIndex=i===index?0:-1;panels[i].hidden=i!==index});if(focus){menuLinks[index].focus();menuLinks[index].scrollIntoView({block:'nearest',inline:'nearest'})}}
menuLinks.forEach((link,i)=>{link.setAttribute('role','tab');link.id='tab-'+i;link.setAttribute('aria-controls',panels[i].id);panels[i].setAttribute('role','tabpanel');panels[i].setAttribute('aria-labelledby',link.id);link.addEventListener('click',event=>{event.preventDefault();selectMenu(i)});link.addEventListener('keydown',event=>{let next=i;if(['ArrowRight','ArrowDown'].includes(event.key))next=(i+1)%menuLinks.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(i+menuLinks.length-1)%menuLinks.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=menuLinks.length-1;else return;event.preventDefault();selectMenu(next,true)})});
const initialPanel=panels.findIndex(p=>'#'+p.id===location.hash);selectMenu(initialPanel<0?0:initialPanel);
}
const video=document.querySelector('#night-video');
if(video){
new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting&&!document.fullscreenElement&&!video.webkitDisplayingFullscreen)video.pause()})},{threshold:.05}).observe(video);
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
}
const gallery=document.querySelector('.gallery');
if(gallery){
document.querySelector('#gallery-prev').addEventListener('click',()=>gallery.scrollBy({left:-gallery.clientWidth*.85,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));
document.querySelector('#gallery-next').addEventListener('click',()=>gallery.scrollBy({left:gallery.clientWidth*.85,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));
function galleryState(){document.querySelector('#gallery-prev').disabled=gallery.scrollLeft<2;document.querySelector('#gallery-next').disabled=gallery.scrollLeft+gallery.clientWidth>=gallery.scrollWidth-2}gallery.addEventListener('scroll',galleryState,{passive:true});window.addEventListener('resize',galleryState);galleryState();
}
if(window.ScrollCraft)ScrollCraft.mount(document.body);
const motionQuery=matchMedia('(prefers-reduced-motion:reduce)');let scheduled=false;
if(document.querySelector('.hero')){
function updateHero(){scheduled=false;const hero=document.querySelector('.hero');if(!motionQuery.matches&&innerWidth>700&&scrollY<hero.offsetHeight+100)document.querySelector('.terrace').style.transform='translateY('+Math.min(scrollY*.1,60)+'px)'}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateHero)}},{passive:true});motionQuery.addEventListener('change',()=>{document.querySelector('.terrace').style.transform='none'});
}
