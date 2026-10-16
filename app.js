import { config } from './config.js';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
if(gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
// One shared animation clock; only dialogs bypass smooth wheel input.
if (gsap && ScrollTrigger) ScrollTrigger.config({ignoreMobileResize:true});
let smoothScroll=null;
if(!reduced&&window.Lenis&&gsap&&ScrollTrigger){
 smoothScroll=new window.Lenis({lerp:.11,smoothWheel:true,syncTouch:false,anchors:{offset:-35},prevent:node=>Boolean(node.closest?.('dialog'))});
 smoothScroll.on('scroll',ScrollTrigger.update);
 gsap.ticker.add(time=>smoothScroll.raf(time*1000));
 gsap.ticker.lagSmoothing(0);
 document.documentElement.dataset.smoothScroll='lenis';
}
function syncScrollLock(){
 if(!smoothScroll)return;
 const locked=document.body.classList.contains('menu-open')||Boolean(document.querySelector('dialog[open]'));
 if(locked&&!smoothScroll.isStopped)smoothScroll.stop();
 else if(!locked&&smoothScroll.isStopped)smoothScroll.start();
}
addEventListener('pageshow',syncScrollLock);
let selectedEffect = null, lastDialogTrigger = null;
const grid = $('#effects-grid');
function intensity(value){return `<div class="intensity" aria-label="Intensidade visual ${value} de 5">${Array.from({length:5},(_,i)=>`<i class="${i<value?'filled':''}" aria-hidden="true"></i>`).join('')}<span>INTENSIDADE</span></div>`}
config.services.forEach((s,i)=>{
 const article=document.createElement('article');article.className='effect-card';article.dataset.category=s.category;article.dataset.effect=s.id;
 article.innerHTML=`<button class="effect-photo-button" aria-label="Conhecer ${s.name}"><img src="/public/images/${s.image}" alt="Referência ilustrativa gerada por IA do estilo ${s.name}" width="1122" height="1402" loading="lazy" style="object-position:${s.position}"><span class="effect-tag">${s.label}</span><span class="effect-zoom" aria-hidden="true">↗</span></button><div class="effect-caption"><div><h3>${s.name}</h3><p>${s.subtitle}</p></div><span class="effect-number">0${i+1}</span></div><div class="effect-bottom">${intensity(s.intensity)}<button class="effect-details" aria-label="Ver detalhes de ${s.name}">VER EFEITO <span>↗</span></button></div>`;
 article.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>openEffect(s.id,b)));grid.append(article);
});
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
 $$('[data-filter]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});
 $$('.effect-card').forEach(card=>card.hidden=b.dataset.filter!=='todos'&&card.dataset.category!==b.dataset.filter);
 if(gsap&&!reduced)gsap.fromTo($$('.effect-card:not([hidden])'),{y:18,opacity:0},{y:0,opacity:1,duration:.45,stagger:.06,ease:'power2.out'});
 ScrollTrigger?.refresh();
}));
function openDialog(dialog,trigger){lastDialogTrigger=trigger||document.activeElement;dialog.showModal();document.body.classList.add('modal-open');syncScrollLock();dialog.querySelector('.dialog-close').focus()}
function closeDialog(dialog){dialog.close()}
$$('dialog').forEach(dialog=>{
 dialog.querySelector('.dialog-close').addEventListener('click',()=>closeDialog(dialog));
 dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');syncScrollLock();lastDialogTrigger?.focus({preventScroll:true})});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog)});
});
function openEffect(id,trigger){
 const s=config.services.find(s=>s.id===id);if(!s)return;selectedEffect=s;
 const image=$('#effect-dialog-image');image.src=`/public/images/${s.image}`;image.style.objectPosition=s.position;image.alt=`Inspiração ilustrativa do estilo ${s.name}`;
 $('#effect-dialog-title').textContent=s.name;$('.effect-subtitle').textContent=s.subtitle;$('.effect-description').textContent=s.description;$('.effect-detail').textContent=s.detail;$('.effect-intensity').innerHTML=intensity(s.intensity);openDialog($('#effect-dialog'),trigger);
}
$$('[data-look]').forEach(b=>b.addEventListener('click',()=>openEffect(b.dataset.look,b)));
function book(effect=null,trigger=null){
 const message=effect?`${config.message} Tenho interesse no efeito ${effect.name}.`:config.message;
 if(/^\d{10,15}$/.test(config.whatsapp)){window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener');return}
 $('#booking-message').textContent=message;$('.copy-status').textContent='';$('#copy-message').firstChild.textContent='COPIAR MENSAGEM ';openDialog($('#booking-dialog'),trigger);
}
$$('.booking').forEach(b=>b.addEventListener('click',()=>book(null,b)));
$('.effect-book').addEventListener('click',()=>{closeDialog($('#effect-dialog'));book(selectedEffect)});
$('#copy-message').addEventListener('click',async()=>{const text=$('#booking-message').textContent;try{await navigator.clipboard.writeText(text);$('.copy-status').textContent='Mensagem copiada. Nenhum agendamento foi enviado.';$('#copy-message').firstChild.textContent='MENSAGEM COPIADA '}catch{$('.copy-status').textContent='Selecione e copie a mensagem acima.';const range=document.createRange();range.selectNodeContents($('#booking-message'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range)}});
$('#credits-open').addEventListener('click',e=>openDialog($('#credits'),e.currentTarget));

const menu=$('#menu'),toggle=$('.menu-toggle');let menuOpen=false;
function setMenu(open){
 menuOpen=open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');toggle.querySelector('span').textContent=open?'FECHAR':'MENU';document.body.classList.toggle('menu-open',open);syncScrollLock();
 if(open){menu.hidden=false;if(gsap&&!reduced){gsap.to(menu,{clipPath:'inset(0 0 0% 0)',duration:.6,ease:'power3.inOut',onComplete:()=>{if(menuOpen)menu.querySelector('nav a').focus({preventScroll:true})}})}else{menu.style.clipPath='none';menu.querySelector('nav a').focus({preventScroll:true})}}
 else{toggle.focus({preventScroll:true});if(gsap&&!reduced)gsap.to(menu,{clipPath:'inset(0 0 100% 0)',duration:.45,ease:'power3.inOut',onComplete:()=>{if(!menuOpen)menu.hidden=true}});else menu.hidden=true}
}
toggle.addEventListener('click',()=>setMenu(!menuOpen));menu.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(!menuOpen)return;if(e.key==='Escape'){e.preventDefault();setMenu(false)}if(e.key==='Tab'){const focusables=[$('.header-book'),toggle,...menu.querySelectorAll('nav a')],first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
// Header booking remains available inside the open navigation.
$('.header-book').addEventListener('click',()=>{if(menuOpen)setMenu(false)});

let mood=null;
const quizOptions=$('.quiz-options'),quizResult=$('.quiz-result');
quizOptions.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.mood){mood=b.dataset.mood;$('.quiz-counter').textContent='02 — 02';$('#quiz-question').textContent='Quanto destaque você quer?';$('#quiz-description').textContent='Seu olhar pode falar baixinho ou roubar a cena.';quizOptions.innerHTML='<button data-level="leve"><span>01</span>Um toque de definição <i>↗</i></button><button data-level="medio"><span>02</span>Presença na medida <i>↗</i></button><button data-level="intenso"><span>03</span>Quero um olhar poderoso <i>↗</i></button>';$('.quiz-reset').hidden=false;quizOptions.querySelector('button').focus()}
 else if(b.dataset.level){const level=b.dataset.level;const id=mood==='alongado'?(level==='intenso'?'wispy':'fox'):mood==='natural'?(level==='leve'?'classico':'brasileiro'):(level==='intenso'?'luxo':'russo');const s=config.services.find(s=>s.id===id);$('.quiz-counter').textContent='SEU MATCH É…';$('#quiz-question').textContent='Tem tudo a ver com você.';$('#quiz-description').textContent='Uma referência para inspirar o seu próximo olhar.';quizOptions.hidden=true;quizResult.innerHTML=`<h4>${s.name}</h4><p>${s.subtitle} ${s.detail}</p><button class="button button-purple" data-result="${s.id}">CONHECER MEU EFEITO <span>↗</span></button>`;quizResult.hidden=false;quizResult.querySelector('button').addEventListener('click',e=>openEffect(s.id,e.currentTarget));quizResult.querySelector('button').focus();$('.quiz-reset').hidden=false}
});
$('.quiz-reset').addEventListener('click',()=>{mood=null;$('.quiz-counter').textContent='01 — 02';$('#quiz-question').textContent='Como você quer se sentir?';$('#quiz-description').textContent='Escolha o mood que mais combina com você.';quizOptions.innerHTML='<button data-mood="natural"><span>01</span>Linda, de um jeito natural <i>↗</i></button><button data-mood="alongado"><span>02</span>Com um olhar mais felino <i>↗</i></button><button data-mood="marcante"><span>03</span>Pronta para ser notada <i>↗</i></button>';quizOptions.hidden=false;quizResult.hidden=true;$('.quiz-reset').hidden=true;quizOptions.querySelector('button').focus()});

