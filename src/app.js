"use strict";
/* Swear Jar: a zoomable mind map of swear words. Six basics in the middle, equivalents in other languages to unlock,
   and new words, branches and languages added as people play and swap with friends. */
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const LANGS=[
{c:"en",n:"English",s:"English",f:"🇬🇧",tts:"en-GB",mm:"en"},
{c:"th",n:"Thai",f:"🇹🇭",tts:"th-TH",mm:"th"},{c:"vi",n:"Vietnamese",f:"🇻🇳",tts:"vi-VN",mm:"vi"},{c:"lo",n:"Lao",f:"🇱🇦",tts:"lo-LA",mm:"lo"},{c:"km",n:"Khmer",f:"🇰🇭",tts:"km-KH",mm:"km"},
{c:"zh",n:"Chinese (Mandarin)",s:"Mandarin",f:"🇨🇳",tts:"zh-CN",mm:"zh-CN"},{c:"ja",n:"Japanese",f:"🇯🇵",tts:"ja-JP",mm:"ja"},{c:"ko",n:"Korean",f:"🇰🇷",tts:"ko-KR",mm:"ko"},
{c:"id",n:"Indonesian",f:"🇮🇩",tts:"id-ID",mm:"id"},{c:"ms",n:"Malay",f:"🇲🇾",tts:"ms-MY",mm:"ms"},{c:"tl",n:"Filipino",f:"🇵🇭",tts:"fil-PH",mm:"tl"},{c:"hi",n:"Hindi",f:"🇮🇳",tts:"hi-IN",mm:"hi"},
{c:"es",n:"Spanish (Mexico)",s:"Mexican",f:"🇲🇽",tts:"es-MX",mm:"es"},{c:"esp",n:"Spanish (Spain)",s:"Spain",f:"🇪🇸",tts:"es-ES",mm:"es"},{c:"esa",n:"Spanish (Argentina)",s:"Argentina",f:"🇦🇷",tts:"es-AR",mm:"es"},{c:"fr",n:"French",f:"🇫🇷",tts:"fr-FR",mm:"fr"},{c:"de",n:"German",f:"🇩🇪",tts:"de-DE",mm:"de"},{c:"it",n:"Italian",f:"🇮🇹",tts:"it-IT",mm:"it"},
{c:"pt",n:"Portuguese",f:"🇧🇷",tts:"pt-BR",mm:"pt"},{c:"ru",n:"Russian",f:"🇷🇺",tts:"ru-RU",mm:"ru"},{c:"ar",n:"Arabic",f:"🇸🇦",tts:"ar-SA",mm:"ar"},{c:"uz",n:"Uzbek",f:"🇺🇿",tts:"uz-UZ",mm:"uz"},
{c:"zt",n:"Chinese (Taiwan)",s:"Taiwan",f:"🇹🇼",tts:"zh-TW",mm:"zh-TW"},{c:"my",n:"Burmese",f:"🇲🇲",tts:"my-MM",mm:"my"},{c:"ta",n:"Tamil",f:"🇮🇳",tts:"ta-IN",mm:"ta"},{c:"bn",n:"Bengali",f:"🇧🇩",tts:"bn-BD",mm:"bn"},{c:"ur",n:"Urdu",f:"🇵🇰",tts:"ur-PK",mm:"ur"},{c:"fa",n:"Persian",f:"🇮🇷",tts:"fa-IR",mm:"fa"},{c:"tr",n:"Turkish",f:"🇹🇷",tts:"tr-TR",mm:"tr"},{c:"pl",n:"Polish",f:"🇵🇱",tts:"pl-PL",mm:"pl"},{c:"nl",n:"Dutch",f:"🇳🇱",tts:"nl-NL",mm:"nl"},{c:"sv",n:"Swedish",f:"🇸🇪",tts:"sv-SE",mm:"sv"},{c:"el",n:"Greek",f:"🇬🇷",tts:"el-GR",mm:"el"},{c:"he",n:"Hebrew",f:"🇮🇱",tts:"he-IL",mm:"he"},{c:"uk",n:"Ukrainian",f:"🇺🇦",tts:"uk-UA",mm:"uk"},{c:"ne",n:"Nepali",f:"🇳🇵",tts:"ne-NP",mm:"ne"},{c:"si",n:"Sinhala",f:"🇱🇰",tts:"si-LK",mm:"si"},{c:"mn",n:"Mongolian",f:"🇲🇳",tts:"mn-MN",mm:"mn"},{c:"kk",n:"Kazakh",f:"🇰🇿",tts:"kk-KZ",mm:"kk"},{c:"sw",n:"Swahili",f:"🇰🇪",tts:"sw-KE",mm:"sw"},{c:"cs",n:"Czech",f:"🇨🇿",tts:"cs-CZ",mm:"cs"},{c:"ro",n:"Romanian",f:"🇷🇴",tts:"ro-RO",mm:"ro"},{c:"hu",n:"Hungarian",f:"🇭🇺",tts:"hu-HU",mm:"hu"},
{c:"yue",n:"Cantonese",f:"🇭🇰",tts:"zh-HK",mm:"yue"},{c:"ceb",n:"Cebuano",f:"🇵🇭",tts:"ceb-PH",mm:"ceb"},{c:"jv",n:"Javanese",f:"🇮🇩",tts:"jv-ID",mm:"jw"},{c:"pa",n:"Punjabi",f:"🇮🇳",tts:"pa-IN",mm:"pa"},{c:"mr",n:"Marathi",f:"🇮🇳",tts:"mr-IN",mm:"mr"},{c:"te",n:"Telugu",f:"🇮🇳",tts:"te-IN",mm:"te"}];
const LG=c=>LANGS.find(l=>l.c===c)||LANGS[0];
const LN=c=>S&&S.me.lang==="th"&&LN_TH[c]||LG(c).n;
const SN=c=>S&&S.me.lang==="th"&&(LN_TH_SHORT[c]||LN_TH[c])||LG(c).s||LG(c).n;
const KINDS=[{k:"swear",n:"Swear word",c:"#ff6b6b"},{k:"insult",n:"Insult",c:"#ff9f1c"},{k:"slang",n:"Slang",c:"#4cc9f0"},{k:"funny",n:"Funny",c:"#7bd88f"}];
const HUBC={fuck:"#ff6b6b",shit:"#ff9f1c",piss:"#ffd23f",bitch:"#ff6b9d",bastard:"#4cc9f0",idiot:"#7bd88f",other:"#b388ff"};
const PTS={add:10,newlang:10,learn:10,friend:20,teach:20,nailed:10,quiz:5,branch:15};

/* Google Form that receives shared words (left empty until Phil's form exists; shared words wait in a queue) */
const SHARE_FORM="";
const SHARE_FIELDS={w:"",lang:"",mean:"",rude:"",kind:""};

/* ---------- storage ---------- */
const KEY="swearjar.v1";
let S;
function blank(){return{me:{name:"",lang:""},friend:{name:"",lang:""},words:[],learned:{},hubs:[],vars:[],pts:0,badges:[],swaps:0,quizRight:0,share:false,queue:[],days:[],tab:"map"}}
function load(){try{S=Object.assign(blank(),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){S=blank()}
  if(S.tab==="words")S.tab="map";
  // words saved before the map existed go on their own branch
  S.words.forEach(w=>{if(!w.var)w.var="misc"})}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){return false}}

