/* Yathin AI Kids Zone: Learn + Games (only in Kids mode) */
(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const BAD=/\b(sex\w*|porn\w*|nude|naked|kill\w*|murder\w*|suicide|self-harm|drugs?|weed|vape|vaping|alcohol|beer|wine|vodka|cigarette\w*|guns?|shoot\w*|bombs?|gambl\w*|casino|dating|boyfriend|girlfriend|kiss\w*|blood\w*|gore|weapon\w*|terror\w*|damn|hell|crap|stupid|idiot|hate)\b/i;
const safe=t=>!BAD.test(String(t||""));
const SAFE_MSG="Let's learn something else! Pick another topic. 💛";
let stars=+localStorage.getItem("yai-kz-stars")||0;
function addStar(n){stars+=n||1;localStorage.setItem("yai-kz-stars",stars);const s=$("#kzStars");if(s){s.textContent="⭐ "+stars;s.classList.remove("pop");void s.offsetWidth;s.classList.add("pop")}}
let AC=null;function beep(f,d,type){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type||"sine";o.frequency.value=f;g.gain.setValueAtTime(.25,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+(d||.3));o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+(d||.3))}catch(e){}}
const yay=()=>{beep(660,.12);setTimeout(()=>beep(880,.18),110)},boo=()=>beep(180,.25,"square");
function confetti(){const c=document.createElement("div");c.className="kzConf";for(let i=0;i<40;i++){const p=document.createElement("i");p.style.left=Math.random()*100+"%";p.style.background=["#f472b6","#facc15","#60a5fa","#34d399","#fb923c"][i%5];p.style.animationDelay=Math.random()*.4+"s";c.append(p)}document.body.append(c);setTimeout(()=>c.remove(),2200)}

/* ---------- data ---------- */
const GRADES=["K","1","2","3","4","5","6","7"];
const SUBJ=[["math","🔢","Math"],["science","🔬","Science"],["reading","📖","Reading & Writing"],["social","🌎","Social Studies"],["music","🎵","Music"]];
const band=g=>g==="K"||+g<=2?0:+g<=5?1:2;
const TOP={
 math:[["Counting to 100","Adding within 20","Taking away within 20","Shapes","Place value (tens and ones)","Telling time","Money: coins","Measuring length"],
       ["Multiplication facts","Division basics","Fractions","Place value to 1,000,000","Area and perimeter","Rounding numbers","Word problems","Decimals"],
       ["Ratios","Percents","Negative numbers","Simple equations","Area of triangles","Order of operations","Graphs and data","Probability"]],
 science:[["Living and nonliving things","Animals and their homes","Plants and how they grow","Weather","The five senses","Day and night","Push and pull","Rocks and soil"],
          ["The water cycle","Food chains","States of matter","The solar system","Magnets","Electric circuits","Ecosystems","Light and sound"],
          ["Cells","The human body systems","Energy","Earth's layers","Forces and motion","Chemical changes","Weather and climate","Space and gravity"]],
 reading:[["Letter sounds","Rhyming words","Sight words","Nouns and verbs","Making sentences","Story characters","Beginning, middle, end","Capital letters and periods"],
          ["Main idea","Synonyms and antonyms","Prefixes and suffixes","Adjectives and adverbs","Fact and opinion","Poetry","Commas","Writing a paragraph"],
          ["Theme","Figurative language","Point of view","Context clues","Parts of speech","Persuasive writing","Root words","Summarizing"]],
 social:[["Community helpers","Maps and globes","Rules and laws","Holidays and traditions","Needs and wants","Families","Seasons","Being a good citizen"],
         ["The 50 states","Native Americans","Texas history","Landforms","U.S. symbols","Explorers","Three branches of government","Continents and oceans"],
         ["Ancient Egypt","Ancient Greece and Rome","World geography","Economics basics","Early civilizations","Maps and time zones","Cultures of the world","The U.S. Constitution"]]
};
const MUSIC=[["piano","🎹","Piano / Keyboard"],["recorder","🪈","Recorder"],["ukulele","🪕","Ukulele"],["guitar","🎸","Guitar"],["drums","🥁","Drums & Rhythm"],["singing","🎤","Singing"],["basics","🎼","Reading Music"]];
const SONGS=[["Hot Cross Buns","E D C E D C C C C C D D D D E D C"],["Mary Had a Little Lamb","E D C D E E E D D D E G G E D C D E E E E D D E D C"],["Twinkle Twinkle","C C G G A A G F F E E D D C"],["Ode to Joy","E E F G G F E D C C D E E D D"]];
const NOTES=[["C",261.6],["D",293.7],["E",329.6],["F",349.2],["G",392],["A",440],["B",493.9],["C2",523.3]];
const freq=n=>(NOTES.find(x=>x[0]===n)||NOTES[0])[1];

