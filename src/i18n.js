/* Learning both ways: the app speaks the player's own language (Thai so far), labels the map in it,
   and gives a "sounds like" line for every built-in word. */
const TH={
"⚙️ Settings":"⚙️ ตั้งค่า","pts":"คะแนน","⬅ Back":"⬅ กลับ","🫙 Whole map":"🫙 ดูทั้งหมด","➕ Add a word":"➕ เพิ่มคำ",
"Tap a bubble to zoom in · pinch or drag to explore":"แตะวงกลมเพื่อซูม · ถ่างนิ้วหรือลากเพื่อสำรวจ",
"Map":"แผนที่","Swap":"แลกคำ","Quiz":"ทายคำ","Score":"คะแนน",
"Sit with a friend who speaks another language. Take turns teaching each other rude words. You both score.":"นั่งกับเพื่อนที่พูดอีกภาษา ผลัดกันสอนคำหยาบ ได้คะแนนทั้งคู่",
"Friend's name":"ชื่อเพื่อน","e.g. Nok":"เช่น Tom","Friend's language":"ภาษาของเพื่อน","Choose your friend's language to start.":"เลือกภาษาของเพื่อนเพื่อเริ่ม",
"Choose their language":"เลือกภาษาของเพื่อน","Your friend":"เพื่อน","your friend":"เพื่อน",
"{0} teaches me":"{0} สอนฉัน","a word in {0}":"คำภาษา{0}","I teach {0}":"ฉันสอน {0}",
"Learned this swap":"เรียนรอบนี้","Taught this swap":"สอนรอบนี้","📲 Send {0} words to {1}":"📲 ส่ง {0} คำให้ {1}",
"Hand the phone to {0}. They type a word, pick where it goes on the map, and record themselves saying it.":"ส่งโทรศัพท์ให้{0} ให้เขาพิมพ์คำ เลือกตำแหน่งในแผนที่ แล้วอัดเสียงตัวเองพูด",
"Teach {0} a word":"สอนคำให้{0}","Type a word in your language. It goes to your friend's phone when you tap Send.":"พิมพ์คำในภาษาของคุณ คำจะไปที่โทรศัพท์เพื่อนเมื่อกดส่ง",
"{0} teaches you":"{0} สอนคุณ","Now you say it. {0} decides if you nailed it.":"ตาคุณพูดแล้ว {0} จะตัดสินว่าพูดถูกไหม",
"Add a word":"เพิ่มคำ","Edit word":"แก้ไขคำ","The word or phrase":"คำหรือวลี","🔊 Hear":"🔊 ฟัง","Where it goes on the map":"อยู่ตรงไหนในแผนที่",
"Language":"ภาษา","Language: {0}":"ภาษา: {0}","What it means":"ความหมาย","🌐 Translate":"🌐 แปล","Translating…":"กำลังแปล…",
"What it means (this names the new branch)":"ความหมาย (ใช้ตั้งชื่อกิ่งใหม่)","What it means (optional)":"ความหมาย (ไม่บังคับ)",
"Sounds like (optional)":"อ่านว่า (ไม่บังคับ)","e.g. hia":"เช่น ฟัค",
"How rude?":"หยาบแค่ไหน?","Type":"ประเภท","Native speaker saying it":"เสียงเจ้าของภาษา","Record how it sounds":"อัดเสียงคำนี้","Record again":"อัดใหม่","Stop recording":"หยุดอัด",
"▶️ Play":"▶️ เล่น","When to use it (optional)":"ใช้ตอนไหน (ไม่บังคับ)","e.g. only with close friends":"เช่น ใช้กับเพื่อนสนิทเท่านั้น",
"🗑️ Delete":"🗑️ ลบ","Cancel":"ยกเลิก","✓ Save":"✓ บันทึก",
"Mild":"เบาๆ","Cheeky":"ทะเล้น","Rude":"หยาบ","Very rude":"หยาบมาก","Nuclear":"แรงสุดๆ",
"Swear word":"คำสบถ","Insult":"คำด่า","Slang":"คำสแลง","Funny":"ตลก",
"➕ New branch under {0}":"➕ กิ่งใหม่ใต้ {0}","Something else":"อย่างอื่น","➕ A brand-new idea":"➕ ไอเดียใหม่","My extras":"คำเพิ่มเติม","More words":"คำอื่นๆ",
"means":"แปลว่า","Sounds like":"อ่านว่า","🔓 Learn it  +10":"🔓 เรียนคำนี้ +10","🔊 Play":"🔊 ฟัง","🐢 Slow":"🐢 ช้าๆ","🎙️ Say it":"🎙️ ลองพูด",
"✏️ Edit":"✏️ แก้ไข","Close":"ปิด","Next: {0} ➜":"ถัดไป: {0} ➜","Taught by {0}":"สอนโดย {0}","Added by you":"คุณเพิ่มเอง",
"Listening… say it now":"กำลังฟัง… พูดเลย","Heard: {0}":"ได้ยินว่า: {0}","✓ Nailed it!":"✓ เป๊ะเลย!","Close! Try again":"เกือบแล้ว! ลองอีกครั้ง",
"Didn't hear anything. Try again":"ไม่ได้ยินอะไร ลองอีกครั้ง","This phone can't listen. Try Safari or Chrome":"โทรศัพท์นี้ฟังเสียงไม่ได้ ลองใช้ Safari หรือ Chrome",
"said it right":"พูดถูก",
"Your turn!":"ตาคุณแล้ว!","🔊 Hear it again":"🔊 ฟังอีกครั้ง","🔁 Not yet":"🔁 ยังไม่ได้","👍 Nailed it":"👍 เป๊ะเลย",
"Send to your friend":"ส่งให้เพื่อน","📤 Share link":"📤 แชร์ลิงก์","Done":"เสร็จ","{0}: open your camera and point it at this code.":"{0}: เปิดกล้องแล้วส่องโค้ดนี้",
"Too many words for one code. Use the Share button instead.":"คำเยอะเกินสำหรับโค้ดเดียว ใช้ปุ่มแชร์แทน",
"Settings":"ตั้งค่า","Welcome to Swear Jar":"ยินดีต้อนรับสู่ Swear Jar",
"Start with six basics, then unlock how people say them around the world. Add your own words, swap with friends and score points.":"เริ่มจากคำหยาบพื้นฐาน 6 คำ แล้วปลดล็อกว่าคนทั่วโลกพูดกันยังไง เพิ่มคำของคุณเอง แลกคำกับเพื่อน และสะสมคะแนน",
"Contains rude words. For adults.":"มีคำหยาบ สำหรับผู้ใหญ่","Your name (shown to friends you swap with)":"ชื่อของคุณ (เพื่อนที่แลกคำจะเห็น)",
"Your language":"ภาษาของคุณ","Share my words to improve Speakeasy":"แชร์คำของฉันเพื่อช่วยพัฒนา Speakeasy",
"Off unless you switch it on. Only the word, its language, meaning and rudeness are sent. No name, no recording, nothing about you.":"ปิดไว้จนกว่าคุณจะเปิด ส่งเฉพาะคำ ภาษา ความหมาย และระดับความหยาบ ไม่มีชื่อ ไม่มีเสียง ไม่มีข้อมูลส่วนตัว",
"🗑️ Clear everything":"🗑️ ลบทั้งหมด","Let's go":"เริ่มเลย","Choose your language":"เลือกภาษาของคุณ",
"{0} of {1} learned":"เรียนแล้ว {0} จาก {1}",
"What does this mean?":"คำนี้แปลว่าอะไร?","🔊 Play it":"🔊 ฟัง","Next word ➜":"คำถัดไป ➜","It means: {0}":"แปลว่า: {0}","right answer":"ตอบถูก",
"Learn at least 4 foreign words on the map to play.":"เรียนคำต่างภาษาในแผนที่อย่างน้อย 4 คำเพื่อเล่น","You have {0}.":"ตอนนี้มี {0}",
"Tap a 🔒 word on the map to learn it.":"แตะคำที่มี 🔒 ในแผนที่เพื่อเรียน",
"Learn foreign words on at least 4 different branches to play (like Fuck off! or Bullshit!).":"เรียนคำต่างภาษาจากอย่างน้อย 4 กิ่งเพื่อเล่น (เช่น ไสหัวไปเลย! หรือ ตอแหล!)",
"points · Level {0}":"คะแนน · เลเวล {0}","{0} points to level {1}":"อีก {0} คะแนนถึงเลเวล {1}","words learned":"คำที่เรียนแล้ว","foreign languages":"ภาษาต่างประเทศ",
"swaps":"ครั้งที่แลกคำ","quiz right":"ทายถูก","Your jar":"โหลของคุณ","Badges ({0} of {1})":"เหรียญ ({0} จาก {1})","How to score":"วิธีได้คะแนน",
"Learn a word on the map: {0} · Add a word: {1} · Add a new language to a branch: +{2} more · Start a new branch: +{3} more · Learn from a friend: {4} · Teach a friend: {5} · Say it right: {6} · Quiz answer right: {7}":
"เรียนคำในแผนที่: {0} · เพิ่มคำ: {1} · เพิ่มภาษาใหม่ให้กิ่ง: +{2} · สร้างกิ่งใหม่: +{3} · เรียนจากเพื่อน: {4} · สอนเพื่อน: {5} · พูดถูก: {6} · ทายถูก: {7}",
"First word":"คำแรก","Learn or add your first word":"เรียนหรือเพิ่มคำแรก","Potty mouth":"ปากหมา","10 words learned":"เรียนแล้ว 10 คำ","Walking dictionary":"พจนานุกรมเดินได้","50 words learned":"เรียนแล้ว 50 คำ",
"World traveller":"นักเดินทาง","Words in 3 foreign languages":"คำจาก 3 ภาษาต่างประเทศ","Globetrotter":"ท่องโลก","Words in 6 foreign languages":"คำจาก 6 ภาษาต่างประเทศ",
"Full set":"ครบชุด","Learn every language on one branch":"เรียนครบทุกภาษาในกิ่งเดียว","Map maker":"นักทำแผนที่","Add a new language to a branch":"เพิ่มภาษาใหม่ให้กิ่ง",
"Tree grower":"นักปลูกต้นไม้","Start a new branch":"สร้างกิ่งใหม่","First swap":"แลกคำครั้งแรก","Swap words with a friend":"แลกคำกับเพื่อน",
"Bad influence":"เพื่อนพาเสีย","10 words learned from friends":"เรียนจากเพื่อน 10 คำ","Voice of the people":"เสียงประชาชน","Record 5 words":"อัดเสียง 5 คำ",
"Quiz shark":"เซียนทายคำ","10 quiz answers right":"ทายถูก 10 ครั้ง","Regular":"ขาประจำ","Play on 3 different days":"เล่น 3 วัน","Say it right 5 times":"พูดถูก 5 ครั้ง","Smooth talker":"ปากดี",
"🏅 Badge: {0}":"🏅 ได้เหรียญ: {0}","learned {0}":"เรียน{0}","new word":"คำใหม่","learned a word":"เรียนคำใหม่","taught a word":"สอนคำ","new branch!":"กิ่งใหม่!","new language on the map!":"ภาษาใหม่ในแผนที่!",
"nailed it":"พูดเป๊ะ","{0} words from {1}":"{0} คำจาก {1}","a friend":"เพื่อน",
"Type the word first":"พิมพ์คำก่อน","Type what it means: that names the new branch":"พิมพ์ความหมาย เพื่อใช้ตั้งชื่อกิ่งใหม่","Already on your map":"มีในแผนที่แล้ว",
"✓ Saved":"✓ บันทึกแล้ว","✓ Recorded":"✓ อัดแล้ว","Nothing heard, try again":"ไม่ได้ยินเสียง ลองใหม่","Deleted":"ลบแล้ว","Delete “{0}”?":"ลบ “{0}”?",
"Check it: slang often translates wrong":"ตรวจดูด้วย คำสแลงมักแปลผิด","No translation found":"ไม่พบคำแปล","No internet":"ไม่มีอินเทอร์เน็ต",
"This phone can't speak that language":"โทรศัพท์นี้พูดภาษานั้นไม่ได้","Recording isn't available on this phone":"โทรศัพท์นี้อัดเสียงไม่ได้","Allow the microphone to record":"อนุญาตไมโครโฟนเพื่ออัดเสียง",
"✓ Link copied":"✓ คัดลอกลิงก์แล้ว","Copy this link":"คัดลอกลิงก์นี้","That link is broken":"ลิงก์นี้เสีย","You already have those words":"คุณมีคำพวกนี้แล้ว",
"Keep practising!":"ฝึกต่อไป!","Everything cleared":"ลบทั้งหมดแล้ว","Delete ALL your words, points and badges?":"ลบคำ คะแนน และเหรียญทั้งหมด?",
"✓ Thanks! Your words help Speakeasy":"✓ ขอบคุณ! คำของคุณช่วย Speakeasy","Words from {0}":"คำจาก {0}"};
const UI_LANGS={th:TH};
function T(s,...a){const d=S&&S.me&&UI_LANGS[S.me.lang];let r=d&&d[s]||s;a.forEach((x,i)=>{r=r.split("{"+i+"}").join(x)});return r}
/* language names in the player's language */
const LN_TH={en:"อังกฤษ",th:"ไทย",vi:"เวียดนาม",lo:"ลาว",km:"เขมร",zh:"จีนกลาง",ja:"ญี่ปุ่น",ko:"เกาหลี",id:"อินโดนีเซีย",ms:"มาเลย์",tl:"ฟิลิปปินส์",hi:"ฮินดี",
  es:"สเปน (เม็กซิโก)",esp:"สเปน (สเปน)",esa:"สเปน (อาร์เจนตินา)",fr:"ฝรั่งเศส",de:"เยอรมัน",it:"อิตาลี",pt:"โปรตุเกส",ru:"รัสเซีย",ar:"อาหรับ",zt:"จีน (ไต้หวัน)",my:"พม่า",
  yue:"กวางตุ้ง",nl:"ดัตช์",sv:"สวีเดน",tr:"ตุรกี",pl:"โปแลนด์",uk:"ยูเครน",he:"ฮีบรู",el:"กรีก",hu:"ฮังการี",cs:"เช็ก",ro:"โรมาเนีย"};