/* recordings live in IndexedDB, keyed by word id */
let DBP=null;
function db(){if(!DBP)DBP=new Promise((ok,no)=>{try{const r=indexedDB.open("swearjar",1);r.onupgradeneeded=()=>r.result.createObjectStore("aud");r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}});return DBP}
async function audPut(id,blob){try{const d=await db();await new Promise((ok,no)=>{const t=d.transaction("aud","readwrite");t.objectStore("aud").put(blob,id);t.oncomplete=ok;t.onerror=()=>no(t.error)});return true}catch(e){return false}}
async function audGet(id){try{const d=await db();return await new Promise(ok=>{const r=d.transaction("aud").objectStore("aud").get(id);r.onsuccess=()=>ok(r.result||null);r.onerror=()=>ok(null)})}catch(e){return null}}
async function audDel(id){try{const d=await db();d.transaction("aud","readwrite").objectStore("aud").delete(id)}catch(e){}}

/* ---------- toast / points ---------- */
let toastT;
function toast(msg,bad){msg=T(msg);const t=$("toast");t.textContent=msg;t.className="show"+(bad?" bad":"");clearTimeout(toastT);toastT=setTimeout(()=>{t.className=""},2600)}
function addPts(n,why){S.pts+=n;const d=new Date().toISOString().slice(0,10);if(!S.days.includes(d)){S.days.push(d);if(S.days.length>400)S.days.shift()}
  save();bump(n,why);checkBadges();paintScore()}
function bump(n,why){const b=$("bump");b.textContent="+"+n+" "+why;b.className="";void b.offsetWidth;b.className="go"}

/* ---------- the map model ---------- */
function allHubs(){const h=SEED.map(x=>({id:x.id,en:x.en,seed:true})).concat(S.hubs);
  if(S.words.some(w=>w.var==="misc"))h.push({id:"other",en:"More words"});return h}
function allVars(){const v=[];SEED.forEach(h=>h.vars.forEach(x=>v.push({id:x.id,hub:h.id,en:x.en,w:x.w})));
  return v.concat(S.vars.map(x=>({id:x.id,hub:x.hub,en:x.en,w:{}})),S.words.some(w=>w.var==="misc")?[{id:"misc",hub:"other",en:"My extras",w:{}}]:[])}
const varById=id=>allVars().find(v=>v.id===id);
const hubById=id=>allHubs().find(h=>h.id===id);
/* names on the map in the player's own language, English when there's nothing better */
const clean=t=>String(t).replace(/^[¡¿\s]+|[!?！？。.\s]+$/g,"");
function hubLabel(h){const m=S.me.lang;if(!m||m==="en")return T(h.en);
  if(HUBN[m]&&HUBN[m][h.id])return HUBN[m][h.id];
  const v=allVars().find(v=>v.hub===h.id&&v.w[m]);return v?clean(split(v.w[m])[0]):T(h.en)}
function varLabel(v){const m=S.me.lang;return m&&m!=="en"&&v.w[m]?split(v.w[m])[0]:T(v.en)}
function soundsLike(vid,lang,ro){if(ro)return ro;if(RO[lang]&&RO[lang][vid])return RO[lang][vid];
  const m=S.me.lang;if(lang==="en"&&EN_SOUND[m]&&EN_SOUND[m][vid])return EN_SOUND[m][vid];return""}
function split(t){const i=String(t).indexOf("|");return i<0?[t,""]:[t.slice(0,i),t.slice(i+1)]}
const isLearned=(vid,lang)=>lang===S.me.lang||!!S.learned[vid+"|"+lang];
/* every word on a branch: built-in ones (locked until learned) and ones added by me or friends */
function leavesOf(v){const out=[];
  for(const l in v.w){const[w,ro]=split(v.w[l]);out.push({t:"leaf",key:v.id+"|"+l,var:v.id,lang:l,w,ro:soundsLike(v.id,l,ro),seed:true,learned:isLearned(v.id,l)})}
  S.words.filter(x=>x.var===v.id).forEach(x=>out.push({t:"leaf",key:"u:"+x.id,var:v.id,lang:x.lang,w:x.w,ro:soundsLike(v.id,x.lang,x.ro||""),uid:x.id,by:x.by,from:x.from,learned:true}));
  const order=l=>l===S.me.lang?0:l==="en"?1:2;
  out.sort((a,b)=>order(a.lang)-order(b.lang)||SN(a.lang).localeCompare(SN(b.lang)));
  return out}

/* radial layout: each level is a smaller ring around its parent, so zooming in reveals the next level.
   A branch's words sit on an upright oval, which suits a phone held upright. */
const LEAF_R=34,LEAF_CR=57,ARC=5.2,OVAL=1.45,HUB_R=300,ROOT_R=330;
let TREE=null,NODES={};
function build(){
  NODES={};
  const root={t:"root",id:"root",kids:[]};
  allHubs().forEach(h=>{const hn={t:"hub",id:"h:"+h.id,hub:h.id,en:hubLabel(h),c:HUBC[h.id]||"#b388ff",kids:[]};
    allVars().filter(v=>v.hub===h.id).forEach(v=>{const vn={t:"var",id:"v:"+v.id,var:v.id,en:varLabel(v),c:hn.c,kids:leavesOf(v)};
      vn.kids.forEach(l=>{l.id="l:"+l.key;l.c=hn.c});
      vn.kids.push({t:"add",id:"a:"+v.id,var:v.id,c:hn.c});
      hn.kids.push(vn)});
    root.kids.push(hn)});
  // spacing so that neighbours on a ring never overlap
  const chordR=(k,cr,arc)=>k<2?0:cr*1.08/Math.sin(arc/(2*k));
  root.kids.forEach(h=>{
    h.kids.forEach(v=>{const k=v.kids.length;
      // oval perimeter is about 7.82 x the short radius; only ARC of it is used
      v.pw=Math.max(220,v.en.length*30+70);v.ring=Math.max(230,k*2*LEAF_CR*1.05/(7.82*ARC/(2*Math.PI)));v.ry=v.ring*OVAL;v.size=v.ry+LEAF_CR+24});
    const cr=Math.max(300,...h.kids.map(v=>v.size));
    h.ring=Math.max(cr+HUB_R+40,chordR(h.kids.length,cr,ARC));h.size=h.ring+cr});
  const hs=Math.max(...root.kids.map(h=>h.size));
  root.ring=Math.max(hs+ROOT_R,chordR(root.kids.length,hs,Math.PI*2));root.size=root.ring+hs;
  const place=(n,x,y,dir)=>{n.x=x;n.y=y;n.dir=dir;NODES[n.id]=n;if(!n.kids)return;const k=n.kids.length;
    if(n.t==="var"){
      // equal steps along the oval, leaving a gap towards the parent
      const N=400,pts=[];let L=0,px=null,py=null;
      for(let i=0;i<=N;i++){const t=dir-ARC/2+ARC*i/N,qx=Math.cos(t)*n.ring,qy=Math.sin(t)*n.ry;if(px!==null)L+=Math.hypot(qx-px,qy-py);pts.push([qx,qy,L]);px=qx;py=qy}
      n.kids.forEach((c,i)=>{c.parent=n;const want=L*(i+.5)/k;let j=0;while(j<N&&pts[j][2]<want)j++;
        const a=Math.atan2(pts[j][1],pts[j][0]);place(c,x+pts[j][0],y+pts[j][1],a)});return}
    n.kids.forEach((c,i)=>{c.parent=n;const a=n.t==="root"?-Math.PI/2+i*2*Math.PI/k:(k===1?dir:dir-ARC/2+ARC*(i+.5)/k);
      place(c,x+Math.cos(a)*n.ring,y+Math.sin(a)*n.ring,a)})};
  place(root,0,0,0);
  TREE=root}
function progress(n){let all=0,got=0;const walk=x=>{if(x.t==="leaf"){all++;if(x.learned)got++}(x.kids||[]).forEach(walk)};walk(n);return[got,all]}