if(config.instagram){const a=document.createElement('a');a.href=config.instagram;a.textContent='Instagram ↗';a.target='_blank';a.rel='noopener';$('.footer-top nav').append(a)}
if(config.domain){const link=document.createElement('link');link.rel='canonical';link.href=config.domain;document.head.append(link)}
if(gsap&&ScrollTrigger&&!reduced){
 gsap.from('.hero-photo img',{scale:1.07,duration:1.6,ease:'power2.out'});
 gsap.from('.hero-copy h1',{y:45,clipPath:'inset(0 0 100% 0)',duration:1.15,ease:'power3.out',delay:.15});
 gsap.from('.hero-copy>.eyebrow,.hero-description,.hero-copy>.button,.hero-signature',{y:12,opacity:0,duration:.7,stagger:.12,delay:.4,ease:'power2.out'});
 gsap.from('.hero-sticker',{rotation:0,y:20,opacity:0,duration:.8,delay:.75,ease:'power2.out'});
 $$('.lookbook-grid button').forEach((el,i)=>gsap.from(el,{y:30,duration:.85,delay:i*.08,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
}

if(gsap&&ScrollTrigger&&!reduced){
 gsap.to('.hero-copy',{y:-70,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
 gsap.to('.hero-photo',{yPercent:5,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
 gsap.fromTo('.experience-photo>img',{scale:1.14,yPercent:-4},{yPercent:4,ease:'none',scrollTrigger:{trigger:'.experience-photo',start:'top bottom',end:'bottom top',scrub:1}});
 $$('.experience-steps article').forEach(el=>gsap.from(el,{x:24,clipPath:'inset(0 0 0 100%)',duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
 gsap.fromTo('.brush-copy',{y:45},{y:-45,ease:'none',scrollTrigger:{trigger:'.brush-chapter',start:'top bottom',end:'bottom top',scrub:1}});
 $$('.lookbook-grid img').forEach((el,i)=>gsap.fromTo(el,{scale:1.08,yPercent:-2},{yPercent:3,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1.2}}));
 if(!navigator.connection?.saveData){
  import('./brush.js').then(({initBrush})=>{initBrush($('#brush-traveler'),gsap,ScrollTrigger);ScrollTrigger.refresh()}).catch(error=>{console.info('Escovinha estática disponível:',error.message)});
 }
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
 addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}

// Incoming elements stay visibly soft over half a viewport, in both directions.
// Filter only individual media/text blocks; never the page or the WebGL canvas.
if(gsap&&ScrollTrigger&&!reduced){
 const targets=$$('.effects-heading h2,.effects-heading>div,.effect-photo-button,.match h2,.experience-photo,.experience-copy h2,.lookbook h2,.lookbook-grid button,.faq h2,.closing-copy h2');
 targets.forEach(el=>{
  const blur=el.matches('h2')?4.5:(innerWidth<600?6:8);
  gsap.fromTo(el,{filter:`blur(${blur}px)`},{filter:'blur(0px)',ease:'none',scrollTrigger:{
   trigger:el,start:'top 100%',end:'top 45%',scrub:.35,
   onToggle:self=>{if(self.isActive)el.style.willChange='filter';else el.style.removeProperty('will-change')}
  }});
 });
}