/* ---------- shell ---------- */
let host=null,st={};
function shell(title,back){host.innerHTML=`<div class="kzTop">${back?`<button class="kzBack">← Back</button>`:""}<h1>${title}</h1><span id="kzStars" class="kzStars">⭐ ${stars}</span></div><div class="kzBody"></div>`;if(back)host.querySelector(".kzBack").onclick=back;return host.querySelector(".kzBody")}
function tiles(body,items,on){const g=document.createElement("div");g.className="kzGrid";items.forEach(it=>{const b=document.createElement("button");b.className="kzTile";b.innerHTML=`<span>${it[1]||""}</span><b>${esc(it[2]||it[0])}</b>${it[3]?`<small>${esc(it[3])}</small>`:""}`;b.onclick=()=>on(it[0]);g.append(b)});body.append(g)}
async function ask(sys,user){const o=await window.YAI.ask(sys,user);return o||""}

/* ---------- LEARN ---------- */
function learnHome(){const b=shell("📚 Learn");b.insertAdjacentHTML("beforeend",`<p class="kzSub">What grade are you in?</p>`);
 tiles(b,GRADES.map(g=>[g,g==="K"?"🧸":"🎒","Grade "+g,g==="K"?"Kindergarten":""]),g=>{st.grade=g;localStorage.setItem("yai-kz-grade",g);pickSubj()})}
function pickSubj(){const b=shell("Grade "+st.grade+": pick a subject",learnHome);tiles(b,SUBJ,s=>{st.subj=s;s==="music"?pickInstr():pickTopic()})}
function pickTopic(){const s=SUBJ.find(x=>x[0]===st.subj);const b=shell(s[1]+" "+s[2]+" · Grade "+st.grade,pickSubj);b.insertAdjacentHTML("beforeend",`<p class="kzSub">Pick a topic</p>`);
 tiles(b,TOP[st.subj][band(st.grade)].map(t=>[t,"✨",t]),t=>{st.topic=t;topicHub()})}
function pickInstr(){const b=shell("🎵 Music · Grade "+st.grade,pickSubj);b.insertAdjacentHTML("beforeend",`<p class="kzSub">What do you want to learn?</p>`);tiles(b,MUSIC,i=>{st.instr=i;st.topic=MUSIC.find(x=>x[0]===i)[2];topicHub()})}
function topicHub(){const back=st.subj==="music"?pickInstr:pickTopic;const b=shell(st.topic,back);
 const items=[["teach","💡","Teach me","A short, fun lesson"],["paper","📝","Question paper","Tap answers, earn stars"]];
 if(st.subj==="music")items.splice(1,0,["play","🎹","Play along","Learn a song on the keys"]);
 if(st.subj==="music"&&st.instr==="drums")items[1]=["rhythm","🥁","Rhythm game","Tap to the beat"];
 tiles(b,items,a=>({teach,paper,play:playAlong,rhythm})[a]())}
const who=()=>`a grade ${st.grade} student`+(st.subj==="music"?" learning "+st.topic:"");
async function teach(){const b=shell("💡 "+st.topic,topicHub);b.innerHTML=`<div class="kzCard kzLoad">Getting your lesson ready… ✏️</div>`;
 try{const o=await ask(`You are a friendly teacher for ${who()}. Teach the topic in simple words. Reply ONLY JSON: {"steps":[{"title":"short","text":"2-3 short sentences","emoji":"one emoji"}]} with 4 steps. Kid-safe, school content only.`,"Topic: "+st.topic);
  const j=window.YAI.getJson(o);if(!j||!j.steps||!j.steps.length)throw 0;const steps=j.steps.filter(s=>safe(s.title+" "+s.text));if(!steps.length){b.innerHTML=`<div class="kzCard">${SAFE_MSG}</div>`;return}
  let i=0;const draw=()=>{const s=steps[i];b.innerHTML=`<div class="kzCard kzLesson"><div class="kzBig">${esc(s.emoji||"✨")}</div><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p><div class="kzDots">${steps.map((_,k)=>`<i class="${k<=i?"on":""}"></i>`).join("")}</div><div class="kzRow">${i?`<button class="kzBtn ghost" data-a="p">← Back</button>`:""}<button class="kzBtn" data-a="n">${i<steps.length-1?"Next →":"Try the quiz! 📝"}</button></div></div>`;
   b.querySelector('[data-a="n"]').onclick=()=>{if(i<steps.length-1){i++;beep(520,.08);draw()}else{addStar();paper()}};const p=b.querySelector('[data-a="p"]');if(p)p.onclick=()=>{i--;draw()}};draw()}
 catch(e){b.innerHTML=`<div class="kzCard">I couldn't make the lesson just now. <button class="kzBtn" id="kzRetry">Try again</button></div>`;b.querySelector("#kzRetry").onclick=teach}}