/* ---------- drawing ---------- */
function txt(x,y,s,cls,extra){return`<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" class="${cls}" ${extra||""}>${esc(s)}</text>`}
/* hub and branch labels sit in groups that grow when zoomed far out, so they stay readable */
const lab=(n,cls,inner)=>`<g class="lab ${cls}" data-x="${n.x.toFixed(1)}" data-y="${n.y.toFixed(1)}" transform="translate(${n.x.toFixed(1)},${n.y.toFixed(1)})">${inner}</g>`;
function draw(){
  build();const E=[],N=[];
  const edge=(a,b,w,c)=>E.push(`<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${c}" stroke-width="${w}" class="e${a.t}"/>`);
  const r=TREE;
  r.kids.forEach(h=>{edge(r,h,16,h.c);h.kids.forEach(v=>{edge(h,v,7,v.c);v.kids.forEach(l=>edge(v,l,2.5,l.c))})});
  // leaves first so bigger nodes sit on top
  r.kids.forEach(h=>h.kids.forEach(v=>v.kids.forEach(l=>{
    if(l.t==="add"){N.push(`<g data-n="${l.id}" class="nadd"><circle cx="${l.x.toFixed(1)}" cy="${l.y.toFixed(1)}" r="${LEAF_R}" fill="#07070f" stroke="${l.c}" stroke-width="3" stroke-dasharray="6 5"/>${txt(l.x,l.y+13,"＋","lf")}${txt(l.x,l.y+LEAF_R+20,T("Add a word"),"ln")}</g>`);return}
    const lk=!l.learned;
    N.push(`<g data-n="${l.id}" class="nleaf${lk?" lk":""}"><circle cx="${l.x.toFixed(1)}" cy="${l.y.toFixed(1)}" r="${LEAF_R}" fill="${lk?"#101024":"#1f1f3d"}" stroke="${lk?"#5a5a99":l.c}" stroke-width="${lk?2.5:4}" ${lk?'stroke-dasharray="7 5"':""}/>`+
      txt(l.x,l.y+11,LG(l.lang).f,"lf")+(lk?txt(l.x+22,l.y-17,"🔒","lq"):"")+txt(l.x,l.y+LEAF_R+20,SN(l.lang),"ln")+
      (lk?"":txt(l.x,l.y+LEAF_R+38,l.w.length>13?l.w.slice(0,12)+"…":l.w,"lw"))+`</g>`)})));
  r.kids.forEach(h=>h.kids.forEach(v=>{const[g,a]=progress(v);const w=v.pw;
    N.push(`<g data-n="${v.id}" class="nvar">`+lab(v,"lv",`<rect x="${-w/2}" y="-50" width="${w}" height="100" rx="50" fill="#16162a" stroke="${v.c}" stroke-width="8"/>`+
      txt(0,2,v.en,"vt")+txt(0,36,T("{0} of {1} learned",g,a),"vp"))+`</g>`)}));
  r.kids.forEach(h=>{const[g,a]=progress(h);
    N.push(`<g data-n="${h.id}" class="nhub"><circle cx="${h.x.toFixed(1)}" cy="${h.y.toFixed(1)}" r="${HUB_R}" fill="#16162a" stroke="${h.c}" stroke-width="22"/>`+
      lab(h,"lh",txt(0,40,h.en,"ht",`fill="${h.c}"`)+txt(0,120,g+" / "+a,"hp"))+`</g>`)});
  N.push(`<g data-n="root" class="nroot"><circle cx="0" cy="0" r="${ROOT_R}" fill="#1f1f3d" stroke="#ffd23f" stroke-width="22"/>${lab({x:0,y:0},"lh",txt(0,-10,"🫙","rt1")+txt(0,130,"Swear Jar","rt2"))}</g>`);
  $("world").innerHTML=E.join("")+N.join("");
  LASTS={};applyCam()}

/* ---------- camera: drag to move, pinch or wheel to zoom, tap to zoom into a node ---------- */
let CAM={x:0,y:0,k:.1},FOCUS="root",ANIM=0,LASTS={};
function vp(){const r=$("map").getBoundingClientRect();return{w:r.width||360,h:(r.height||600)-70}}
function applyCam(){$("world").setAttribute("transform",`translate(${CAM.x.toFixed(1)},${CAM.y.toFixed(1)}) scale(${CAM.k.toFixed(4)})`);
  const k=CAM.k,m=$("map");m.classList.toggle("z1",k>=.1);m.classList.toggle("z2",k>=.3);m.classList.toggle("z3",k>=.5);m.classList.toggle("z4",k>=.9);
  // keep hub names at least 22px and branch names at least 17px on screen
  const sc={lh:Math.max(1,22/(150*k)),lv:Math.max(1,17/(60*k))};
  for(const c in sc){const v=Math.round(sc[c]*50)/50;if(LASTS[c]===v)continue;LASTS[c]=v;
    document.querySelectorAll("#world ."+c).forEach(g=>g.setAttribute("transform",`translate(${g.dataset.x},${g.dataset.y}) scale(${v})`))}
  $("mBack").disabled=FOCUS==="root"}
function camFor(n){const{w,h}=vp();let rx,ry;
  if(n.t==="root"){rx=ry=n.ring+HUB_R*.8}
  else if(n.t==="hub"){rx=ry=n.size}
  else if(n.t==="var"){rx=Math.max(n.ring+LEAF_CR+10,n.pw/2+20);ry=n.ry+LEAF_CR+30}
  else{rx=ry=LEAF_CR*3}
  const k=Math.min(6,w/(2*rx),h/(2*ry));return{k,x:w/2-n.x*k,y:h/2-n.y*k}}
function flyTo(n,instant){FOCUS=n.id;const to=camFor(n),from={...CAM},t0=performance.now(),D=instant?0:520;cancelAnimationFrame(ANIM);
  const step=t=>{const p=D?Math.min(1,(t-t0)/D):1,e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    // zoom in log space so it feels even
    const k=Math.exp(Math.log(from.k)+(Math.log(to.k)-Math.log(from.k))*e);
    const{w,h}=vp();const cx0=(w/2-from.x)/from.k,cy0=(h/2-from.y)/from.k,cx1=(w/2-to.x)/to.k,cy1=(h/2-to.y)/to.k;
    const cx=cx0+(cx1-cx0)*e,cy=cy0+(cy1-cy0)*e;CAM={k,x:w/2-cx*k,y:h/2-cy*k};applyCam();if(p<1)ANIM=requestAnimationFrame(step)};
  ANIM=requestAnimationFrame(step)}
function zoomAt(f,sx,sy){const k=Math.max(.03,Math.min(6,CAM.k*f));const r=k/CAM.k;CAM.x=sx-(sx-CAM.x)*r;CAM.y=sy-(sy-CAM.y)*r;CAM.k=k;applyCam()}
function goUp(){const n=NODES[FOCUS];flyTo(n&&n.parent?n.parent:TREE)}
function tapNode(id){const n=NODES[id];if(!n)return;
  if(n.t==="root"){flyTo(n);return}
  if(n.t==="leaf"){if(NODES[FOCUS]!==n.parent)flyTo(n.parent);openLeaf(n);return}
  if(n.t==="add"){if(NODES[FOCUS]!==n.parent)flyTo(n.parent);openEditor(null,{by:"me",var:n.var});return}
  if(FOCUS===id){goUp();return}
  flyTo(n)}
