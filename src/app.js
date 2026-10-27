"use strict";
/* Swear Jar: collect slang, swear words and insults from friends, swap them face to face, earn points */
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const LANGS=[
{c:"en",n:"English",tts:"en-US",mm:"en"},
{c:"th",n:"Thai",tts:"th-TH",mm:"th"},{c:"vi",n:"Vietnamese",tts:"vi-VN",mm:"vi"},{c:"lo",n:"Lao",tts:"lo-LA",mm:"lo"},{c:"km",n:"Khmer",tts:"km-KH",mm:"km"},
{c:"zh",n:"Chinese (Mandarin)",tts:"zh-CN",mm:"zh-CN"},{c:"ja",n:"Japanese",tts:"ja-JP",mm:"ja"},{c:"ko",n:"Korean",tts:"ko-KR",mm:"ko"},
{c:"id",n:"Indonesian",tts:"id-ID",mm:"id"},{c:"ms",n:"Malay",tts:"ms-MY",mm:"ms"},{c:"tl",n:"Filipino",tts:"fil-PH",mm:"tl"},{c:"hi",n:"Hindi",tts:"hi-IN",mm:"hi"},
{c:"es",n:"Spanish",tts:"es-MX",mm:"es"},{c:"esp",n:"Spanish (Spain)",tts:"es-ES",mm:"es"},{c:"esa",n:"Spanish (Argentina)",tts:"es-AR",mm:"es"},{c:"fr",n:"French",tts:"fr-FR",mm:"fr"},{c:"de",n:"German",tts:"de-DE",mm:"de"},{c:"it",n:"Italian",tts:"it-IT",mm:"it"},
{c:"pt",n:"Portuguese",tts:"pt-BR",mm:"pt"},{c:"ru",n:"Russian",tts:"ru-RU",mm:"ru"},{c:"ar",n:"Arabic",tts:"ar-SA",mm:"ar"},{c:"uz",n:"Uzbek",tts:"uz-UZ",mm:"uz"},
{c:"zt",n:"Chinese (Taiwan)",tts:"zh-TW",mm:"zh-TW"},{c:"my",n:"Burmese",tts:"my-MM",mm:"my"},{c:"ta",n:"Tamil",tts:"ta-IN",mm:"ta"},{c:"bn",n:"Bengali",tts:"bn-BD",mm:"bn"},{c:"ur",n:"Urdu",tts:"ur-PK",mm:"ur"},{c:"fa",n:"Persian",tts:"fa-IR",mm:"fa"},{c:"tr",n:"Turkish",tts:"tr-TR",mm:"tr"},{c:"pl",n:"Polish",tts:"pl-PL",mm:"pl"},{c:"nl",n:"Dutch",tts:"nl-NL",mm:"nl"},{c:"sv",n:"Swedish",tts:"sv-SE",mm:"sv"},{c:"el",n:"Greek",tts:"el-GR",mm:"el"},{c:"he",n:"Hebrew",tts:"he-IL",mm:"he"},{c:"uk",n:"Ukrainian",tts:"uk-UA",mm:"uk"},{c:"ne",n:"Nepali",tts:"ne-NP",mm:"ne"},{c:"si",n:"Sinhala",tts:"si-LK",mm:"si"},{c:"mn",n:"Mongolian",tts:"mn-MN",mm:"mn"},{c:"kk",n:"Kazakh",tts:"kk-KZ",mm:"kk"},{c:"sw",n:"Swahili",tts:"sw-KE",mm:"sw"},{c:"cs",n:"Czech",tts:"cs-CZ",mm:"cs"},{c:"ro",n:"Romanian",tts:"ro-RO",mm:"ro"},{c:"hu",n:"Hungarian",tts:"hu-HU",mm:"hu"},
{c:"yue",n:"Cantonese",tts:"zh-HK",mm:"yue"},{c:"ceb",n:"Cebuano",tts:"ceb-PH",mm:"ceb"},{c:"jv",n:"Javanese",tts:"jv-ID",mm:"jw"},{c:"pa",n:"Punjabi",tts:"pa-IN",mm:"pa"},{c:"mr",n:"Marathi",tts:"mr-IN",mm:"mr"},{c:"te",n:"Telugu",tts:"te-IN",mm:"te"}];
const LG=c=>LANGS.find(l=>l.c===c)||LANGS[0];
const KINDS=[{k:"slang",n:"Slang",c:"#4cc9f0"},{k:"swear",n:"Swear word",c:"#ff6b6b"},{k:"insult",n:"Insult",c:"#ff9f1c"},{k:"funny",n:"Funny",c:"#7bd88f"}];
const KD=k=>KINDS.find(x=>x.k===k)||KINDS[0];
const PTS={add:10,learn:20,teach:20,nailed:10,quiz:5};