async function paper(){const b=shell("📝 "+st.topic,topicHub);b.innerHTML=`<div class="kzCard kzLoad">Writing your question paper… 📝</div>`;
 try{let j=null;for(let t=0;t<2&&!j;t++){const o=await ask(`You write school practice questions for ${who()}. Reply ONLY JSON: {"questions":[{"q":"question","choices":["a","b","c","d"],"answer":0}]} with 8 multiple-choice questions, "answer" is the index of the right choice. Right level for the grade, kid-safe, school content only.`,"Topic: "+st.topic);j=window.YAI.getJson(o);if(j&&!(j.questions&&j.questions.length))j=null}
  if(!j)throw 0;const Q=j.questions.filter(q=>q&&q.q&&Array.isArray(q.choices)&&q.choices.length>=2&&safe(q.q+" "+q.choices.join(" "))).slice(0,10);if(!Q.length){b.innerHTML=`<div class="kzCard">${SAFE_MSG}</div>`;return}
  let score=0,done=0;b.innerHTML=`<div class="kzBar"><i id="kzProg"></i></div><div class="kzScore" id="kzScore">0 / ${Q.length} right</div><div id="kzQs"></div><div class="kzRow kzNoPrint"><button class="kzBtn ghost" id="kzPrint">🖨 Print paper</button><button class="kzBtn" id="kzNew">🔄 New paper</button></div>`;
  const wrap=b.querySelector("#kzQs");
  Q.forEach((q,n)=>{let ans=+q.answer;if(!(ans>=0&&ans<q.choices.length)){const k=q.choices.findIndex(c=>String(c)===String(q.answer));ans=k<0?0:k}
   {const right=q.choices[ans];q.choices=q.choices.slice(0,4).sort(()=>Math.random()-.5);ans=q.choices.indexOf(right);if(ans<0){q.choices[0]=right;ans=0}}
   const d=document.createElement("div");d.className="kzCard kzQ";d.innerHTML=`<div class="kzQn">Question ${n+1}</div><h3>${esc(q.q)}</h3><div class="kzCh">${q.choices.map((c,k)=>`<button data-k="${k}">${"ABCD"[k]||k+1}. ${esc(c)}</button>`).join("")}</div><button class="kzLearn">💡 Learn how to solve it</button><div class="kzHow"></div>`;
   let tried=false;d.querySelectorAll(".kzCh button").forEach(btn=>btn.onclick=()=>{if(d.classList.contains("done"))return;const k=+btn.dataset.k;
    if(k===ans){btn.classList.add("ok");d.classList.add("done");yay();if(!tried){score++;addStar()}done++;}else{btn.classList.add("no");btn.disabled=true;boo();tried=true;d.classList.add("shake");setTimeout(()=>d.classList.remove("shake"),400)}
    b.querySelector("#kzScore").textContent=`${score} / ${Q.length} right`;b.querySelector("#kzProg").style.width=(done/Q.length*100)+"%";
    if(done===Q.length){confetti();b.querySelector("#kzScore").textContent=`🎉 Finished! ${score} / ${Q.length} right on the first try`}});
   d.querySelector(".kzLearn").onclick=async()=>{const h=d.querySelector(".kzHow");if(h.dataset.on)return;h.dataset.on=1;h.textContent="Thinking… 🤔";
    try{const o=await ask(`You are a patient teacher for ${who()}. Explain how to solve the question step by step in simple words. Reply ONLY JSON: {"steps":["short step","short step"],"tip":"one short tip"} with 2 to 5 steps. Show the right answer in the last step. Kid-safe.`,`Question: ${q.q}\nChoices: ${q.choices.join(" | ")}\nRight answer: ${q.choices[ans]}`);
     const e=window.YAI.getJson(o);if(!e||!e.steps)throw 0;const all=e.steps.join(" ")+" "+(e.tip||"");if(!safe(all)){h.textContent=SAFE_MSG;return}
     h.innerHTML=`<ol>${e.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>${e.tip?`<div class="kzTip">⭐ Tip: ${esc(e.tip)}</div>`:""}`}catch(x){h.dataset.on="";h.textContent="I couldn't explain it just now. Tap again."}};
   wrap.append(d)});
  b.querySelector("#kzPrint").onclick=()=>{const w=window.open("","_blank");if(!w)return;w.document.write(`<title>${esc(st.topic)} · Yathin AI</title><body style="font:16px Arial;padding:30px"><h2>${esc(st.topic)} · Grade ${esc(st.grade)}</h2><p>Name: ____________________</p>${Q.map((q,n)=>`<p><b>${n+1}. ${esc(q.q)}</b><br>${q.choices.map((c,k)=>`${"ABCD"[k]}. ${esc(c)}`).join("&nbsp;&nbsp;&nbsp; ")}</p>`).join("")}<p style="color:#888;margin-top:30px">Made with Yathin AI</p><script>print()<\/script>`);w.document.close()};
  b.querySelector("#kzNew").onclick=paper}
 catch(e){b.innerHTML=`<div class="kzCard">I couldn't make the paper just now. <button class="kzBtn" id="kzRetry">Try again</button></div>`;b.querySelector("#kzRetry").onclick=paper}}