function wireMap(){
  const m=$("map"),P=new Map();let start=null,moved=0,pinch=null;
  m.addEventListener("pointerdown",e=>{$("mhint").hidden=true;m.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY});cancelAnimationFrame(ANIM);
    if(P.size===1){start={x:e.clientX,y:e.clientY,t:Date.now()};moved=0}else{moved=99;pinch=null}});
  m.addEventListener("pointermove",e=>{if(!P.has(e.pointerId))return;const p=P.get(e.pointerId),dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
    if(P.size===1){moved+=Math.abs(dx)+Math.abs(dy);if(moved>8){CAM.x+=dx;CAM.y+=dy;applyCam()}}
    else if(P.size===2){const[a,b]=[...P.values()],d=Math.hypot(a.x-b.x,a.y-b.y),r=m.getBoundingClientRect(),mx=(a.x+b.x)/2-r.left,my=(a.y+b.y)/2-r.top;
      if(pinch){zoomAt(d/pinch.d,mx,my);CAM.x+=mx-pinch.mx;CAM.y+=my-pinch.my;applyCam()}pinch={d,mx,my}}});
  const up=e=>{if(!P.has(e.pointerId))return;P.delete(e.pointerId);if(P.size<2)pinch=null;
    if(P.size===0&&start&&moved<=8&&Date.now()-start.t<700){const el=document.elementFromPoint(e.clientX,e.clientY);const g=el&&el.closest&&el.closest("[data-n]");if(g)tapNode(g.dataset.n)}
    if(P.size===0)start=null};
  m.addEventListener("pointerup",up);m.addEventListener("pointercancel",up);
  m.addEventListener("wheel",e=>{e.preventDefault();const r=m.getBoundingClientRect();zoomAt(Math.exp(-e.deltaY*.0015),e.clientX-r.left,e.clientY-r.top)},{passive:false});
  $("mBack").onclick=goUp;$("mHome").onclick=()=>flyTo(TREE);$("mAdd").onclick=()=>{const n=NODES[FOCUS];openEditor(null,{by:"me",var:n&&n.t==="var"?n.var:""})};
  window.addEventListener("resize",()=>{if(S.tab==="map")flyTo(NODES[FOCUS]||TREE,true)})}

/* ---------- leaf card ---------- */
let CARD=null;
function openLeaf(l){CARD=l;const v=varById(l.var);
  $("cdFlag").textContent=LG(l.lang).f;$("cdLang").textContent=LN(l.lang);$("cdMean").textContent=v?varLabel(v):"";$("cdHeard").textContent="";
  paintCard();$("cd").showModal()}
function paintCard(){const l=CARD;
  $("cdWord").textContent=l.learned?l.w:"🔒";$("cdRoT").textContent=l.learned?l.ro:"";$("cdRo").hidden=!l.learned||!l.ro;
  $("cdFrom").textContent=l.uid?(l.by==="friend"&&l.from?T("Taught by {0}",l.from):T("Added by you")):"";$("cdFrom").hidden=!l.uid;
  $("cdLearn").hidden=l.learned;$("cdPractice").hidden=!l.learned;$("cdHeard").textContent="";$("cdEdit").hidden=!l.uid;
  const next=nextLocked(l);$("cdNext").hidden=!next;$("cdNext").textContent=next?T("Next: {0} ➜",LG(next.lang).f+" "+SN(next.lang)):""}
function nextLocked(l){const v=NODES["v:"+l.var];if(!v)return null;const k=v.kids.filter(x=>x.t==="leaf"&&!x.learned&&x!==l);return k[0]||null}
function learn(){const l=CARD;if(!l||l.learned)return;S.learned[l.key]=Date.now();l.learned=true;save();paintCard();
  playLeaf(l);addPts(PTS.learn,T("learned {0}",SN(l.lang)));const keep=l.key;draw();CARD=NODES["l:"+keep]||l}
function playLeaf(l,slow){if(l.uid&&!slow){const w=S.words.find(x=>x.id===l.uid);if(w)return playWord(w)}speak(l.w,l.lang,slow)}
/* practice: say the word into the mic and the phone checks it. The mic must start inside the tap on iPhone. */
const norm=t=>String(t).toLowerCase().normalize("NFC").replace(/[\s.,!?¡¿'"“”‘’、。！？，…-]/g,"");
function similar(a,b){a=norm(a);b=norm(b);if(!a||!b)return 0;if(a===b)return 1;const m=a.length,n=b.length,d=Array.from({length:m+1},(_,i)=>[i]);
  for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return 1-d[m][n]/Math.max(m,n)}
let LISTEN=null;
function sayIt(){const l=CARD;if(!l)return;const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast("This phone can't listen. Try Safari or Chrome",true);return}
  if(LISTEN){try{LISTEN.stop()}catch(e){}return}
  try{speechSynthesis.cancel()}catch(e){}
  const r=new SR();r.lang=LG(l.lang).tts;r.interimResults=false;r.maxAlternatives=5;LISTEN=r;let got=false;
  const b=$("cdSay");b.classList.add("rec");$("cdHeard").textContent=T("Listening… say it now");$("cdHeard").className="";
  r.onresult=e=>{got=true;const alts=[...e.results[0]].map(x=>x.transcript);let best=alts[0]||"",sc=0;
    alts.forEach(t=>{const v=Math.max(similar(t,l.w),l.ro?similar(t,l.ro):0);if(v>sc){sc=v;best=t}});
    if(sc>=.75){$("cdHeard").textContent=T("✓ Nailed it!")+"  "+T("Heard: {0}",best);$("cdHeard").className="ok";
      S.said=S.said||{};if(!S.said[l.key]){S.said[l.key]=Date.now();save();addPts(PTS.nailed,T("said it right"))}}
    else{$("cdHeard").textContent=(sc>=.45?T("Close! Try again"):"✗")+"  "+T("Heard: {0}",best);$("cdHeard").className="bad"}};
  r.onerror=()=>{};
  r.onend=()=>{LISTEN=null;b.classList.remove("rec");if(!got){$("cdHeard").textContent=T("Didn't hear anything. Try again");$("cdHeard").className="bad"}};
  try{r.start()}catch(e){LISTEN=null;b.classList.remove("rec")}}

/* ---------- badges ---------- */
const nLearned=()=>Object.keys(S.learned).length+S.words.length;
const BADGES=[
{id:"first",n:"First word",d:"Learn or add your first word",ic:"🌱",t:()=>nLearned()>=1},
{id:"ten",n:"Potty mouth",d:"10 words learned",ic:"🧺",t:()=>nLearned()>=10},
{id:"fifty",n:"Walking dictionary",d:"50 words learned",ic:"📚",t:()=>nLearned()>=50},
{id:"lang3",n:"World traveller",d:"Words in 3 foreign languages",ic:"🌍",t:()=>foreignLangs()>=3},
{id:"lang6",n:"Globetrotter",d:"Words in 6 foreign languages",ic:"✈️",t:()=>foreignLangs()>=6},
{id:"full",n:"Full set",d:"Learn every language on one branch",ic:"🎯",t:()=>TREE&&TREE.kids.some(h=>h.kids.some(v=>{const[g,a]=progress(v);return a>1&&g===a}))},
{id:"mapper",n:"Map maker",d:"Add a new language to a branch",ic:"🗺️",t:()=>S.words.some(w=>{const v=varById(w.var);return v&&!v.w[w.lang]})},
{id:"grow",n:"Tree grower",d:"Start a new branch",ic:"🌳",t:()=>S.vars.length>=1},
{id:"swap1",n:"First swap",d:"Swap words with a friend",ic:"🤝",t:()=>S.swaps>=1},
{id:"swap10",n:"Bad influence",d:"10 words learned from friends",ic:"😈",t:()=>S.words.filter(w=>w.by==="friend").length>=10},
{id:"mic",n:"Voice of the people",d:"Record 5 words",ic:"🎙️",t:()=>S.words.filter(w=>w.aud).length>=5},
{id:"talk5",n:"Smooth talker",d:"Say it right 5 times",ic:"🗣️",t:()=>Object.keys(S.said||{}).length>=5},
{id:"quiz10",n:"Quiz shark",d:"10 quiz answers right",ic:"🦈",t:()=>S.quizRight>=10},
{id:"days3",n:"Regular",d:"Play on 3 different days",ic:"📅",t:()=>S.days.length>=3}];
function foreignLangs(){const s=new Set();Object.keys(S.learned).forEach(k=>s.add(k.split("|")[1]));S.words.forEach(w=>s.add(w.lang));s.delete(S.me.lang);return s.size}
function checkBadges(){for(const b of BADGES){if(!S.badges.includes(b.id)&&b.t()){S.badges.push(b.id);save();setTimeout(()=>toast(T("🏅 Badge: {0}",T(b.n))),900)}}}

/* ---------- speech ---------- */
let VOICES=[];
function loadVoices(){try{VOICES=speechSynthesis.getVoices()||[]}catch(e){}}
try{loadVoices();speechSynthesis.onvoiceschanged=loadVoices}catch(e){}
function speak(text,lang,slow){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const t=LG(lang).tts;u.lang=t;
  const v=VOICES.find(v=>v.lang.replace("_","-")===t)||VOICES.find(v=>v.lang.slice(0,2)===t.slice(0,2));if(v)u.voice=v;u.rate=slow?.5:.85;speechSynthesis.speak(u)}catch(e){toast("This phone can't speak that language",true)}}