/* Google Form that receives shared words (left empty until Phil's form exists; shared words wait in a queue) */
const SHARE_FORM="";
const SHARE_FIELDS={w:"",lang:"",mean:"",rude:"",kind:""};

/* ---------- storage ---------- */
const KEY="swearjar.v1";
let S;
function blank(){return{me:{name:"",lang:""},friend:{name:"",lang:""},words:[],pts:0,badges:[],swaps:0,quizRight:0,share:false,queue:[],days:[],tab:"words",filter:"all"}}
function load(){try{S=Object.assign(blank(),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){S=blank()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){return false}}

/* recordings live in IndexedDB, keyed by word id */
let DBP=null;
function db(){if(!DBP)DBP=new Promise((ok,no)=>{try{const r=indexedDB.open("swearjar",1);r.onupgradeneeded=()=>r.result.createObjectStore("aud");r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}});return DBP}
async function audPut(id,blob){try{const d=await db();await new Promise((ok,no)=>{const t=d.transaction("aud","readwrite");t.objectStore("aud").put(blob,id);t.oncomplete=ok;t.onerror=()=>no(t.error)});return true}catch(e){return false}}
async function audGet(id){try{const d=await db();return await new Promise(ok=>{const r=d.transaction("aud").objectStore("aud").get(id);r.onsuccess=()=>ok(r.result||null);r.onerror=()=>ok(null)})}catch(e){return null}}
async function audDel(id){try{const d=await db();d.transaction("aud","readwrite").objectStore("aud").delete(id)}catch(e){}}

/* ---------- toast / points ---------- */
let toastT;
function toast(msg,bad){const t=$("toast");t.textContent=msg;t.className="show"+(bad?" bad":"");clearTimeout(toastT);toastT=setTimeout(()=>{t.className=""},2600)}
function addPts(n,why){S.pts+=n;const d=new Date().toISOString().slice(0,10);if(!S.days.includes(d)){S.days.push(d);if(S.days.length>400)S.days.shift()}
  save();bump(n,why);checkBadges();paintScore()}
function bump(n,why){const b=$("bump");b.textContent="+"+n+" "+why;b.className="";void b.offsetWidth;b.className="go"}

const BADGES=[
{id:"first",n:"First word",d:"Add your first word",ic:"🌱",t:()=>S.words.length>=1},
{id:"ten",n:"Potty collector",d:"10 words in your deck",ic:"🧺",t:()=>S.words.length>=10},
{id:"fifty",n:"Walking dictionary",d:"50 words in your deck",ic:"📚",t:()=>S.words.length>=50},
{id:"lang3",n:"World traveller",d:"Words in 3 languages",ic:"🌍",t:()=>new Set(S.words.map(w=>w.lang)).size>=3},
{id:"lang6",n:"Globetrotter",d:"Words in 6 languages",ic:"✈️",t:()=>new Set(S.words.map(w=>w.lang)).size>=6},
{id:"swap1",n:"First swap",d:"Swap words with a friend",ic:"🤝",t:()=>S.swaps>=1},
{id:"swap10",n:"Bad influence",d:"10 words learned from friends",ic:"😈",t:()=>S.words.filter(w=>w.by==="friend").length>=10},
{id:"hot",n:"Sailor mouth",d:"5 words at 5 chillies",ic:"🌶️",t:()=>S.words.filter(w=>w.rude>=5).length>=5},
{id:"mic",n:"Voice of the people",d:"Record 5 words",ic:"🎙️",t:()=>S.words.filter(w=>w.aud).length>=5},
{id:"quiz10",n:"Quiz shark",d:"10 quiz answers right",ic:"🦈",t:()=>S.quizRight>=10},
{id:"days3",n:"Regular",d:"Play on 3 different days",ic:"📅",t:()=>S.days.length>=3}];
function checkBadges(){for(const b of BADGES){if(!S.badges.includes(b.id)&&b.t()){S.badges.push(b.id);save();setTimeout(()=>toast("🏅 Badge: "+b.n),900)}}}

/* ---------- speech ---------- */
let VOICES=[];
function loadVoices(){try{VOICES=speechSynthesis.getVoices()||[]}catch(e){}}
try{loadVoices();speechSynthesis.onvoiceschanged=loadVoices}catch(e){}
function speak(text,lang){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const t=LG(lang).tts;u.lang=t;
  const v=VOICES.find(v=>v.lang.replace("_","-")===t)||VOICES.find(v=>v.lang.slice(0,2)===t.slice(0,2));if(v)u.voice=v;u.rate=.85;speechSynthesis.speak(u)}catch(e){toast("This phone can't speak that language",true)}}
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
  r.onstop=()=>{st.getTracks().forEach(t=>t.stop());REC=null;btn.classList.remove("rec");btn.querySelector("span").textContent="Record again";clearTimeout(r._t);
    const b=new Blob(parts,{type:r.mimeType||mt||"audio/mp4"});done(b.size>800?b:null)};
  r.start();btn.classList.add("rec");btn.querySelector("span").textContent="Stop recording";r._t=setTimeout(()=>{if(r.state==="recording")r.stop()},6000)}

