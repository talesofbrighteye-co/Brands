/* NAV */
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));

/* MOBILE MENU */
/* HERO SLIDER */
const heroSlides=[...document.querySelectorAll('.hero-bg div')];
const heroButtons=[...document.querySelectorAll('.hero-meta button')];
const pauseBtn=document.getElementById('pauseBtn');
let heroIndex=0, paused=false, heroTimer;

function showHero(i){
  heroIndex=i;
  heroSlides.forEach((s,n)=>s.classList.toggle('active',n===i));
  heroButtons.forEach((b,n)=>b.classList.toggle('active',n===i));
}
function nextHero(){if(!paused)showHero((heroIndex+1)%heroSlides.length)}
function restartHeroTimer(){
  clearInterval(heroTimer);
  heroTimer=setInterval(nextHero,6000);
}
heroButtons.forEach(b=>b.addEventListener('click',()=>{
  showHero(+b.dataset.slide);restartHeroTimer();
}));
pauseBtn.addEventListener('click',()=>{
  paused=!paused;
  pauseBtn.textContent=paused?'▶':'Ⅱ';
});
restartHeroTimer();

/* TESTIMONIALS */
const ts=[...document.querySelectorAll('.testimonial-slide')];
const td=[...document.querySelectorAll('.testimonial-controls button')];
let ti=0;
function showTestimonial(i){
  ti=i;
  ts.forEach((x,n)=>x.classList.toggle('active',n===i));
  td.forEach((x,n)=>x.classList.toggle('active',n===i));
}
td.forEach(b=>b.addEventListener('click',()=>showTestimonial(+b.dataset.testimonial)));
setInterval(()=>showTestimonial((ti+1)%ts.length),7000);

/* SCROLL REVEAL */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>observer.observe(x));

/* Shared mobile navigation */
const menuBtn2 = document.getElementById('menuBtn');
const mobileMenu2 = document.getElementById('mobileMenu');
if(menuBtn2 && mobileMenu2){
  menuBtn2.addEventListener('click',()=>{
    mobileMenu2.classList.toggle('open');
    menuBtn2.textContent=mobileMenu2.classList.contains('open')?'×':'☰';
  });
  document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{
    mobileMenu2.classList.remove('open');
    menuBtn2.textContent='☰';
  }));
}