function piano(el,onKey){el.innerHTML=`<div class="kzPiano">${NOTES.map(n=>`<button data-n="${n[0]}"><span>${n[0].replace("2","")}</span></button>`).join("")}</div>`;
 el.querySelectorAll("button").forEach(k=>k.onclick=()=>{beep(+freq(k.dataset.n),.5,"triangle");k.classList.add("hit");setTimeout(()=>k.classList.remove("hit"),180);onKey&&onKey(k.dataset.n)})}
function playSong(t,seq,back){let p=0;const bb=shell("🎶 "+t,back);
  bb.innerHTML=`<div class="kzScore" id="kzSong">Note 1 of ${seq.length}</div><div class="kzBar"><i id="kzProg"></i></div><div id="kzKeys"></div><div class="kzRow"><button class="kzBtn ghost" id="kzHear">🔊 Hear it</button><button class="kzBtn ghost" id="kzRestart">↺ Start over</button></div><p class="kzSub">Tip: the letters are the note names. On a real piano, C is the white key just left of the two black keys.</p>`;
  const glow=()=>{bb.querySelectorAll(".kzPiano button").forEach(k=>k.classList.toggle("glow",k.dataset.n===seq[p]))};
  const upd=()=>{bb.querySelector("#kzProg").style.width=(p/seq.length*100)+"%";bb.querySelector("#kzSong").textContent=p<seq.length?`Note ${p+1} of ${seq.length}`:"🎉 You played the whole song!"};
  piano(bb.querySelector("#kzKeys"),n=>{if(p>=seq.length)return;if(n===seq[p]){p++;upd();if(p>=seq.length){addStar(3);confetti()}}glow()});glow();
  bb.querySelector("#kzHear").onclick=()=>seq.forEach((n,k)=>setTimeout(()=>beep(freq(n),.35,"triangle"),k*380));
  bb.querySelector("#kzRestart").onclick=()=>{p=0;upd();glow()}}
function aiSong(){const b=shell("✨ AI song for you",playAlong);const g=st.grade||"3";
 b.innerHTML=`<div class="kzCard"><p class="kzSub" style="margin-top:0">Yathin AI picks a song that fits ${who()}. Want a theme? (optional)</p><div class="kzIn"><input id="kzSt" placeholder="e.g. rain, animals, birthday" maxlength="60"><button class="kzBtn" id="kzSg">Get a song</button></div><div class="kzSub" id="kzSm"></div></div>`;
 const m=b.querySelector("#kzSm");let busy=false;
 const go=async()=>{if(busy)return;const theme=b.querySelector("#kzSt").value.trim();if(theme&&!safe(theme)){m.textContent=SAFE_MSG;return}busy=true;m.textContent="Finding a song… 🎵";
  const len=/^(K|1)$/.test(g)?"8 to 16":/^(2|3|4)$/.test(g)?"14 to 28":"24 to 44";
  try{let j=null;for(let t=0;t<3&&!j;t++){const o=await ask(`You pick piano play-along songs for ${who()}. Use a traditional, folk, nursery or public-domain melody, or write a simple new one. Never a modern copyrighted pop song. The piano has only these keys: C D E F G A B C2 (C2 is high C). Reply ONLY JSON: {"title":"song name","about":"one friendly sentence about the song","notes":["C","D",...]} with ${len} notes, only from those keys. Make it easier for younger grades.`,theme?"Theme: "+theme:"Any good song for this grade");
    const x=window.YAI.getJson(o);const ok=["C","D","E","F","G","A","B","C2"];if(x&&Array.isArray(x.notes)){x.notes=x.notes.map(n=>String(n).trim().toUpperCase().replace(/^HIGH ?C$|^C5$/,"C2").replace(/^([A-G])4$/,"$1")).filter(n=>ok.includes(n));if(x.notes.length>=6&&x.title&&safe(x.title+" "+(x.about||"")))j=x}}
   if(!j)throw 0;busy=false;m.textContent="";playSong(j.title,j.notes.slice(0,60),aiSong);const s=$("#kzSong");if(s&&j.about)s.insertAdjacentHTML("afterend",`<p class="kzSub">${String(j.about).replace(/[<>&]/g,"")}</p>`)}
  catch(e){busy=false;m.textContent="I couldn't find a song just now. Try again!"}};
 b.querySelector("#kzSg").onclick=go;b.querySelector("#kzSt").onkeydown=e=>{if(e.key==="Enter")go()}}
