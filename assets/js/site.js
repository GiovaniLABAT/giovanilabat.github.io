/* =========================================================
   Portfolio de Giovani Labat — scripts communs
   Chaque module ne s'active que si la page contient ses éléments.
   ========================================================= */

/* thème clair / sombre (même clé que la home) */
(function(){
  var root=document.documentElement;
  function current(){var a=root.getAttribute('data-theme'); return a?a:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}
  var btn=document.getElementById('themeToggle'); if(!btn) return;
  btn.addEventListener('click',function(){
    var next=current()==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next);}catch(e){}
  });
})();

/* barre de progression de lecture */
(function(){
  var bar=document.getElementById('progressBar'), ticking=false; if(!bar) return;
  function update(){
    var max=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';
    ticking=false;
  }
  addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(update); } },{passive:true});
  addEventListener('resize',update); update();
})();

/* carrousel de la recette */
(function(){
  var track=document.getElementById('recetteTrack'); if(!track) return;
  document.querySelectorAll('.car-nav button').forEach(function(b){
    b.addEventListener('click',function(){
      track.scrollBy({left:track.clientWidth*parseInt(b.dataset.dir,10), behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    });
  });
})();

/* slider marquee : défile seul + drag + label "Drag" (même logique que la home) */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.cs-slider .marquee').forEach(function(m){
    var track=m.querySelector('.track'), hint=m.querySelector('.drag-hint');
    var x=0, speed=reduce?0:0.45, half=0, dragging=false, startX=0, startOff=0;
    function measure(){ var mid=track.children[track.children.length/2|0]; half=mid?mid.offsetLeft:track.scrollWidth/2; }
    function wrap(){ if(half>0){ while(x<=-half) x+=half; while(x>0) x-=half; } }
    measure(); addEventListener('load',measure); addEventListener('resize',measure);
    function frame(){ if(!dragging){ x-=speed; wrap(); track.style.transform='translateX('+x+'px)'; } requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
    m.addEventListener('pointermove',function(e){
      var r=m.getBoundingClientRect();
      if(hint){ hint.style.left=(e.clientX-r.left)+'px'; hint.style.top=(e.clientY-r.top)+'px'; }
      if(dragging){ x=startOff+(e.clientX-startX); wrap(); track.style.transform='translateX('+x+'px)'; }
    });
    m.addEventListener('pointerdown',function(e){ dragging=true; startX=e.clientX; startOff=x; m.classList.add('grabbing'); try{m.setPointerCapture(e.pointerId);}catch(_){} });
    addEventListener('pointerup',function(){ dragging=false; m.classList.remove('grabbing'); });
  });
})();

/* avant / après : comportement mesuré sur xhulia.com/cyberdart
   - survol : la ligne rejoint la souris avec un lissage exponentiel (constante ≈ 200 ms)
   - glisser (souris ou doigt) : la ligne suit directement, même hors du cadre (bornée 0–100 %)
   - la souris quitte le cadre : la ligne reste où elle est
   - clavier (en plus) : ← → par pas de 5 %, Maj pour 10 %, Début / Fin */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.ba').forEach(function(el){
    var pos=50, target=50, dragging=false, raf=0, last=0;
    function apply(){ el.style.setProperty('--pos', pos+'%'); el.setAttribute('aria-valuenow', Math.round(pos)); }
    function tick(t){
      var dt=last?Math.min(64,t-last):16; last=t;
      pos+=(target-pos)*(1-Math.exp(-dt/200));
      if(Math.abs(target-pos)<0.05){ pos=target; apply(); raf=0; last=0; return; }
      apply(); raf=requestAnimationFrame(tick);
    }
    function go(p, instant){
      target=Math.max(0,Math.min(100,p));
      if(instant||reduce){ if(raf){ cancelAnimationFrame(raf); raf=0; last=0; } pos=target; apply(); return; }
      if(!raf) raf=requestAnimationFrame(tick);
    }
    function pct(e){ var r=el.getBoundingClientRect(); return (e.clientX-r.left)/r.width*100; }
    el.addEventListener('pointermove',function(e){
      if(dragging){ go(pct(e), true); return; }
      if(e.pointerType==='mouse') go(pct(e));
    });
    el.addEventListener('pointerdown',function(e){
      if(e.pointerType==='mouse' && e.button!==0) return;
      dragging=true; go(pct(e), true);
      try{ el.setPointerCapture(e.pointerId); }catch(_){}
    });
    function end(){ dragging=false; }
    el.addEventListener('pointerup',end);
    el.addEventListener('pointercancel',end);
    el.addEventListener('lostpointercapture',end);
    el.addEventListener('keydown',function(e){
      var step=e.shiftKey?10:5, k=e.key;
      if(k==='ArrowLeft'||k==='ArrowDown') go(target-step);
      else if(k==='ArrowRight'||k==='ArrowUp') go(target+step);
      else if(k==='Home') go(0);
      else if(k==='End') go(100);
      else return;
      e.preventDefault();
    });
  });
})();

/* maquette 3D : l'iframe n'est créée qu'au clic (WebGL + bloom tournent en continu),
   et « Fermer » la retire pour libérer le processeur graphique */
