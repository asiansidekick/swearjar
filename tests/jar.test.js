const {chromium}=require('playwright');
/* the 3D dictionary: fly, tap, save, record, edit a built-in word, type to find or translate, portrait and landscape */
(async()=>{const b=await chromium.launch();const errs=[];
const open=async(w,h)=>{const p=await (await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,hasTouch:true})).newPage();
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.route('**/translate_a/**',r=>{const u=new URL(r.request().url()),tl=u.searchParams.get('tl'),q=u.searchParams.get('q');
    r.fulfill({contentType:'application/json',body:JSON.stringify([[[tl==='th'?'ไอ้ขี้แพ้':'Loser',q,null,null,1],[null,null,tl==='th'?'ai khi phae':null,null]],null,u.searchParams.get('sl')==='auto'?'en':u.searchParams.get('sl')])})});
  await p.addInitScript(()=>{window.__said=[];speechSynthesis.speak=u=>window.__said.push([u.lang,u.text]);
    // a pretend microphone so Record can be tested
    navigator.mediaDevices.getUserMedia=async()=>({getTracks:()=>[{stop(){}}]});
    window.MediaRecorder=class{constructor(){this.state='inactive'}static isTypeSupported(){return true}start(){this.state='recording'}stop(){this.state='inactive';this.ondataavailable({data:new Blob([new Uint8Array(2000)])});this.onstop()}}});
  await p.goto('http://localhost:8765/');await p.waitForTimeout(400);await p.fill('#stName','Phil');await p.selectOption('#stLang','en');await p.click('#stClose');await p.waitForTimeout(500);return p};
const p=await open(390,844);
console.log('entries',await p.evaluate(()=>JE.filter(e=>e.kind==='ent').length),'view',await p.evaluate(()=>viewLang()));
await p.screenshot({path:'j1-start.png'});
await p.mouse.move(195,600);for(let i=0;i<6;i++)await p.mouse.wheel(0,250);await p.waitForTimeout(200);await p.screenshot({path:'j2-flown.png'});
// tap the word in focus
const fv=await p.evaluate(()=>focusVar());
const bb=await p.$eval(`[data-l="l:${fv}|th"]`,g=>{const r=g.getBoundingClientRect();return[r.x+r.width/2,r.y+r.height/2]});await p.mouse.click(bb[0],bb[1]);await p.waitForTimeout(300);
console.log('card',await p.evaluate(()=>[cd.open,cdWord.textContent,cdState.innerText]),'spoke',await p.evaluate(()=>__said.slice(-1)));
await p.click('#cdLearn');await p.click('#cdRec');await p.waitForTimeout(100);await p.click('#cdRec');await p.waitForTimeout(400);
console.log('saved+recorded',await p.evaluate(()=>cdState.innerText));await p.screenshot({path:'j3-card.png'});
// edit a built-in word: my version replaces it
await p.click('#cdEdit');await p.waitForTimeout(200);await p.fill('#edRo','my spelling');await p.click('#edSave');await p.waitForTimeout(400);
console.log('edited',await p.evaluate(fv=>{const v=NODES['v:'+fv];return v.kids.filter(l=>l.lang==='th').map(l=>[l.w,l.ro,!!l.uid])},fv));
// verified word looks different
await p.evaluate(()=>{const z=entryZ('v:motherfucker');CZ=z;jarDraw()});await p.waitForTimeout(100);
console.log('verified look',await p.$eval('[data-l="l:motherfucker|th"]',e=>e.className));await p.screenshot({path:'j4-verified.png'});
// type a word that's in the jar
await p.fill('#jIn','scumbag');await p.press('#jIn','Enter');await p.waitForTimeout(1800);console.log('found',await p.evaluate(()=>[cd.open,cdWord.textContent]));await p.click('#cdClose');
// type a new word: translate, record, save
await p.fill('#jIn','loser');await p.press('#jIn','Enter');await p.waitForTimeout(600);await p.screenshot({path:'j5-new.png'});
await p.click('#jrRec');await p.waitForTimeout(100);await p.click('#jrRec');await p.click('#jrSave');await p.waitForTimeout(1800);
console.log('new word',await p.evaluate(()=>S.words.filter(w=>w.var.startsWith('v')).map(w=>[w.w,w.lang,w.mean,!!w.aud])),'focus',await p.evaluate(()=>NODES['v:'+focusVar()].en));
await p.screenshot({path:'j6-saved.png'});
// every language
await p.selectOption('#jLang','all');await p.waitForTimeout(300);await p.screenshot({path:'j7-all.png'});
for(const t of['swap','quiz','score','map'])await p.click(`nav [data-tab=${t}]`);
// sideways
const q=await open(844,390);await q.evaluate(()=>{CZ=entryZ('v:youfucker');jarDraw()});await q.screenshot({path:'j8-landscape.png'});
console.log('landscape header hidden',await q.$eval('header',e=>getComputedStyle(e).display));
await q.setViewportSize({width:390,height:844});await q.waitForTimeout(300);console.log('rotated back, focus',await q.evaluate(()=>focusVar()));
console.log('errors',errs);await b.close()})();