function playAlong(){const b=shell("🎹 Play along",topicHub);b.insertAdjacentHTML("beforeend",`<p class="kzSub">Pick a song. Press the glowing key!</p>`);
 tiles(b,[["ai","✨","Ask AI for a song","Picked for "+who()],...SONGS.map((s,i)=>[i,"🎶",s[0]])],i=>i==="ai"?aiSong():playSong(SONGS[i][0],SONGS[i][1].split(" "),playAlong))}
function rhythm(){const b=shell("🥁 Rhythm game",topicHub);let beat=0,hits=0,tries=0,t0=0,timer=null;
 b.innerHTML=`<p class="kzSub">Tap the drum when the circle flashes. 8 beats!</p><div class="kzDrumWrap"><div class="kzPulse" id="kzPulse"></div><button class="kzDrum" id="kzDrum">🥁</button></div><div class="kzScore" id="kzR">Press Start</div><div class="kzRow"><button class="kzBtn" id="kzGo">Start</button></div>`;
 const P=b.querySelector("#kzPulse");
 b.querySelector("#kzDrum").onclick=()=>{beep(120,.15,"square");if(!timer)return;tries++;const off=Math.abs((Date.now()-t0)%750-0);const near=Math.min(off,750-off);if(near<150){hits++;b.querySelector("#kzR").textContent="Great timing! 🎯 "+hits+" hits"}else b.querySelector("#kzR").textContent="Almost! Listen for the click."};
 b.querySelector("#kzGo").onclick=()=>{clearInterval(timer);beat=0;hits=0;t0=Date.now();timer=setInterval(()=>{beat++;beep(1000,.05);P.classList.remove("on");void P.offsetWidth;P.classList.add("on");if(beat>=8){clearInterval(timer);setTimeout(()=>{timer=null;b.querySelector("#kzR").textContent=`Done! ${hits} on-beat taps. ${hits>=6?"Rock star! 🌟":"Try again to get 6!"}`;if(hits>=6){addStar(2);confetti()}},700)}},750)}}

/* ---------- GAMES ---------- */
const GAMES=[["make","✨","Make a game with AI","Tell it your idea"],["memory","🧠","Memory Match","Find the pairs"],["math","➕","Math Race","60 seconds, go!"],["ttt","❌","Tic-Tac-Toe","Beat Yathin"],["words","🔤","Word Scramble","Fix the word"],["simon","🎨","Color Copy","Copy the colors"]];
function gamesHome(){const b=shell("🎮 Games");tiles(b,GAMES,g=>({make:makeGame,memory,math:mathRace,ttt,words,simon})[g]())}