/* ---------- translate (Google, same free address Speakeasy uses) ---------- */
async function trans(q,from,to){
  const ac=new AbortController();const tm=setTimeout(()=>ac.abort(),9000);
  try{const r=await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl="+encodeURIComponent(from)+"&tl="+encodeURIComponent(to)+"&q="+encodeURIComponent(q),{signal:ac.signal});
    const j=await r.json();return(j[0]||[]).map(s=>s[0]||"").join("").trim()}
  finally{clearTimeout(tm)}}

/* ---------- words ---------- */
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function chillies(n){return"🌶️".repeat(Math.max(1,Math.min(5,n||1)))}
function wordCard(w){const k=KD(w.kind);
  return`<div class="tile" style="--c:${k.c}" data-id="${w.id}">
    <div class="th">${esc(w.w)}</div>
    <div class="en">${esc(w.mean||"")}</div>
    <small>${esc(LG(w.lang).n)} · ${k.n}</small>
    <small class="hot">${chillies(w.rude)}</small>
    ${w.by==="friend"&&w.from?`<small class="from">from ${esc(w.from)}</small>`:""}
    <div class="trow"><button class="ib play" data-play="${w.id}" aria-label="Play">🔊 Play</button><button class="ib" data-edit="${w.id}">✏️ Edit</button></div></div>`}
function renderWords(){
  const langs=[...new Set(S.words.map(w=>w.lang))];
  const f=S.filter;const list=S.words.filter(w=>f==="all"||w.lang===f).slice().reverse();
  $("fchips").innerHTML=[`<button class="chip ${f==="all"?"on":""}" data-f="all">All (${S.words.length})</button>`].concat(langs.map(l=>`<button class="chip ${f===l?"on":""}" data-f="${l}">${esc(LG(l).n)} (${S.words.filter(w=>w.lang===l).length})</button>`)).join("");
  $("wgrid").innerHTML=list.length?list.map(wordCard).join(""):`<div class="empty">No words yet.<br>Tap <b>➕ Add a word</b> or swap with a friend.</div>`}