let PLAYING=null;
async function playWord(w){
  if(w.aud){const b=await audGet(w.id);if(b){try{if(PLAYING)PLAYING.pause();const a=new Audio(URL.createObjectURL(b));PLAYING=a;await a.play();return}catch(e){}}}
  speak(w.w,w.lang)}

/* recorder: tap to start, tap again to stop (max 6 seconds) */
let REC=null;
async function recToggle(btn,done){
  if(REC){REC.stop();return}
  if(!navigator.mediaDevices||!window.MediaRecorder){toast("Recording isn't available on this phone",true);return}
  let st;try{st=await navigator.mediaDevices.getUserMedia({audio:true})}catch(e){toast("Allow the microphone to record",true);return}
  const types=["audio/mp4","audio/webm;codecs=opus","audio/webm"];const mt=types.find(t=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t));
  const r=mt?new MediaRecorder(st,{mimeType:mt}):new MediaRecorder(st);const parts=[];REC=r;
  r.ondataavailable=e=>{if(e.data&&e.data.size)parts.push(e.data)};
  r.onstop=()=>{st.getTracks().forEach(t=>t.stop());REC=null;btn.classList.remove("rec");btn.querySelector("span").textContent=T("Record again");clearTimeout(r._t);
    const b=new Blob(parts,{type:r.mimeType||mt||"audio/mp4"});done(b.size>800?b:null)};
  r.start();btn.classList.add("rec");btn.querySelector("span").textContent=T("Stop recording");r._t=setTimeout(()=>{if(r.state==="recording")r.stop()},6000)}

/* ---------- translate (Google, same free address Speakeasy uses) ---------- */
async function trans(q,from,to){
  const ac=new AbortController();const tm=setTimeout(()=>ac.abort(),9000);
  try{const r=await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl="+encodeURIComponent(from)+"&tl="+encodeURIComponent(to)+"&q="+encodeURIComponent(q),{signal:ac.signal});
    const j=await r.json();return(j[0]||[]).map(s=>s[0]||"").join("").trim()}
  finally{clearTimeout(tm)}}

/* ---------- add / edit a word ---------- */
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function branchOptions(sel){let h="";
  allHubs().forEach(hb=>{const hl=hubLabel(hb);h+=`<optgroup label="${esc(hl)}">`+allVars().filter(v=>v.hub===hb.id).map(v=>`<option value="${v.id}" ${v.id===sel?"selected":""}>${esc(varLabel(v))}</option>`).join("")+
    (hb.id==="other"?"":`<option value="new:${hb.id}">${esc(T("➕ New branch under {0}",hl))}</option>`)+`</optgroup>`});
  return h+`<optgroup label="${esc(T("Something else"))}"><option value="newhub" ${sel==="newhub"?"selected":""}>${esc(T("➕ A brand-new idea"))}</option></optgroup>`}
let ED=null,EDBLOB=null;
function openEditor(w,ctx){
  ED={w:w||null,ctx:ctx||{by:"me"}};EDBLOB=null;
  const lang=w?w.lang:(ED.ctx.lang||S.me.lang||"en");
  $("edTitle").textContent=w?T("Edit word"):ED.ctx.by==="friend"?T("{0} teaches you",S.friend.name||T("Your friend")):ED.ctx.title||T("Add a word");
  $("edHint").textContent=w?"":ED.ctx.hint||"";$("edHint").hidden=!$("edHint").textContent;
  $("edBranch").innerHTML=branchOptions(w?w.var:(ED.ctx.var||"newhub"));
  $("edWord").value=w?w.w:"";$("edMean").value=w?w.mean||"":"";$("edLang").value=lang;$("edNote").value=w?w.note||"":"";$("edRo").value=w?w.ro||"":"";
  setRude(w?w.rude:3);setKind(w?w.kind:"swear");branchChanged();
  const rb=$("edRec");rb.classList.remove("rec");rb.querySelector("span").textContent=T(w&&w.aud?"Record again":"Record how it sounds");
  $("edPlayRec").hidden=!(w&&w.aud);$("edRecRow").hidden=!!ED.ctx.noRec;$("edDel").hidden=!w;
  $("edLangRow").hidden=!!ED.ctx.lockLang&&!w;$("edLangFixed").hidden=!$("edLangRow").hidden;$("edLangFixed").textContent=T("Language: {0}",LN(lang));
  $("ed").showModal();setTimeout(()=>$("edWord").focus(),60)}
function branchChanged(){const b=$("edBranch").value,nw=b==="newhub"||b.startsWith("new:");
  $("edMeanLbl").textContent=T(nw?"What it means (this names the new branch)":"What it means (optional)")}
function setRude(n){$("edRude").dataset.v=n;[...$("edRude").children].forEach((b,i)=>b.classList.toggle("on",i<n));$("edRudeTxt").textContent=T(["","Mild","Cheeky","Rude","Very rude","Nuclear"][n])}
function setKind(k){$("edKind").dataset.v=k;[...$("edKind").children].forEach(b=>b.classList.toggle("on",b.dataset.k===k))}
/* turns the branch choice into a branch id, creating a new branch or idea when asked */
function resolveBranch(b,mean){
  if(b==="newhub"){const id="c"+uid();S.hubs.push({id,en:mean.replace(/[!?.]+$/,"").slice(0,24)});S.vars.push({id:"v"+id,hub:id,en:mean.slice(0,40)});return{id:"v"+id,fresh:true}}
  if(b.startsWith("new:")){const id="v"+uid();S.vars.push({id,hub:b.slice(4),en:mean.slice(0,40)});return{id,fresh:true}}
  return{id:b,fresh:false}}