function makeGame(){const b=shell("✨ Make a game",gamesHome);const IDEAS=["A space shooter with stars","Catch the falling fruit","A maze with a cat","Pop the balloons","A math racing game","Feed the hungry dinosaur"];
 b.innerHTML=`<div class="kzCard"><p class="kzSub" style="margin-top:0">What game should Yathin AI make?</p><div class="kzIn"><input id="kzIdea" placeholder="e.g. a frog that jumps over logs" maxlength="140"><button class="kzBtn" id="kzMake">Make it!</button></div><div class="kzRow" id="kzIdeas"></div><div class="kzSub" id="kzMm"></div></div><div id="kzGame"></div>`;
 const box=b.querySelector("#kzIdeas");IDEAS.forEach(t=>{const x=document.createElement("button");x.className="kzBtn ghost";x.textContent=t;x.onclick=()=>{b.querySelector("#kzIdea").value=t;go()};box.append(x)});
 const msg=b.querySelector("#kzMm"),out=b.querySelector("#kzGame");let busy=false;
 const go=async()=>{const idea=b.querySelector("#kzIdea").value.trim();if(!idea||busy)return;
  if(!safe(idea)||window.YAI.bad&&window.YAI.bad(idea)){msg.textContent="Let's pick a different game idea! 💛";return}
  busy=true;msg.textContent="Building your game… this takes about 30 seconds 🛠️";out.innerHTML="";
  try{let h=null;for(let t=0;t<2&&!h;t++){const o=await ask(`You make fun, simple browser games for kids under 13. Reply with ONE complete self-contained HTML file inside a \`\`\`html code block and nothing else. Rules: plain HTML, CSS and JavaScript only, no external files, no links, no images from the internet (use emoji, shapes or canvas), no text input asking for personal info, no chat. Bright, friendly colors, big buttons, works with mouse, touch and keyboard. Show the score, simple instructions at the top, and a Play again button. No violence, blood, weapons, scary or grown-up content: if the idea needs that, make a gentle version (for example, pop bubbles instead of shooting). Keep it under 250 lines.`,"Game idea: "+idea,"code");
    const m=o.match(/```html\s*([\s\S]*?)```/i)||o.match(/(<!doctype[\s\S]*<\/html>)/i)||o.match(/(<html[\s\S]*<\/html>)/i);h=m&&m[1]}
   if(!h)throw 0;const text=h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g," ");
   if(!safe(text)){msg.textContent="That game didn't come out kid-friendly. Try another idea! 💛";busy=false;return}
   h=h.replace(/<a\b[^>]*href=[^>]*>/gi,"<span>").replace(/<\/a>/gi,"</span>");
   msg.textContent="🎉 Your game is ready!";addStar();
   out.innerHTML=`<div class="kzCard" style="padding:10px"><iframe class="kzFrame" sandbox="allow-scripts" title="Your game"></iframe><div class="kzRow"><button class="kzBtn ghost" id="kzBig">⛶ Full screen</button><button class="kzBtn" id="kzAgain">🔄 Make it again</button></div></div>`;
   const f=out.querySelector("iframe");f.srcdoc="<script>try{localStorage.length}catch(e){const d={};Object.defineProperty(window,'localStorage',{value:{getItem:k=>k in d?d[k]:null,setItem:(k,v)=>{d[k]=String(v)},removeItem:k=>{delete d[k]},clear:()=>{}}})}<\/script>"+h;out.querySelector("#kzAgain").onclick=go;out.querySelector("#kzBig").onclick=()=>{(f.requestFullscreen||f.webkitRequestFullscreen||(()=>{})).call(f)};f.scrollIntoView({behavior:"smooth"})}
  catch(e){msg.textContent="I couldn't build it just now. Try again in a moment."}
  busy=false};
 b.querySelector("#kzMake").onclick=go;b.querySelector("#kzIdea").onkeydown=e=>{if(e.key==="Enter")go()}}
function memory(){const b=shell("🧠 Memory Match",gamesHome);const E=["🐶","🐱","🦊","🐼","🐸","🦁","🐵","🐧"];let cards=[...E,...E].sort(()=>Math.random()-.5),open=[],found=0,moves=0;
 b.innerHTML=`<div class="kzScore" id="kzM">Moves: 0</div><div class="kzMem"></div>`;const g=b.querySelector(".kzMem");
 cards.forEach((e,i)=>{const c=document.createElement("button");c.className="kzCardF";c.innerHTML=`<span>${e}</span>`;c.onclick=()=>{if(c.classList.contains("up")||open.length>1)return;c.classList.add("up");beep(500,.06);open.push([c,e]);
  if(open.length===2){moves++;b.querySelector("#kzM").textContent="Moves: "+moves;const[a,bq]=open;if(a[1]===bq[1]){found++;open=[];yay();if(found===E.length){b.querySelector("#kzM").textContent=`🎉 You found them all in ${moves} moves!`;addStar(2);confetti()}}else setTimeout(()=>{a[0].classList.remove("up");bq[0].classList.remove("up");open=[]},700)}};g.append(c)})}
