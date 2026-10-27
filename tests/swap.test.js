const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/');await p.waitForTimeout(500);
await p.screenshot({path:'s1-welcome.png'});
await p.fill('#stName','Phil');await p.selectOption('#stLang','en');await p.click('#stClose');
// add words
const add=async(w,m,lang,r)=>{await p.click('#addBtn');await p.fill('#edWord',w);await p.selectOption('#edLang',lang);await p.fill('#edMean',m);await p.click(`#edRude [data-r="${r}"]`);await p.click('#edSave');await p.waitForTimeout(200)};
await add('wanker','idiot (British)','en',4);await add('bloody hell','damn it','en',2);await add('cheeky bugger','rascal','en',2);await add('arse','backside','en',3);
await p.waitForTimeout(1500);await p.screenshot({path:'s2-words.png'});
// swap
await p.click('nav [data-tab=swap]');await p.fill('#swFriendName','Nok');await p.selectOption('#swFriendLang','th');
await p.click('#swLearnBtn');await p.screenshot({path:'s3-learn.png'});
await p.fill('#edWord','ไอ้บ้า');await p.fill('#edMean','crazy idiot');await p.click('#edSave');await p.waitForTimeout(600);
await p.screenshot({path:'s4-try.png'});await p.click('#tyYes');
await p.click('#swTeachBtn');await p.fill('#edWord','tosser');await p.fill('#edMean','jerk');await p.click('#edSave');await p.waitForTimeout(300);
await p.screenshot({path:'s5-swap.png',fullPage:true});
await p.click('#swSend');await p.waitForTimeout(300);await p.screenshot({path:'s6-qr.png'});
const url=await p.$eval('#qr',d=>d.dataset.url);await p.click('#qrClose');
// quiz
await p.click('nav [data-tab=quiz]');await p.screenshot({path:'s7-quiz.png'});await p.click('#qzBody .opt');await p.waitForTimeout(300);await p.screenshot({path:'s7b-quiz.png'});
await p.click('nav [data-tab=score]');await p.screenshot({path:'s8-score.png',fullPage:true});
const st=await p.evaluate(()=>JSON.parse(localStorage.getItem('swearjar.v1')));
console.log('pts',st.pts,'words',st.words.length,'badges',st.badges,'swaps',st.swaps);
// friend's phone opens link
const p2=await (await b.newContext({viewport:{width:390,height:844}})).newPage();p2.on('pageerror',e=>errs.push('p2 '+e.message));
await p2.goto(url);await p2.waitForTimeout(500);await p2.selectOption('#stLang','th');await p2.click('#stClose');await p2.waitForTimeout(1600);
await p2.screenshot({path:'s9-friend.png'});
const st2=await p2.evaluate(()=>JSON.parse(localStorage.getItem('swearjar.v1')));console.log('friend words',st2.words.map(w=>w.w+'|'+w.from+'|'+w.lang),'pts',st2.pts,'hash',await p2.evaluate(()=>location.hash));
console.log('url len',url.length,'errors',errs);await b.close()})();
