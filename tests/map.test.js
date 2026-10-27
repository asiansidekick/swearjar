const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/');await p.waitForTimeout(500);
await p.fill('#stName','Phil');await p.selectOption('#stLang','en');await p.click('#stClose');await p.waitForTimeout(700);
await p.screenshot({path:'m1-overview.png'});
const tapN=async id=>{const bb=await p.$eval(`[data-n="${id}"]`,g=>{const r=g.getBoundingClientRect();return[r.x+r.width/2,r.y+r.height/2]});await p.mouse.click(bb[0],bb[1]);await p.waitForTimeout(800)};
await tapN('h:fuck');await p.screenshot({path:'m2-hub.png'});
await tapN('v:fuck');await p.screenshot({path:'m3-var.png'});
await tapN('l:fuck|th');await p.screenshot({path:'m4-card.png'});
await p.click('#cdLearn');await p.waitForTimeout(400);await p.screenshot({path:'m5-learned.png'});
for(let i=0;i<4;i++){await p.click('#cdNext');await p.click('#cdLearn');await p.waitForTimeout(150)}
await p.click('#cdClose');await p.waitForTimeout(1200);await p.screenshot({path:'m6-var-after.png'});
// add word in a new language
await tapN('a:fuck');await p.fill('#edWord','Scheiße');await p.selectOption('#edLang','de');await p.click('#edSave');await p.waitForTimeout(400);
// brand new idea
await p.click('#mAdd');await p.selectOption('#edBranch','newhub');await p.fill('#edWord','farang kee nok');await p.selectOption('#edLang','th');await p.fill('#edMean','Birdshit foreigner');await p.click('#edSave');await p.waitForTimeout(1500);
await p.screenshot({path:'m7-newidea.png'});
await p.click('#mHome');await p.waitForTimeout(900);await p.screenshot({path:'m8-home.png'});
// quiz and score
await p.click('nav [data-tab=quiz]');await p.screenshot({path:'m9-quiz.png'});
await p.click('nav [data-tab=score]');await p.screenshot({path:'m10-score.png',fullPage:true});
// swap teach with custom branch, receive on 2nd phone
await p.click('nav [data-tab=swap]');await p.fill('#swFriendName','Nok');await p.selectOption('#swFriendLang','th');
await p.click('#swTeachBtn');await p.selectOption('#edBranch','idiot');await p.fill('#edWord','numpty');await p.click('#edSave');await p.waitForTimeout(300);
await p.click('#swTeachBtn');await p.selectOption('#edBranch','new:shit');await p.fill('#edWord','shitfaced');await p.fill('#edMean','Very drunk');await p.click('#edSave');await p.waitForTimeout(300);
await p.click('#swSend');const url=await p.$eval('#qr',d=>d.dataset.url);await p.click('#qrClose');
const st=await p.evaluate(()=>JSON.parse(localStorage.getItem('swearjar.v1')));
console.log('pts',st.pts,'learned',Object.keys(st.learned).length,'words',st.words.map(w=>w.w+'@'+w.var),'badges',st.badges.join(','),'vars',JSON.stringify(st.vars));
const p2=await (await b.newContext({viewport:{width:390,height:844},hasTouch:true})).newPage();p2.on('pageerror',e=>errs.push('p2 '+e.message));
await p2.goto(url);await p2.waitForTimeout(400);await p2.selectOption('#stLang','th');await p2.click('#stClose');await p2.waitForTimeout(1500);
const st2=await p2.evaluate(()=>JSON.parse(localStorage.getItem('swearjar.v1')));console.log('friend',st2.words.map(w=>w.w+'@'+w.var),JSON.stringify(st2.vars),st2.pts);
await p2.screenshot({path:'m11-friend.png'});
// pinch / wheel check
await p.click('nav [data-tab=map]');await p.waitForTimeout(500);await p.mouse.move(195,400);await p.mouse.wheel(0,-600);await p.waitForTimeout(200);await p.screenshot({path:'m12-wheel.png'});
console.log('errors',errs);await b.close()})();