function mathRace(){const b=shell("➕ Math Race",gamesHome);let sc=0,t=60,tm=null,a,c,op;const g=+(localStorage.getItem("yai-kz-grade")||"2".replace("K","0"))||1;
 const next=()=>{const big=g<=1?10:g<=3?20:12;op=g>=3&&Math.random()<.4?"×":Math.random()<.5?"+":"−";a=1+Math.floor(Math.random()*big);c=1+Math.floor(Math.random()*big);if(op==="−"&&c>a)[a,c]=[c,a];
  const r=op==="+"?a+c:op==="−"?a-c:a*c;const ch=new Set([r]);while(ch.size<4)ch.add(Math.max(0,r+Math.floor(Math.random()*9)-4));
  b.querySelector("#kzEq").textContent=`${a} ${op} ${c} = ?`;const box=b.querySelector("#kzAns");box.innerHTML="";[...ch].sort(()=>Math.random()-.5).forEach(v=>{const x=document.createElement("button");x.textContent=v;x.onclick=()=>{if(!tm)return;if(v===r){sc++;yay()}else boo();b.querySelector("#kzSc").textContent="Score: "+sc;next()};box.append(x)})};
 b.innerHTML=`<div class="kzScore"><span id="kzSc">Score: 0</span> · <span id="kzT">60s</span></div><div class="kzCard"><div class="kzEq" id="kzEq">Ready?</div><div class="kzCh kzAns" id="kzAns"></div></div><div class="kzRow"><button class="kzBtn" id="kzGo">Start</button></div>`;
 b.querySelector("#kzGo").onclick=()=>{clearInterval(tm);sc=0;t=60;b.querySelector("#kzSc").textContent="Score: 0";next();tm=setInterval(()=>{t--;b.querySelector("#kzT").textContent=t+"s";if(t<=0){clearInterval(tm);tm=null;b.querySelector("#kzEq").textContent=`⏰ Time! You got ${sc}`;b.querySelector("#kzAns").innerHTML="";if(sc>=10){addStar(2);confetti()}}},1000)}}
function ttt(){const b=shell("❌ Tic-Tac-Toe",gamesHome);let B=Array(9).fill(""),over=false,lv=localStorage.getItem("yai-ttt-lv")||"medium";const L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 const LV={easy:["🙂 Easy",1],medium:["😎 Medium",2],hard:["🔥 Hard",3]};
 const win=(p,X=B)=>L.some(l=>l.every(i=>X[i]===p));b.innerHTML=`<div class="kzRow" id="kzLv" style="justify-content:center"></div><div class="kzScore" id="kzTs"></div><div class="kzTTT"></div><div class="kzRow"><button class="kzBtn" id="kzRe">New game</button></div>`;
 const lvBox=b.querySelector("#kzLv");const showLv=()=>{lvBox.innerHTML="";Object.keys(LV).forEach(k=>{const x=document.createElement("button");x.className="kzBtn"+(k===lv?"":" ghost");x.textContent=LV[k][0];x.onclick=()=>{lv=k;localStorage.setItem("yai-ttt-lv",k);showLv();reset()};lvBox.append(x)})};
 const g=b.querySelector(".kzTTT");const draw=()=>{g.innerHTML="";B.forEach((v,i)=>{const c=document.createElement("button");c.textContent=v==="X"?"❌":v==="O"?"⭕":"";c.onclick=()=>move(i);g.append(c)})};
 const end=t=>{over=true;b.querySelector("#kzTs").textContent=t};
 const free=X=>X.map((v,k)=>v?-1:k).filter(k=>k>=0),rnd=a=>a[Math.floor(Math.random()*a.length)];
 const two=p=>{for(const l of L){const v=l.map(k=>B[k]);if(v.filter(x=>x===p).length===2&&v.includes(""))return l[v.indexOf("")]}return -1};
 const mm=(X,t)=>{if(win("O",X))return 10;if(win("X",X))return -10;const f=free(X);if(!f.length)return 0;const r=f.map(k=>{X[k]=t;const v=mm(X,t==="O"?"X":"O");X[k]="";return v});return t==="O"?Math.max(...r)-1:Math.min(...r)+1};
 const ai=()=>{const f=free(B);
  if(lv==="easy"){const w=two("O");return w>=0&&Math.random()<.5?w:rnd(f)}
  if(lv==="medium"){let m=two("O");if(m<0)m=two("X");if(m<0||Math.random()<.2)m=B[4]===""&&Math.random()<.6?4:rnd(f);return m}
  let best=-1e9,bm=[];for(const k of f){B[k]="O";const v=mm(B,"X");B[k]="";if(v>best){best=v;bm=[k]}else if(v===best)bm.push(k)}return rnd(bm)};
 const move=i=>{if(over||B[i])return;B[i]="X";beep(520,.08);if(win("X")){draw();end("🎉 You beat "+LV[lv][0]+"!");addStar(LV[lv][1]);confetti();return}if(!B.includes("")){draw();end(lv==="hard"?"A tie on Hard? Amazing! 🤝":"It's a tie! 🤝");if(lv==="hard")addStar();return}
  B[ai()]="O";draw();if(win("O"))end("Yathin wins this time! Try again 💪");else if(!B.includes(""))end("It's a tie! 🤝")};
 const reset=()=>{B=Array(9).fill("");over=false;b.querySelector("#kzTs").textContent="You are ❌ · "+LV[lv][0]+" · Your turn!";draw()};
 b.querySelector("#kzRe").onclick=reset;showLv();reset()}