/* add / edit dialog. ctx: {by:'me'|'friend', lang, from, onSaved} */
let ED=null,EDBLOB=null;
function openEditor(w,ctx){
  ED={w:w||null,ctx:ctx||{by:"me"}};EDBLOB=null;
  const lang=w?w.lang:(ED.ctx.lang||S.me.lang||"en");
  $("edTitle").textContent=w?"Edit word":ED.ctx.by==="friend"?(S.friend.name||"Your friend")+" teaches you":ED.ctx.title||"Add a word";
  $("edHint").textContent=w?"":ED.ctx.hint||"";$("edHint").hidden=!$("edHint").textContent;
  $("edWord").value=w?w.w:"";$("edMean").value=w?w.mean:"";$("edLang").value=lang;$("edNote").value=w?w.note||"":"";
  setRude(w?w.rude:3);setKind(w?w.kind:"swear");
  const rb=$("edRec");rb.classList.remove("rec");rb.querySelector("span").textContent=w&&w.aud?"Record again":"Record how it sounds";
  $("edPlayRec").hidden=!(w&&w.aud);$("edRecRow").hidden=!!ED.ctx.noRec;$("edDel").hidden=!w;
  $("edLangRow").hidden=!!ED.ctx.lockLang&&!w;$("edLangFixed").hidden=!$("edLangRow").hidden;$("edLangFixed").textContent="Language: "+LG(lang).n;
  $("ed").showModal();setTimeout(()=>$("edWord").focus(),60)}
function setRude(n){$("edRude").dataset.v=n;[...$("edRude").children].forEach((b,i)=>b.classList.toggle("on",i<n));$("edRudeTxt").textContent=["","Mild","Cheeky","Rude","Very rude","Nuclear"][n]}
function setKind(k){$("edKind").dataset.v=k;[...$("edKind").children].forEach(b=>b.classList.toggle("on",b.dataset.k===k))}
async function saveEditor(){
  const word=$("edWord").value.trim();if(!word){toast("Type the word first",true);$("edWord").focus();return}
  const lang=$("edLang").value,mean=$("edMean").value.trim();
  const rude=+$("edRude").dataset.v||3,kind=$("edKind").dataset.v||"swear",note=$("edNote").value.trim();
  let w=ED.w,fresh=false;
  if(!w){if(S.words.some(x=>x.lang===lang&&x.w.toLowerCase()===word.toLowerCase())){toast("Already in your deck",true);return}
    w={id:uid(),ts:Date.now(),by:ED.ctx.by||"me",from:ED.ctx.by==="friend"?S.friend.name:""};S.words.push(w);fresh=true}
  Object.assign(w,{w:word,lang,mean,rude,kind,note});
  if(EDBLOB){if(await audPut(w.id,EDBLOB))w.aud=true}
  if(S.share)queueShare(w);
  save();$("ed").close();renderWords();
  if(ED.ctx.onSaved)ED.ctx.onSaved(w,fresh);
  if(fresh){const why=ED.ctx.by==="friend"?"learned a word":ED.ctx.by==="teach"?"taught a word":"new word";addPts(ED.ctx.by==="friend"?PTS.learn:ED.ctx.by==="teach"?PTS.teach:PTS.add,why)}
  else toast("✓ Saved")}