(function(){
  var v=document.getElementById('viewer3d'), play=document.getElementById('play3d'), close=document.getElementById('close3d');
  if(!v) return;
  play.addEventListener('click',function(){
    var f=document.createElement('iframe');
    f.src='assets/3d/connect-station/index.html';
    f.title='Maquette 3D interactive de Connect Station';
    f.allow='fullscreen';
    v.appendChild(f); v.classList.add('on'); close.hidden=false;
    f.focus();
  });
  close.addEventListener('click',function(){
    var f=v.querySelector('iframe'); if(f) f.remove();
    v.classList.remove('on'); close.hidden=true; play.focus();
  });
})();

/* bandeau de photos : la pile arrive inclinée (-40°) puis se redresse, et les photos s'ouvrent en éventail
   (même chorégraphie que l'original : redressement ≈ 0,9 s, éventail à partir de ≈ 1,05 s) */
(function(){
  var fan=document.getElementById('fan'); if(!fan) return;
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ fan.classList.add('go'); }); });
})();

/* copier l'email */
(function(){
  var b=document.getElementById('copyEmail'); if(!b) return;
  var label=b.firstChild.nodeValue;
  b.addEventListener('click',function(){
    var done=function(){ b.firstChild.nodeValue='Email copié '; b.classList.add('copied'); setTimeout(function(){ b.firstChild.nodeValue=label; b.classList.remove('copied'); },1800); };
    if(navigator.clipboard) navigator.clipboard.writeText(b.dataset.email).then(done,done); else done();
  });
})();

/* apparition au défilement : les blocs marqués .rv montent en fondu quand ils entrent à l'écran ;
   les éléments d'un même parent qui arrivent ensemble s'enchaînent (80 ms d'écart) */
(function(){
  var sel=['.cards3 > *','.stack > *','.divider','.chapter > .wrap > *','.fig','.stats > *','.learn .wrap > *','.next',
           '.intro > *','.ab-body > *','.ab-video','.cv-note','.cv-grid > *','.pc-preview'];
  var els=[].slice.call(document.querySelectorAll(sel.join(','))).filter(function(e){ return !e.closest('.rv'); });
  if(!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  els.forEach(function(e){ e.classList.add('rv'); });
  var io=new IntersectionObserver(function(entries){
    var batch=entries.filter(function(en){ return en.isIntersecting; }).map(function(en){ return en.target; });
    batch.forEach(function(el,i){
      var sib=batch.filter(function(o){ return o.parentNode===el.parentNode; }).indexOf(el);
      el.style.setProperty('--d',(Math.min(sib,5)*0.08)+'s');
      el.classList.add('in'); io.unobserve(el);
    });
  },{rootMargin:'0px 0px -8% 0px', threshold:0.08});
  els.forEach(function(e){ io.observe(e); });
  // filet de sécurité : un défilement très rapide (ancre, barre de défilement) peut sauter un bloc
  // sans qu'il soit jamais « à l'écran » ; tout ce qui est déjà au-dessus du bas de l'écran s'affiche
  var t=0;
  function sweep(){ t=0; els.forEach(function(e){ if(!e.classList.contains('in') && e.getBoundingClientRect().top<innerHeight){ e.classList.add('in'); io.unobserve(e); } }); }
  addEventListener('scroll',function(){ if(!t) t=setTimeout(sweep,250); },{passive:true});
})();

/* nom du footer : occupe exactement la largeur disponible, quel que soit l'écran (jamais coupé) */
(function(){
  var els=document.querySelectorAll('.foot-name'); if(!els.length) return;
  function fit(){
    els.forEach(function(el){
      el.style.fontSize='100px';
      var rg=document.createRange(); rg.selectNodeContents(el);
      var w=rg.getBoundingClientRect().width;                                   // largeur du texte lui-même
      var cs=getComputedStyle(el), avail=el.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
      if(w>0 && avail>0) el.style.fontSize=Math.floor(100*avail/w*0.985)+'px';
    });
  }
  fit();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  var t; addEventListener('resize',function(){ clearTimeout(t); t=setTimeout(fit,120); });
})();

/* liens email : ouvrent l'application mail ET copient l'adresse (utile si aucune messagerie n'est configurée) */
(function(){
  var toast;
  function show(msg){
    if(!toast){
      toast=document.createElement('div'); toast.setAttribute('role','status');
      toast.style.cssText='position:fixed;left:50%;bottom:28px;transform:translate(-50%,16px);z-index:100;padding:12px 18px;border-radius:999px;'+
        'background:#09090B;color:#FAFAFA;font:500 14px/1.2 Geist,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;'+
        'transition:opacity .25s ease,transform .25s ease;pointer-events:none;white-space:nowrap';
      document.body.appendChild(toast);
    }
    toast.textContent=msg; toast.style.opacity='1'; toast.style.transform='translate(-50%,0)';
    clearTimeout(show.t); show.t=setTimeout(function(){ toast.style.opacity='0'; toast.style.transform='translate(-50%,16px)'; },2600);
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest && e.target.closest('a[href^="mailto:"]'); if(!a) return;
    var email=a.getAttribute('href').slice(7).split('?')[0];
    if(navigator.clipboard) navigator.clipboard.writeText(email).then(function(){ show('Adresse copiée : '+email); },function(){ show(email); });
    else show(email);
  });
})();