async function saveEditor(){
  const word=$("edWord").value.trim();if(!word){toast("Type the word first",true);$("edWord").focus();return}
  const lang=$("edLang").value,mean=$("edMean").value.trim(),b=$("edBranch").value;
  if((b==="newhub"||b.startsWith("new:"))&&!mean){toast("Type what it means: that names the new branch",true);$("edMean").focus();return}
  const rude=+$("edRude").dataset.v||3,kind=$("edKind").dataset.v||"swear",note=$("edNote").value.trim(),ro=$("edRo").value.trim();
  let w=ED.w,fresh=false;
  const dupe=x=>x!==w&&x.lang===lang&&x.w.toLowerCase()===word.toLowerCase();
  if(S.words.some(dupe)){toast("Already on your map",true);return}
  const br=resolveBranch(b,mean);const v=varById(br.id);
  if(!w&&v&&v.w[lang]&&split(v.w[lang])[0].toLowerCase()===word.toLowerCase()){
    // it's a built-in word: just unlock it
    S.learned[br.id+"|"+lang]=Date.now();save();$("ed").close();draw();addPts(PTS.learn,T("learned {0}",SN(lang)));return}
  if(!w){w={id:uid(),ts:Date.now(),by:ED.ctx.by||"me",from:ED.ctx.by==="friend"?S.friend.name:""};S.words.push(w);fresh=true}
  const newLang=fresh&&v&&!v.w[lang]&&!S.words.some(x=>x!==w&&x.var===br.id&&x.lang===lang);
  Object.assign(w,{w:word,lang,mean:mean||(v?v.en:""),rude,kind,note,ro,var:br.id});
  if(EDBLOB){if(await audPut(w.id,EDBLOB))w.aud=true}
  if(S.share&&ED.ctx.by!=="teach")queueShare(w);
  save();$("ed").close();draw();
  if(ED.ctx.onSaved)ED.ctx.onSaved(w,fresh);
  if(fresh){const by=ED.ctx.by;let n=by==="friend"?PTS.friend:by==="teach"?PTS.teach:PTS.add,why=T(by==="friend"?"learned a word":by==="teach"?"taught a word":"new word");
    if(br.fresh){n+=PTS.branch;why=T("new branch!")}else if(newLang&&by!=="teach"){n+=PTS.newlang;why=T("new language on the map!")}
    addPts(n,why);if(S.tab==="map"&&by!=="teach")setTimeout(()=>{const vn=NODES["v:"+br.id];if(vn)flyTo(vn)},300)}
  else toast("✓ Saved")}

/* ---------- swap (two people, one phone, then QR to the friend's phone) ---------- */
let SESSION={learned:[],taught:[]};
function renderSwap(){
  const ok=S.friend.lang&&S.me.lang;
  if(document.activeElement!==$("swFriendName"))$("swFriendName").value=S.friend.name||"";$("swFriendLang").value=S.friend.lang||"";
  $("swSteps").hidden=!ok;$("swNeed").hidden=!!ok;
  if(!ok)return;
  const fn=S.friend.name||T("Your friend");
  $("swLearnBtn").innerHTML=`👂 <b>${esc(T("{0} teaches me",fn))}</b><small>${esc(T("a word in {0}",LN(S.friend.lang)))}</small>`;
  $("swTeachBtn").innerHTML=`🗣️ <b>${esc(T("I teach {0}",fn))}</b><small>${esc(T("a word in {0}",LN(S.me.lang)))}</small>`;
  const L=SESSION.learned.map(id=>S.words.find(w=>w.id===id)).filter(Boolean),TG=SESSION.taught;
  const card=(w,c,play)=>`<div class="tile" style="--c:${c}"><div class="th">${esc(w.w)}</div><div class="en">${esc(w.mean||"")}</div>${play}</div>`;
  $("swLearned").innerHTML=L.length?`<div class="sec" style="--c:#4cc9f0">${esc(T("Learned this swap"))} (${L.length})</div><div class="grid">${L.map(w=>card(w,"#4cc9f0",`<button class="ib play" data-play="${w.id}">${esc(T("🔊 Play"))}</button>`)).join("")}</div>`:"";
  $("swTaught").innerHTML=TG.length?`<div class="sec" style="--c:#ff9f1c">${esc(T("Taught this swap"))} (${TG.length})</div><div class="grid">${TG.map(w=>card(w,"#ff9f1c",`<button class="ib play" data-say="${encodeURIComponent(w.w)}" data-lang="${w.lang}">${esc(T("🔊 Play"))}</button>`)).join("")}</div>`:"";
  $("swSend").hidden=!TG.length;$("swSend").textContent=T("📲 Send {0} words to {1}",TG.length,fn).replace(/ 1 words/," 1 word")}
function swLearn(){
  openEditor(null,{by:"friend",lang:S.friend.lang,lockLang:true,hint:T("Hand the phone to {0}. They type a word, pick where it goes on the map, and record themselves saying it.",S.friend.name||T("your friend")),
    onSaved:(w,fresh)=>{if(!fresh)return;SESSION.learned.push(w.id);S.swaps++;save();renderSwap();checkBadges();setTimeout(()=>tryIt(w),400)}})}
/* the learner says the word back; the teacher judges */
function tryIt(w){$("tyWord").textContent=w.w;$("tyMean").textContent=w.mean||"";$("tyWho").textContent=T("Now you say it. {0} decides if you nailed it.",S.friend.name||T("Your friend"));
  $("ty").dataset.id=w.id;$("ty").showModal();playWord(w)}
function swTeach(){
  openEditor(null,{by:"teach",lang:S.me.lang,lockLang:true,noRec:true,title:T("Teach {0} a word",S.friend.name||T("your friend")),hint:T("Type a word in your language. It goes to your friend's phone when you tap Send."),
    onSaved:(w,fresh)=>{if(!fresh)return;
      // taught words stay off my own map: they belong to the friend
      S.words=S.words.filter(x=>x.id!==w.id);const v=varById(w.var),h=v&&hubById(v.hub);
      SESSION.taught.push({w:w.w,ro:w.ro||"",lang:w.lang,mean:w.mean,rude:w.rude,kind:w.kind,var:w.var,ven:v?v.en:"",hub:v?v.hub:"",hen:h?h.en:""});
      S.swaps++;save();draw();renderSwap();checkBadges()}})}