/* ---------- swap (two people, one phone, then QR to the friend's phone) ---------- */
let SESSION={learned:[],taught:[]};
function renderSwap(){
  const ok=S.friend.lang&&S.me.lang;
  $("swFriendName").value=S.friend.name||"";$("swFriendLang").value=S.friend.lang||"";
  $("swSteps").hidden=!ok;$("swNeed").hidden=!!ok;
  if(!ok)return;
  const fn=S.friend.name||"Your friend";
  $("swLearnBtn").innerHTML=`👂 <b>${esc(fn)} teaches me</b><small>a word in ${esc(LG(S.friend.lang).n)}</small>`;
  $("swTeachBtn").innerHTML=`🗣️ <b>I teach ${esc(fn)}</b><small>a word in ${esc(LG(S.me.lang).n)}</small>`;
  const L=SESSION.learned.map(id=>S.words.find(w=>w.id===id)).filter(Boolean),T=SESSION.taught;
  $("swLearned").innerHTML=L.length?`<div class="sec" style="--c:#4cc9f0">Learned this swap (${L.length})</div><div class="grid">${L.map(wordCard).join("")}</div>`:"";
  $("swTaught").innerHTML=T.length?`<div class="sec" style="--c:#ff9f1c">Taught this swap (${T.length})</div><div class="grid">${T.map(w=>`<div class="tile" style="--c:#ff9f1c"><div class="th">${esc(w.w)}</div><div class="en">${esc(w.mean)}</div><small class="hot">${chillies(w.rude)}</small><div class="trow"><button class="ib play" data-say="${encodeURIComponent(w.w)}" data-lang="${w.lang}">🔊 Play</button></div></div>`).join("")}</div>`:"";
  $("swSend").hidden=!T.length;$("swSend").textContent="📲 Send "+T.length+" word"+(T.length>1?"s":"")+" to "+fn}
function swLearn(){
  openEditor(null,{by:"friend",lang:S.friend.lang,lockLang:true,hint:"Hand the phone to "+(S.friend.name||"your friend")+". They type a word, what it means, and record themselves saying it.",
    onSaved:(w,fresh)=>{if(!fresh)return;SESSION.learned.push(w.id);S.swaps++;save();renderSwap();checkBadges();setTimeout(()=>tryIt(w),400)}})}
/* the learner says the word back; the teacher judges */
function tryIt(w){$("tyWord").textContent=w.w;$("tyMean").textContent=w.mean||"";$("tyWho").textContent="Now you say it. "+(S.friend.name||"Your friend")+" decides if you nailed it.";
  $("ty").dataset.id=w.id;$("ty").showModal();playWord(w)}
function swTeach(){
  openEditor(null,{by:"teach",lang:S.me.lang,lockLang:true,noRec:true,title:"Teach "+(S.friend.name||"your friend")+" a word",hint:"Type a word in your language. It goes to your friend's phone when you tap Send.",
    onSaved:(w,fresh)=>{if(!fresh)return;
      // taught words stay off my own deck: they belong to the friend
      S.words=S.words.filter(x=>x.id!==w.id);SESSION.taught.push({w:w.w,lang:w.lang,mean:w.mean,rude:w.rude,kind:w.kind,note:w.note||""});S.swaps++;save();renderWords();renderSwap();checkBadges()}})}

