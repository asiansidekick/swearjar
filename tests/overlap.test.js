// zooms to every hub and branch and reports pills or bubbles that overlap on screen
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const lang of ['en','th']){const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/');await p.selectOption('#stLang',lang);await p.click('#stClose');await p.waitForTimeout(400);
const res=await p.evaluate(()=>{const out=[];const ov=(a,b)=>a.left<b.right-2&&b.left<a.right-2&&a.top<b.bottom-2&&b.top<a.bottom-2;
  const check=(sel,label)=>{const r=[...document.querySelectorAll(sel)].map(e=>({id:e.closest('[data-n]').dataset.n,r:e.getBoundingClientRect()})).filter(x=>x.r.width>4&&x.r.right>0&&x.r.left<390&&x.r.bottom>0&&x.r.top<760);
    for(let i=0;i<r.length;i++)for(let j=i+1;j<r.length;j++)if(ov(r[i].r,r[j].r))out.push(label+': '+r[i].id+' x '+r[j].id)};
  for(const h of TREE.kids){flyTo(h,true);check('.nvar rect',h.id);
    for(const v of h.kids){flyTo(v,true);check('.nleaf circle,.nadd circle,.nvar rect',v.id);
      const r=document.querySelector(`[data-n="${v.id}"] rect`).getBoundingClientRect();if(r.width>380)out.push('wide pill '+v.id+' '+Math.round(r.width));}}
  flyTo(TREE,true);check('.nhub circle','root');return out});
console.log(lang,res.length?res:'no overlaps',errs);}
await b.close()})()