const LN_TH_SHORT={es:"เม็กซิกัน",esp:"สเปน",esa:"อาร์เจนตินา",zh:"จีนกลาง",zt:"ไต้หวัน"};
/* the six basics named in the player's language (otherwise the first built-in phrase is used) */
const HUBN={th:{fuck:"เหี้ย",shit:"ขี้",piss:"ฉี่",bitch:"อีดอก",bastard:"ไอ้เลว",idiot:"ไอ้โง่"}};
/* sounds-like lines missing from the Speakeasy tables */
const RO={
ja:{fuck:"kuso ga!",fuckoff:"usero!",fuckyou:"fuzakenna!",wtf:"nan da yo, kore!?",shit:"kusso!",holyshit:"maji ka yo!",bullshit:"uso tsuke!",bitch:"kuso onna!",sob:"kusottare!",bastard:"kono yarō!",asshole:"kuso yarō!",idiot:"baka!",dumbass:"aho!"},
ko:{fuck:"ssibal!",fuckoff:"kkeojyeo!",fuckyou:"yeot meogeo!",wtf:"ige mwoya, ssibal?",shit:"jeonjang!",holyshit:"heol, ssibal!",bullshit:"gaesori!",bitch:"ssyangnyeon!",sob:"gaejasik!",bastard:"nappeun nom!",asshole:"gaesaekki!",idiot:"babo!",dumbass:"byeongsin!"}};
/* how the English phrases sound, written in Thai letters, for Thai speakers learning English */
const EN_SOUND={th:{fuck:"ฟัค!",fuckoff:"ฟัค ออฟ!",fuckyou:"ฟัค ยู!",wtf:"วอท เดอะ ฟัค?",shit:"ชิท!",holyshit:"โฮลี่ ชิท!",bullshit:"บูลชิท!",pissoff:"พิส ออฟ!",pissed:"ไอ แอม พิสท์ ออฟ",
  bitch:"บิทช์!",sob:"ซัน ออฟ อะ บิทช์!",bastard:"บาสตาร์ด!",asshole:"แอสโฮล!",idiot:"อิเดียท!",dumbass:"ดัมแอส!",motherfucker:"มาเธอร์ฟัคเกอร์!",youfucker:"ยู ฟัคเกอร์!",whatthehell:"วอท เดอะ เฮล?",damn:"แดม!",shitdriving:"ชิท ไดรวิ่ง!",ohno:"โอ โน!",getlost:"เก็ท ลอสท์!",annoying:"โซ อะนอยอิ้ง!",slut:"สลัท!",whore:"ฮอร์!",sonofawhore:"ซัน ออฟ อะ ฮอร์!",youbastard:"ยู บาสตาร์ด!",scumbag:"สกัมแบ็ก!",cuntface:"คันท์ เฟซ!",dickhead:"ดิ๊กเฮด!",footface:"เฟซ ไลค์ อะ ฟุท!",crazy:"ยัวร์ เครซี่!",shameless:"เชมเลส!",coward:"คาวเวิร์ด!",foulmouth:"ฟาวล์ เมาธ์!"}};
/* static text in the page: elements carry their English text in data-t, placeholders in data-tp */
function applyStatic(){document.documentElement.lang=S.me.lang==="th"?"th":"en";
  document.querySelectorAll("[data-t]").forEach(e=>{e.textContent=T(e.dataset.t)});
  document.querySelectorAll("[data-tp]").forEach(e=>{e.placeholder=T(e.dataset.tp)})}