/* the share link carries the words in the address, so no server is needed */
function b64u(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function unb64u(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return decodeURIComponent(escape(atob(s)))}
function packLink(){const p={f:S.me.name||"",l:S.me.lang,w:SESSION.taught.map(w=>[w.w,w.mean,w.rude,w.kind[0]])};
  return location.origin+location.pathname+"#w="+b64u(JSON.stringify(p))}
function sendWords(){
  const url=packLink();$("qrBox").innerHTML="";
  try{const q=qrcode(0,"L");q.addData(url);q.make();$("qrBox").innerHTML=q.createSvgTag({cellSize:6,margin:2,scalable:true})}catch(e){$("qrBox").innerHTML='<p class="note">Too many words for one code. Use the Share button instead.</p>'}
  $("qrWho").textContent=(S.friend.name||"Your friend")+": open your camera and point it at this code.";
  $("qr").dataset.url=url;$("qr").showModal()}
async function shareLink(){const url=$("qr").dataset.url;
  try{if(navigator.share){await navigator.share({title:"Swear Jar",text:"Words from "+(S.me.name||"your friend"),url});return}}catch(e){if(e&&e.name==="AbortError")return}
  try{await navigator.clipboard.writeText(url);toast("✓ Link copied")}catch(e){prompt("Copy this link",url)}}
/* receiving: someone opened a share link */
function receive(){
  const m=location.hash.match(/#w=([A-Za-z0-9_-]+)/);if(!m)return false;
  let p;try{p=JSON.parse(unb64u(m[1]))}catch(e){toast("That link is broken",true);return false}
  history.replaceState(null,"",location.pathname);
  const KM={s:"slang",w:"swear",i:"insult",f:"funny"};let n=0;
  for(const a of(p.w||[]).slice(0,60)){const w=String(a[0]||"").slice(0,80).trim();if(!w)continue;
    if(S.words.some(x=>x.lang===p.l&&x.w.toLowerCase()===w.toLowerCase()))continue;
    S.words.push({id:uid(),ts:Date.now(),by:"friend",from:String(p.f||"").slice(0,30),w,lang:LG(p.l).c,mean:String(a[1]||"").slice(0,160),rude:Math.max(1,Math.min(5,+a[2]||3)),kind:KM[a[3]]||"slang"});n++}
  S.swaps++;S.filter="all";save();
  if(n)setTimeout(()=>addPts(n*PTS.learn,n+" word"+(n>1?"s":"")+" from "+(p.f||"a friend")),500);else toast("You already have those words");
  return true}

/* ---------- quiz ---------- */
let QZ=null;
function renderQuiz(){
  const pool=S.words.filter(w=>w.mean);
  if(pool.length<4){$("qzBody").innerHTML=`<div class="empty">Add at least 4 words with a meaning to play.<br>You have ${pool.length}.</div>`;return}
  const a=pool[Math.floor(Math.random()*pool.length)];
  const others=pool.filter(w=>w.id!==a.id&&w.mean.toLowerCase()!==a.mean.toLowerCase()).sort(()=>Math.random()-.5);
  const opts=[a,...[...new Map(others.map(w=>[w.mean.toLowerCase(),w])).values()].slice(0,3)].sort(()=>Math.random()-.5);
  QZ={a,done:false};
  $("qzBody").innerHTML=`<p class="qzq">What does this mean?</p><div class="qzw">${esc(a.w)}</div><small class="qzl">${esc(LG(a.lang).n)}</small>
    <button class="ib wide" data-qplay>🔊 Play it</button>
    <div class="qzo">${opts.map(o=>`<button class="ib opt" data-ans="${o.id}">${esc(o.mean)}</button>`).join("")}</div>
    <button class="ib wide pri" id="qzNext" hidden>Next word ➜</button>`;
  playWord(a)}
function answer(btn){if(!QZ||QZ.done)return;QZ.done=true;const right=btn.dataset.ans===QZ.a.id;
  document.querySelectorAll("#qzBody .opt").forEach(b=>{if(b.dataset.ans===QZ.a.id)b.classList.add("right")});
  if(right){S.quizRight++;addPts(PTS.quiz,"right answer")}else{btn.classList.add("wrong");toast("It means: "+QZ.a.mean,true)}
  $("qzNext").hidden=false}

/* ---------- score ---------- */
function paintScore(){$("hdrPts").textContent=S.pts+" pts"}
function renderScore(){
  const langs=new Set(S.words.map(w=>w.lang)).size;
  const lvl=Math.floor(Math.sqrt(S.pts/50))+1,next=Math.pow(lvl,2)*50,prev=Math.pow(lvl-1,2)*50;
  const pct=Math.round((S.pts-prev)/(next-prev)*100);
  $("scBody").innerHTML=`<div class="big"><div class="pts">${S.pts}</div><div>points · Level ${lvl}</div>
    <div class="bar"><i style="width:${pct}%"></i></div><small>${next-S.pts} points to level ${lvl+1}</small></div>
    <div class="stats"><div><b>${S.words.length}</b>words</div><div><b>${langs}</b>languages</div><div><b>${S.swaps}</b>swaps</div><div><b>${S.quizRight}</b>quiz right</div></div>
    <div class="sec" style="--c:#ffd23f">Badges (${S.badges.length} of ${BADGES.length})</div>
    <div class="badges">${BADGES.map(b=>`<div class="badge ${S.badges.includes(b.id)?"got":""}"><span>${b.ic}</span><b>${esc(b.n)}</b><small>${esc(b.d)}</small></div>`).join("")}</div>
    <div class="sec" style="--c:#4cc9f0">How to score</div>
    <div class="note">Add a word: ${PTS.add} · Learn a word from a friend: ${PTS.learn} · Teach a friend: ${PTS.teach} · Say it right: ${PTS.nailed} · Quiz answer right: ${PTS.quiz}</div>`}

/* ---------- share to Speakeasy (off by default, anonymous) ---------- */
function queueShare(w){if(S.queue.some(q=>q.id===w.id))return;S.queue.push({id:w.id,w:w.w,lang:w.lang,mean:w.mean,rude:w.rude,kind:w.kind});if(S.queue.length>500)S.queue.shift();save();flushShare()}
async function flushShare(){
  if(!S.share||!SHARE_FORM||!S.queue.length||navigator.onLine===false)return;
  const batch=S.queue.slice(0,20);
  for(const q of batch){const fd=new URLSearchParams();for(const k in SHARE_FIELDS)if(SHARE_FIELDS[k])fd.append(SHARE_FIELDS[k],String(q[k]==null?"":q[k]));
    try{await fetch(SHARE_FORM,{method:"POST",mode:"no-cors",body:fd});S.queue=S.queue.filter(x=>x.id!==q.id)}catch(e){break}}
  save()}

/* ---------- settings / setup ---------- */
function langOptions(sel,blankTxt){return(blankTxt?`<option value="">${blankTxt}</option>`:"")+LANGS.map(l=>`<option value="${l.c}" ${l.c===sel?"selected":""}>${esc(l.n)}</option>`).join("")}
function openSettings(first){
  $("stTitle").textContent=first?"Welcome to Swear Jar":"Settings";$("stIntro").hidden=!first;
  $("stName").value=S.me.name||"";$("stLang").innerHTML=langOptions(S.me.lang,"Choose your language");$("stShare").checked=!!S.share;
  $("stClose").textContent=first?"Let's go":"Done";$("stReset").hidden=!!first;$("st").showModal()}
function closeSettings(){
  const l=$("stLang").value;if(!l){toast("Choose your language",true);return}
  S.me.name=$("stName").value.trim().slice(0,30);S.me.lang=l;
  const was=S.share;S.share=$("stShare").checked;
  if(S.share&&!was){S.words.forEach(queueShare);toast("✓ Thanks! Your words help Speakeasy")}
  if(!S.share)S.queue=[];
  save();$("st").close();go(S.tab)}

/* ---------- tabs ---------- */
function go(t){S.tab=t;save();document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.tab===t));
  document.querySelectorAll("main>section").forEach(s=>s.hidden=s.id!=="tab-"+t);
  if(t==="words")renderWords();if(t==="swap")renderSwap();if(t==="quiz")renderQuiz();if(t==="score")renderScore();window.scrollTo(0,0)}