function words(){const b=shell("🔤 Word Scramble",gamesHome);const W=["apple","tiger","planet","rocket","garden","pencil","school","rainbow","dolphin","castle","banana","jungle","puzzle","guitar","window","friend","summer","bridge","turtle","cookie"];let w,sc=0;
 b.innerHTML=`<div class="kzScore" id="kzWs">Score: 0</div><div class="kzCard"><div class="kzEq" id="kzW"></div><div class="kzIn"><input id="kzGuess" placeholder="Type the word" autocomplete="off"><button class="kzBtn" id="kzChk">Check</button></div><div class="kzSub" id="kzWm"></div><div class="kzRow"><button class="kzBtn ghost" id="kzHint">💡 Hint</button><button class="kzBtn ghost" id="kzSkip">Skip</button></div></div>`;
 const next=()=>{w=W[Math.floor(Math.random()*W.length)];let s;do{s=w.split("").sort(()=>Math.random()-.5).join("")}while(s===w);b.querySelector("#kzW").textContent=s.toUpperCase();b.querySelector("#kzGuess").value="";b.querySelector("#kzWm").textContent=""};
 const chk=()=>{const v=b.querySelector("#kzGuess").value.trim().toLowerCase();if(v===w){sc++;yay();addStar();b.querySelector("#kzWs").textContent="Score: "+sc;b.querySelector("#kzWm").textContent="✅ Yes! "+w;setTimeout(next,900)}else{boo();b.querySelector("#kzWm").textContent="Not quite, try again!"}};
 b.querySelector("#kzChk").onclick=chk;b.querySelector("#kzGuess").onkeydown=e=>{if(e.key==="Enter")chk()};b.querySelector("#kzHint").onclick=()=>b.querySelector("#kzWm").textContent=`It starts with "${w[0].toUpperCase()}" and has ${w.length} letters.`;b.querySelector("#kzSkip").onclick=next;next()}
function simon(){const b=shell("🎨 Color Copy",gamesHome);const C=[["#ef4444",330],["#22c55e",392],["#3b82f6",440],["#facc15",523]];let seq=[],p=0,lock=true;
 b.innerHTML=`<div class="kzScore" id="kzSs">Watch, then copy!</div><div class="kzSimon">${C.map((c,i)=>`<button data-i="${i}" style="background:${c[0]}"></button>`).join("")}</div><div class="kzRow"><button class="kzBtn" id="kzGo">Start</button></div>`;
 const btns=[...b.querySelectorAll(".kzSimon button")];const flash=i=>{btns[i].classList.add("lit");beep(C[i][1],.3);setTimeout(()=>btns[i].classList.remove("lit"),300)};
 const play=()=>{lock=true;p=0;seq.forEach((i,k)=>setTimeout(()=>flash(i),600*k+400));setTimeout(()=>lock=false,600*seq.length+400)};
 btns.forEach(x=>x.onclick=()=>{if(lock)return;const i=+x.dataset.i;flash(i);if(i!==seq[p]){lock=true;boo();b.querySelector("#kzSs").textContent=`Oops! You remembered ${seq.length-1}. Press Start to try again.`;if(seq.length-1>=5){addStar(2)}return}p++;if(p===seq.length){b.querySelector("#kzSs").textContent="Level "+seq.length+" done! 🎉";seq.push(Math.floor(Math.random()*4));setTimeout(play,700)}});
 b.querySelector("#kzGo").onclick=()=>{seq=[Math.floor(Math.random()*4)];b.querySelector("#kzSs").textContent="Watch, then copy!";play()}}

window.KZ={show(m){host=$("#kz");if(!host)return;st={grade:localStorage.getItem("yai-kz-grade")||""};m==="games"?gamesHome():learnHome()},safe,BAD};
})();