/* the share link carries the words in the address, so no server is needed */
function b64u(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function unb64u(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return decodeURIComponent(escape(atob(s)))}
function packLink(){const seedV=id=>SEED.some(h=>h.vars.some(v=>v.id===id));
  const p={f:S.me.name||"",l:S.me.lang,w:SESSION.taught.map(w=>seedV(w.var)?[w.w,w.mean,w.rude,w.kind[0],w.var]:[w.w,w.mean,w.rude,w.kind[0],w.var,w.ven,w.hub,w.hen])};
  return location.origin+location.pathname+"#w="+b64u(JSON.stringify(p))}
function sendWords(){
  const url=packLink();$("qrBox").innerHTML="";
  try{const q=qrcode(0,"L");q.addData(url);q.make();$("qrBox").innerHTML=q.createSvgTag({cellSize:6,margin:2,scalable:true})}catch(e){$("qrBox").innerHTML='<p class="note">'+esc(T("Too many words for one code. Use the Share button instead."))+'</p>'}
  $("qrWho").textContent=T("{0}: open your camera and point it at this code.",S.friend.name||T("Your friend"));
  $("qr").dataset.url=url;$("qr").showModal()}
async function shareLink(){const url=$("qr").dataset.url;
  try{if(navigator.share){await navigator.share({title:"Swear Jar",text:T("Words from {0}",S.me.name||T("your friend")),url});return}}catch(e){if(e&&e.name==="AbortError")return}
  try{await navigator.clipboard.writeText(url);toast("✓ Link copied")}catch(e){prompt(T("Copy this link"),url)}}
/* receiving: someone opened a share link */
function receive(){
  const m=location.hash.match(/#w=([A-Za-z0-9_-]+)/);if(!m)return false;
  let p;try{p=JSON.parse(unb64u(m[1]))}catch(e){toast("That link is broken",true);return false}
  history.replaceState(null,"",location.pathname);
  const KM={s:"slang",w:"swear",i:"insult",f:"funny"};let n=0;const lang=LG(p.l).c;
  for(const a of(p.w||[]).slice(0,60)){const w=String(a[0]||"").slice(0,80).trim();if(!w)continue;
    let vid=String(a[4]||"misc").slice(0,40);
    if(!varById(vid)){
      // a branch my friend made: make it here too
      const hid=String(a[6]||"other").slice(0,40);
      if(!hubById(hid))S.hubs.push({id:hid,en:String(a[7]||a[5]||"New idea").slice(0,24)});
      S.vars.push({id:vid,hub:hubById(hid)?hid:"other",en:String(a[5]||a[1]||w).slice(0,40)})}
    const v=varById(vid);
    if(v&&v.w[lang]&&split(v.w[lang])[0].toLowerCase()===w.toLowerCase()){if(!S.learned[vid+"|"+lang]){S.learned[vid+"|"+lang]=Date.now();n++}continue}
    if(S.words.some(x=>x.lang===lang&&x.w.toLowerCase()===w.toLowerCase()))continue;
    S.words.push({id:uid(),ts:Date.now(),by:"friend",from:String(p.f||"").slice(0,30),w,lang,var:vid,mean:String(a[1]||"").slice(0,160),rude:Math.max(1,Math.min(5,+a[2]||3)),kind:KM[a[3]]||"slang"});n++}
  S.swaps++;save();
  if(n)setTimeout(()=>addPts(n*PTS.friend,T("{0} words from {1}",n,p.f||T("a friend"))),500);else toast("You already have those words");
  return true}

/* ---------- quiz: what does this foreign word mean? ---------- */
let QZ=null;
function quizPool(){build();const out=[];TREE.kids.forEach(h=>h.kids.forEach(v=>v.kids.forEach(l=>{if(l.t==="leaf"&&l.learned&&l.lang!==S.me.lang)out.push({l,mean:v.en})})));return out}
function renderQuiz(){
  const pool=quizPool(),means=[...new Set(pool.map(x=>x.mean))];
  if(pool.length<4){$("qzBody").innerHTML=`<div class="empty">${esc(T("Learn at least 4 foreign words on the map to play."))}<br>${esc(T("You have {0}.",pool.length))}<br><br>${esc(T("Tap a 🔒 word on the map to learn it."))}</div>`;return}
  if(means.length<4){$("qzBody").innerHTML=`<div class="empty">${esc(T("Learn foreign words on at least 4 different branches to play (like Fuck off! or Bullshit!)."))}<br>${esc(T("You have {0}.",means.length))}<br><br>${esc(T("Tap a 🔒 word on the map to learn it."))}</div>`;return}
  const a=pool[Math.floor(Math.random()*pool.length)];
  const opts=[a.mean,...means.filter(m=>m!==a.mean).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
  QZ={a,done:false};
  const ml=m=>{const v=allVars().find(v=>v.en===m);return v?varLabel(v):m};
  $("qzBody").innerHTML=`<p class="qzq">${esc(T("What does this mean?"))}</p><div class="qzw">${esc(a.l.w)}</div>${a.l.ro?`<div class="qzro">${esc(T("Sounds like"))}: <b>${esc(a.l.ro)}</b></div>`:""}<small class="qzl">${LG(a.l.lang).f} ${esc(LN(a.l.lang))}</small>
    <button class="ib wide" data-qplay>${esc(T("🔊 Play it"))}</button>
    <div class="qzo">${opts.map(o=>`<button class="ib opt" data-ans="${esc(o)}">${esc(ml(o))}</button>`).join("")}</div>
    <button class="ib wide pri" id="qzNext" hidden>${esc(T("Next word ➜"))}</button>`;
  playLeaf(a.l)}
function answer(btn){if(!QZ||QZ.done)return;QZ.done=true;const right=btn.dataset.ans===QZ.a.mean;
  document.querySelectorAll("#qzBody .opt").forEach(b=>{if(b.dataset.ans===QZ.a.mean)b.classList.add("right")});
  if(right){S.quizRight++;addPts(PTS.quiz,T("right answer"))}else{btn.classList.add("wrong");const v=allVars().find(v=>v.en===QZ.a.mean);toast(T("It means: {0}",v?varLabel(v):QZ.a.mean),true)}
  $("qzNext").hidden=false}

/* ---------- score ---------- */
function paintScore(){$("hdrPts").textContent=S.pts+" "+T("pts")}
function renderScore(){build();
  const[g,a]=progress(TREE);
  const lvl=Math.floor(Math.sqrt(S.pts/50))+1,next=Math.pow(lvl,2)*50,prev=Math.pow(lvl-1,2)*50;
  const pct=Math.round((S.pts-prev)/(next-prev)*100);
  $("scBody").innerHTML=`<div class="big"><div class="pts">${S.pts}</div><div>${esc(T("points · Level {0}",lvl))}</div>
    <div class="bar"><i style="width:${pct}%"></i></div><small>${esc(T("{0} points to level {1}",next-S.pts,lvl+1))}</small></div>
    <div class="stats"><div><b>${g} / ${a}</b>${esc(T("words learned"))}</div><div><b>${foreignLangs()}</b>${esc(T("foreign languages"))}</div><div><b>${S.swaps}</b>${esc(T("swaps"))}</div><div><b>${S.quizRight}</b>${esc(T("quiz right"))}</div></div>
    <div class="sec" style="--c:#ff6b9d">${esc(T("Your jar"))}</div>
    ${TREE.kids.map(h=>{const[x,y]=progress(h);return`<div class="hrow"><b style="color:${h.c}">${esc(h.en)}</b><div class="bar"><i style="width:${y?Math.round(x/y*100):0}%;background:${h.c}"></i></div><span>${x} / ${y}</span></div>`}).join("")}
    <div class="sec" style="--c:#ffd23f">${esc(T("Badges ({0} of {1})",S.badges.length,BADGES.length))}</div>
    <div class="badges">${BADGES.map(b=>`<div class="badge ${S.badges.includes(b.id)?"got":""}"><span>${b.ic}</span><b>${esc(T(b.n))}</b><small>${esc(T(b.d))}</small></div>`).join("")}</div>
    <div class="sec" style="--c:#4cc9f0">${esc(T("How to score"))}</div>
    <div class="note">${esc(T("Learn a word on the map: {0} · Add a word: {1} · Add a new language to a branch: +{2} more · Start a new branch: +{3} more · Learn from a friend: {4} · Teach a friend: {5} · Say it right: {6} · Quiz answer right: {7}",PTS.learn,PTS.add,PTS.newlang,PTS.branch,PTS.friend,PTS.teach,PTS.nailed,PTS.quiz))}</div>`}

/* ---------- share to Speakeasy (off by default, anonymous) ---------- */
function queueShare(w){if(S.queue.some(q=>q.id===w.id))return;S.queue.push({id:w.id,w:w.w,lang:w.lang,mean:w.mean,rude:w.rude,kind:w.kind});if(S.queue.length>500)S.queue.shift();save();flushShare()}
async function flushShare(){
  if(!S.share||!SHARE_FORM||!S.queue.length||navigator.onLine===false)return;
  const batch=S.queue.slice(0,20);
  for(const q of batch){const fd=new URLSearchParams();for(const k in SHARE_FIELDS)if(SHARE_FIELDS[k])fd.append(SHARE_FIELDS[k],String(q[k]==null?"":q[k]));
    try{await fetch(SHARE_FORM,{method:"POST",mode:"no-cors",body:fd});S.queue=S.queue.filter(x=>x.id!==q.id)}catch(e){break}}
  save()}

/* ---------- settings / setup ---------- */
function langOptions(sel,blankTxt){return(blankTxt?`<option value="">${blankTxt}</option>`:"")+LANGS.map(l=>`<option value="${l.c}" ${l.c===sel?"selected":""}>${esc(LN(l.c))}</option>`).join("")}
function openSettings(first){
  applyStatic();$("stTitle").textContent=T(first?"Welcome to Swear Jar":"Settings");$("stIntro").hidden=!first;
  $("stName").value=S.me.name||"";$("stLang").innerHTML=langOptions(S.me.lang,T("Choose your language"));$("stShare").checked=!!S.share;
  $("stClose").textContent=T(first?"Let's go":"Done");$("stReset").hidden=!!first;$("st").showModal()}
function closeSettings(){
  const l=$("stLang").value;if(!l){toast("Choose your language",true);return}
  S.me.name=$("stName").value.trim().slice(0,30);S.me.lang=l;
  const was=S.share;S.share=$("stShare").checked;
  if(S.share&&!was){S.words.forEach(queueShare);toast("✓ Thanks! Your words help Speakeasy")}
  if(!S.share)S.queue=[];
  save();$("st").close();uiLang();go(S.tab,true)}
/* everything that shows words in the player's language */
function uiLang(){applyStatic();paintScore();
  $("edLang").innerHTML=langOptions("en");$("swFriendLang").innerHTML=langOptions(S.friend.lang||"",T("Choose their language"));
  $("edKind").innerHTML=KINDS.map(k=>`<button type="button" class="chip" style="--c:${k.c}" data-k="${k.k}">${esc(T(k.n))}</button>`).join("")}

/* ---------- tabs ---------- */
function layout(){const h=document.querySelector("header").getBoundingClientRect().bottom,n=document.querySelector("nav").getBoundingClientRect().height;
  document.documentElement.style.setProperty("--hh",h+"px");document.documentElement.style.setProperty("--nh",n+"px")}
function go(t,keepCam){S.tab=t;save();document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.tab===t));
  document.querySelectorAll("main>section").forEach(s=>s.hidden=s.id!=="tab-"+t);document.body.classList.toggle("onmap",t==="map");
  if(t==="map"){layout();draw();if(!keepCam||!NODES[FOCUS])flyTo(NODES[FOCUS]||TREE,true);else flyTo(NODES[FOCUS],true)}
  if(t==="swap")renderSwap();if(t==="quiz")renderQuiz();if(t==="score")renderScore();window.scrollTo(0,0)}

/* ---------- events ---------- */
function wire(){
  $("edRude").innerHTML=[1,2,3,4,5].map(i=>`<button type="button" class="chili" data-r="${i}" aria-label="${i} chillies">🌶️</button>`).join("");
  $("edRude").onclick=e=>{const b=e.target.closest("[data-r]");if(b)setRude(+b.dataset.r)};
  $("edKind").onclick=e=>{const b=e.target.closest("[data-k]");if(b)setKind(b.dataset.k)};
  $("edBranch").onchange=branchChanged;
  $("edRec").onclick=()=>recToggle($("edRec"),b=>{if(b){EDBLOB=b;$("edPlayRec").hidden=false;toast("✓ Recorded")}else toast("Nothing heard, try again",true)});
  $("edPlayRec").onclick=async()=>{const b=EDBLOB||(ED.w&&await audGet(ED.w.id));if(b){const a=new Audio(URL.createObjectURL(b));a.play().catch(()=>{})}};
  $("edSpeak").onclick=()=>{const w=$("edWord").value.trim();if(w)speak(w,$("edLang").value)};
  $("edTr").onclick=async()=>{const w=$("edWord").value.trim();if(!w){toast("Type the word first",true);return}
    const b=$("edTr");b.disabled=true;b.textContent=T("Translating…");
    try{const t=await trans(w,LG($("edLang").value).mm,S.me.lang?LG(S.me.lang).mm:"en");if(t){$("edMean").value=t;toast("Check it: slang often translates wrong")}else toast("No translation found",true)}catch(e){toast("No internet",true)}
    b.disabled=false;b.textContent=T("🌐 Translate")};
  $("edSave").onclick=saveEditor;$("edCancel").onclick=()=>{if(REC)REC.stop();$("ed").close()};
  $("edDel").onclick=()=>{if(!ED.w||!confirm(T("Delete “{0}”?",ED.w.w)))return;S.words=S.words.filter(x=>x!==ED.w);audDel(ED.w.id);save();$("ed").close();draw();toast("Deleted")};
  $("cdLearn").onclick=learn;$("cdPlay").onclick=()=>CARD&&playLeaf(CARD);$("cdSlow").onclick=()=>CARD&&playLeaf(CARD,true);$("cdSay").onclick=sayIt;$("cdClose").onclick=()=>{if(LISTEN)try{LISTEN.stop()}catch(e){}$("cd").close()};
  $("cdEdit").onclick=()=>{const w=CARD&&S.words.find(x=>x.id===CARD.uid);$("cd").close();if(w)openEditor(w)};
  $("cdNext").onclick=()=>{const n=CARD&&nextLocked(CARD);if(n){CARD=n;$("cdFlag").textContent=LG(n.lang).f;$("cdLang").textContent=LN(n.lang);paintCard()}};
  document.body.addEventListener("click",e=>{
    const p=e.target.closest("[data-play]");if(p){const w=S.words.find(x=>x.id===p.dataset.play);if(w)playWord(w);return}
    const s=e.target.closest("[data-say]");if(s){speak(decodeURIComponent(s.dataset.say),s.dataset.lang);return}
    const t=e.target.closest("nav [data-tab]");if(t){go(t.dataset.tab);return}
    const a=e.target.closest("[data-ans]");if(a){answer(a);return}
    if(e.target.closest("[data-qplay]")&&QZ){playLeaf(QZ.a.l);return}
    if(e.target.id==="qzNext"){renderQuiz();return}});
  $("swFriendName").oninput=()=>{S.friend.name=$("swFriendName").value.trim().slice(0,30);save();renderSwap()};
  $("swFriendLang").onchange=()=>{S.friend.lang=$("swFriendLang").value;save();renderSwap()};
  $("swLearnBtn").onclick=swLearn;$("swTeachBtn").onclick=swTeach;$("swSend").onclick=sendWords;
  $("qrShare").onclick=shareLink;$("qrClose").onclick=()=>$("qr").close();
  $("tyPlay").onclick=()=>{const w=S.words.find(x=>x.id===$("ty").dataset.id);if(w)playWord(w)};
  $("tyYes").onclick=()=>{$("ty").close();addPts(PTS.nailed,"nailed it")};
  $("tyNo").onclick=()=>{$("ty").close();toast("Keep practising!")};
  $("setBtn").onclick=()=>openSettings(false);$("stClose").onclick=closeSettings;
  $("stReset").onclick=()=>{if(!confirm(T("Delete ALL your words, points and badges?")))return;const me=S.me;S=blank();S.me=me;save();$("st").close();FOCUS="root";go("map");toast("Everything cleared")};
  $("st").addEventListener("cancel",e=>{if(!S.me.lang)e.preventDefault()});
  window.addEventListener("online",flushShare);
  wireMap()}

load();wire();uiLang();
const got=receive();
if(!S.me.lang)openSettings(true);
go(got?"map":S.tab||"map");paintScore();flushShare();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