/* ---------- events ---------- */
function wire(){
  $("edLang").innerHTML=langOptions("en");$("swFriendLang").innerHTML=langOptions("","Choose their language");
  $("edRude").innerHTML=[1,2,3,4,5].map(i=>`<button type="button" class="chili" data-r="${i}" aria-label="${i} chillies">🌶️</button>`).join("");
  $("edKind").innerHTML=KINDS.map(k=>`<button type="button" class="chip" style="--c:${k.c}" data-k="${k.k}">${k.n}</button>`).join("");
  $("edRude").onclick=e=>{const b=e.target.closest("[data-r]");if(b)setRude(+b.dataset.r)};
  $("edKind").onclick=e=>{const b=e.target.closest("[data-k]");if(b)setKind(b.dataset.k)};
  $("edRec").onclick=()=>recToggle($("edRec"),b=>{if(b){EDBLOB=b;$("edPlayRec").hidden=false;toast("✓ Recorded")}else toast("Nothing heard, try again",true)});
  $("edPlayRec").onclick=async()=>{const b=EDBLOB||(ED.w&&await audGet(ED.w.id));if(b){const a=new Audio(URL.createObjectURL(b));a.play().catch(()=>{})}};
  $("edSpeak").onclick=()=>{const w=$("edWord").value.trim();if(w)speak(w,$("edLang").value)};
  $("edTr").onclick=async()=>{const w=$("edWord").value.trim();if(!w){toast("Type the word first",true);return}
    const b=$("edTr");b.disabled=true;b.textContent="Translating…";
    try{const t=await trans(w,LG($("edLang").value).mm,"en");if(t){$("edMean").value=t;toast("Check it: slang often translates wrong")}else toast("No translation found",true)}catch(e){toast("No internet",true)}
    b.disabled=false;b.textContent="🌐 Translate"};
  $("edSave").onclick=saveEditor;$("edCancel").onclick=()=>{if(REC)REC.stop();$("ed").close()};
  $("edDel").onclick=()=>{if(!ED.w||!confirm("Delete “"+ED.w.w+"”?"))return;S.words=S.words.filter(x=>x!==ED.w);audDel(ED.w.id);save();$("ed").close();renderWords();toast("Deleted")};
  $("addBtn").onclick=()=>openEditor(null,{by:"me"});
  $("fchips").onclick=e=>{const b=e.target.closest("[data-f]");if(b){S.filter=b.dataset.f;save();renderWords()}};
  document.body.addEventListener("click",e=>{
    const p=e.target.closest("[data-play]");if(p){const w=S.words.find(x=>x.id===p.dataset.play);if(w)playWord(w);return}
    const s=e.target.closest("[data-say]");if(s){speak(decodeURIComponent(s.dataset.say),s.dataset.lang);return}
    const ed=e.target.closest("[data-edit]");if(ed){const w=S.words.find(x=>x.id===ed.dataset.edit);if(w)openEditor(w);return}
    const t=e.target.closest("nav [data-tab]");if(t){go(t.dataset.tab);return}
    const a=e.target.closest("[data-ans]");if(a){answer(a);return}
    if(e.target.closest("[data-qplay]")&&QZ){playWord(QZ.a);return}
    if(e.target.id==="qzNext"){renderQuiz();return}});
  $("swFriendName").oninput=()=>{S.friend.name=$("swFriendName").value.trim().slice(0,30);save();renderSwap();$("swFriendName").focus()};
  $("swFriendLang").onchange=()=>{S.friend.lang=$("swFriendLang").value;save();renderSwap()};
  $("swLearnBtn").onclick=swLearn;$("swTeachBtn").onclick=swTeach;$("swSend").onclick=sendWords;
  $("qrShare").onclick=shareLink;$("qrClose").onclick=()=>$("qr").close();
  $("tyPlay").onclick=()=>{const w=S.words.find(x=>x.id===$("ty").dataset.id);if(w)playWord(w)};
  $("tyYes").onclick=()=>{$("ty").close();addPts(PTS.nailed,"nailed it")};
  $("tyNo").onclick=()=>{$("ty").close();toast("Keep practising!")};
  $("setBtn").onclick=()=>openSettings(false);$("stClose").onclick=closeSettings;
  $("stReset").onclick=()=>{if(!confirm("Delete ALL your words, points and badges?"))return;const me=S.me;S=blank();S.me=me;save();$("st").close();go("words");toast("Everything cleared")};
  $("st").addEventListener("cancel",e=>{if(!S.me.lang)e.preventDefault()});
  window.addEventListener("online",flushShare)}

load();wire();
const got=receive();
if(!S.me.lang)openSettings(true);
go(got?"words":S.tab||"words");paintScore();flushShare();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
