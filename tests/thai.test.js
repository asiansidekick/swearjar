const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/');await p.waitForTimeout(400);
await p.selectOption('#stLang','th');await p.click('#stClose');await p.waitForTimeout(700);
await p.screenshot({path:'th1-overview.png'});
const tapN=async id=>{const bb=await p.$eval(`[data-n="${id}"]`,g=>{const r=g.getBoundingClientRect();return[r.x+r.width/2,r.y+r.height/2]});await p.mouse.click(bb[0],bb[1]);await p.waitForTimeout(800)};
await tapN('h:bastard');await p.screenshot({path:'th2-hub.png'});
await tapN('v:asshole');await p.screenshot({path:'th3-var.png'});
await tapN('l:asshole|en');await p.screenshot({path:'th4-card.png'});
await p.click('#cdLearn');await p.waitForTimeout(400);await p.screenshot({path:'th5-learned.png'});
for(const k of ['l:asshole|ja','l:asshole|ko']){await p.click('#cdClose');await tapN(k);await p.click('#cdLearn');await p.waitForTimeout(200)}
await p.screenshot({path:'th6-ko.png'});await p.click('#cdClose');
await p.evaluate(()=>{['fuckoff|en','bullshit|en','idiot|en'].forEach(k=>S.learned[k]=1);save()});
await p.click('#mAdd');await p.waitForTimeout(300);await p.screenshot({path:'th7-editor.png'});await p.click('#edCancel');
await p.click('nav [data-tab=quiz]');await p.waitForTimeout(200);await p.screenshot({path:'th8-quiz.png'});
await p.click('nav [data-tab=swap]');await p.selectOption('#swFriendLang','en');await p.fill('#swFriendName','Phil');await p.screenshot({path:'th9-swap.png'});
await p.click('nav [data-tab=score]');await p.screenshot({path:'th10-score.png',fullPage:true});
await p.click('#setBtn');await p.screenshot({path:'th11-settings.png'});
// English-mode card practice row check
const p2=await (await b.newContext({viewport:{width:390,height:844},hasTouch:true,deviceScaleFactor:2})).newPage();p2.on('pageerror',e=>errs.push('p2 '+e.message));
await p2.goto('http://localhost:8765/');await p2.selectOption('#stLang','en');await p2.click('#stClose');await p2.waitForTimeout(500);
const t2=async id=>{const bb=await p2.$eval(`[data-n="${id}"]`,g=>{const r=g.getBoundingClientRect();return[r.x+r.width/2,r.y+r.height/2]});await p2.mouse.click(bb[0],bb[1]);await p2.waitForTimeout(800)};
await t2('h:bastard');await t2('v:asshole');await t2('l:asshole|th');await p2.click('#cdLearn');await p2.waitForTimeout(300);await p2.screenshot({path:'en1-card.png'});
await p2.click('#cdSay');await p2.waitForTimeout(300);await p2.screenshot({path:'en2-say.png'});
console.log('errors',errs);await b.close()})();
