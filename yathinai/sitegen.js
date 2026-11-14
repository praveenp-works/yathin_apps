/* Yathin AI site engine: the AI writes the content plan (JSON), this turns it into a polished website. */
(function(){
const PAL={
 sunset:["#f97316","#ec4899","#8b5cf6","#fff7ed"],ocean:["#0ea5e9","#6366f1","#14b8a6","#f0f9ff"],
 forest:["#16a34a","#84cc16","#0d9488","#f0fdf4"],candy:["#ec4899","#a855f7","#f59e0b","#fdf2f8"],
 midnight:["#6366f1","#22d3ee","#a855f7","#0b1020"],gold:["#d97706","#b45309","#78350f","#fffbeb"],
 mono:["#111827","#6b7280","#2563eb","#f9fafb"],berry:["#be185d","#7c3aed","#f43f5e","#fff1f2"]};
const FONTS={bold:["Poppins:wght@400;600;800","Poppins"],elegant:["Playfair+Display:wght@600;800&family=Inter:wght@400;600","Playfair Display","Inter"],playful:["Fredoka:wght@400;600;700","Fredoka"],tech:["Space+Grotesk:wght@400;600;700","Space Grotesk"]};
const e=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const A=x=>Array.isArray(x)?x:[];
function render(S){
 const p=PAL[S.palette]||PAL[Object.keys(PAL)[(S.name||"").length%8]],dark=S.palette==="midnight";
 const f=FONTS[S.style]||FONTS.bold,hf=f[1],bf=f[2]||f[1];
 const bg=dark?"#0b1020":p[3],ink=dark?"#e5e7eb":"#1f1b2e",card=dark?"rgba(255,255,255,.06)":"#fff",mut=dark?"#94a3b8":"#6b7280";
 const nav=A(S.sections).length?A(S.sections):["Features","About","Pricing","Reviews","FAQ","Contact"];
 const H=S.hero||{},ab=S.about||{},pr=S.pricing||{},ct=S.contact||{};
 const feats=A(S.features).slice(0,6),stats=A(ab.stats).slice(0,4),items=A(pr.items).slice(0,4),revs=A(S.testimonials).slice(0,6),faq=A(S.faq).slice(0,6),gal=A(S.gallery).slice(0,6);
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(S.name)}</title>
<link href="https://fonts.googleapis.com/css2?family=${f[0]}&display=swap" rel="stylesheet">
<style>
:root{--a:${p[0]};--b:${p[1]};--c:${p[2]};--bg:${bg};--ink:${ink};--card:${card};--mut:${mut}}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:'${bf}',system-ui,sans-serif;background:var(--bg);color:var(--ink);line-height:1.65;overflow-x:hidden}
body.dk{--bg:#0b1020;--ink:#e5e7eb;--card:rgba(255,255,255,.06);--mut:#94a3b8}
h1,h2,h3{font-family:'${hf}',sans-serif;line-height:1.1;margin:0 0 .4em}h2{font-size:clamp(30px,4vw,48px)}
a{color:inherit}.wrap{max-width:1140px;margin:0 auto;padding:0 24px}section{padding:96px 0}
.eyebrow{display:inline-block;font-weight:700;font-size:13px;letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(90deg,var(--a),var(--b));-webkit-background-clip:text;color:transparent;margin-bottom:10px}
.lead{color:var(--mut);font-size:18px;max-width:640px}
nav{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:50;width:min(1100px,94vw);display:flex;align-items:center;gap:18px;padding:10px 14px 10px 20px;border-radius:999px;background:color-mix(in srgb,var(--bg) 72%,transparent);backdrop-filter:blur(16px);box-shadow:0 8px 30px rgba(0,0,0,.08);transition:.3s}
nav .logo{font-family:'${hf}';font-weight:800;font-size:20px;text-decoration:none;display:flex;gap:8px;align-items:center}
nav .links{display:flex;gap:20px;margin-left:auto}nav .links a{text-decoration:none;font-weight:600;font-size:14px;opacity:.75}nav .links a:hover{opacity:1}
.btn{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:13px 26px;font:700 15px '${bf}',sans-serif;cursor:pointer;text-decoration:none;color:#fff;background:linear-gradient(135deg,var(--a),var(--b));box-shadow:0 10px 24px color-mix(in srgb,var(--a) 40%,transparent);transition:transform .2s,box-shadow .2s}
.btn:hover{transform:translateY(-3px) scale(1.03)}.btn.ghost{background:transparent;color:inherit;box-shadow:inset 0 0 0 2px currentColor}
.icon-btn{border:0;background:none;font-size:18px;cursor:pointer;color:inherit}
.menu{display:none}
.hero{min-height:100vh;display:grid;place-items:center;text-align:center;position:relative;overflow:hidden;padding:140px 0 90px;color:#fff;background:linear-gradient(135deg,var(--a),var(--b) 55%,var(--c));background-size:200% 200%;animation:shift 12s ease infinite}
@keyframes shift{50%{background-position:100% 100%}}
.blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.45;animation:float 14s ease-in-out infinite}
.blob.b1{width:420px;height:420px;background:#fff;top:-120px;left:-80px}.blob.b2{width:360px;height:360px;background:var(--c);bottom:-100px;right:-60px;animation-delay:-5s}
@keyframes float{50%{transform:translate(40px,30px) scale(1.1)}}
.hero h1{font-size:clamp(42px,7vw,86px);font-weight:800;letter-spacing:-.02em;text-shadow:0 6px 30px rgba(0,0,0,.15)}
.hero p{font-size:clamp(17px,2vw,22px);max-width:680px;margin:0 auto 30px;opacity:.95}
.hero .btn{background:#fff;color:var(--a)}.hero .btn.ghost{background:transparent;color:#fff}
.big-emoji{font-size:84px;display:inline-block;animation:bob 3s ease-in-out infinite;filter:drop-shadow(0 12px 20px rgba(0,0,0,.2))}
@keyframes bob{50%{transform:translateY(-14px) rotate(4deg)}}
.badge{display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);padding:6px 14px;border-radius:999px;font-weight:600;font-size:14px;margin-bottom:18px;backdrop-filter:blur(6px)}
.marquee{overflow:hidden;white-space:nowrap;background:var(--ink);color:var(--bg);padding:16px 0;font-weight:700}
.marquee div{display:inline-block;animation:mq 25s linear infinite}.marquee span{margin:0 28px}@keyframes mq{to{transform:translateX(-50%)}}
.grid{display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));margin-top:40px}
.card{background:var(--card);border-radius:24px;padding:28px;box-shadow:0 10px 30px rgba(20,10,60,.07);border:1px solid color-mix(in srgb,var(--a) 12%,transparent);transition:transform .3s,box-shadow .3s;position:relative;overflow:hidden}
.card:hover{transform:translateY(-8px) rotate(-.4deg);box-shadow:0 22px 50px rgba(20,10,60,.14)}
.card .ic{width:56px;height:56px;border-radius:16px;display:grid;place-items:center;font-size:28px;background:linear-gradient(135deg,color-mix(in srgb,var(--a) 20%,transparent),color-mix(in srgb,var(--b) 20%,transparent));margin-bottom:14px}
.card p{color:var(--mut);margin:0}
.split{display:grid;grid-template-columns:1.1fr 1fr;gap:56px;align-items:center}
.art{aspect-ratio:1;border-radius:32px;background:linear-gradient(135deg,var(--a),var(--b),var(--c));display:grid;place-items:center;font-size:150px;position:relative;box-shadow:0 30px 60px color-mix(in srgb,var(--a) 35%,transparent)}
.art::after{content:"";position:absolute;inset:18px;border:2px dashed rgba(255,255,255,.5);border-radius:24px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:18px;margin-top:28px}
.stat b{display:block;font-family:'${hf}';font-size:40px;background:linear-gradient(90deg,var(--a),var(--b));-webkit-background-clip:text;color:transparent}.stat span{color:var(--mut);font-size:14px}
.gal{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px}
.gal div{aspect-ratio:4/3;border-radius:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:64px;color:#fff;text-align:center;transition:transform .3s}
.gal div small{font-size:15px;font-weight:600;margin-top:6px}.gal div:hover{transform:scale(1.04)}
.price{text-align:center}.price .amt{font-family:'${hf}';font-size:44px;font-weight:800;margin:6px 0}
.price.hot{background:linear-gradient(160deg,var(--a),var(--b));color:#fff;transform:scale(1.04)}.price.hot p{color:rgba(255,255,255,.85)}
.price ul{list-style:none;padding:0;margin:16px 0 22px;text-align:left}.price li{padding:6px 0}.price li::before{content:"✓ ";font-weight:800;color:var(--a)}.price.hot li::before{color:#fff}
.price.hot .btn{background:#fff;color:var(--a)}
.rev{font-size:17px}.rev .stars{color:#f59e0b;letter-spacing:2px}.rev .who{margin-top:14px;font-weight:700;display:flex;gap:10px;align-items:center}
.rev .av{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,var(--a),var(--c))}
details{background:var(--card);border-radius:18px;padding:18px 22px;margin-top:12px;box-shadow:0 4px 14px rgba(0,0,0,.05);cursor:pointer}
summary{font-weight:700;list-style:none;display:flex;justify-content:space-between}summary::after{content:"+";font-size:22px;transition:.3s}details[open] summary::after{transform:rotate(45deg)}details p{color:var(--mut);margin:10px 0 0}
.cta{border-radius:36px;padding:70px 40px;text-align:center;color:#fff;background:linear-gradient(135deg,var(--b),var(--a));position:relative;overflow:hidden}
form{display:grid;gap:12px}input,textarea{font:inherit;padding:14px 18px;border-radius:16px;border:1px solid color-mix(in srgb,var(--ink) 15%,transparent);background:var(--card);color:var(--ink)}
footer{padding:40px 0;text-align:center;color:var(--mut);font-size:14px}
.rv{opacity:0;transform:translateY(40px);transition:opacity .8s,transform .8s}.rv.in{opacity:1;transform:none}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(120px);background:var(--ink);color:var(--bg);padding:14px 24px;border-radius:999px;font-weight:600;transition:.4s;z-index:99}.toast.on{transform:translateX(-50%)}
#top{position:fixed;right:20px;bottom:20px;width:48px;height:48px;border-radius:50%;border:0;color:#fff;background:linear-gradient(135deg,var(--a),var(--b));font-size:20px;cursor:pointer;opacity:0;transition:.3s;z-index:40}
.bar{position:fixed;top:0;left:0;height:4px;background:linear-gradient(90deg,var(--a),var(--b),var(--c));z-index:60;width:0}
@media(max-width:800px){nav .links{display:none;position:absolute;top:64px;left:0;right:0;flex-direction:column;background:var(--bg);padding:20px;border-radius:24px}nav.open .links{display:flex}.menu{display:block}.split{grid-template-columns:1fr}.gal{grid-template-columns:1fr 1fr}}
</style></head><body${dark?' class="dk"':""}>
<div class="bar" id="bar"></div>
<nav id="nav"><a class="logo" href="#home">${e(S.emoji||"✨")} ${e(S.name)}</a><div class="links">${nav.slice(0,6).map(n=>`<a href="#${e(String(n).toLowerCase())}">${e(n)}</a>`).join("")}</div><button class="icon-btn" id="mode" title="Dark mode">🌙</button><a class="btn" href="#contact" style="padding:10px 20px">${e(H.cta1||"Get started")}</a><button class="icon-btn menu" id="menu">☰</button></nav>
<header class="hero" id="home"><div class="blob b1"></div><div class="blob b2"></div><div class="wrap" style="position:relative">
<div class="big-emoji">${e(S.emoji||"✨")}</div><br><span class="badge">${e(H.badge||S.tagline||"")}</span>
<h1>${e(H.title||S.name)}</h1><p>${e(H.subtitle||S.tagline||"")}</p>
<a class="btn" href="#contact">${e(H.cta1||"Get started")} →</a> <a class="btn ghost" href="#features">${e(H.cta2||"Learn more")}</a></div></header>
<div class="marquee"><div>${[...feats,...feats].map(x=>`<span>${e(x.emoji)} ${e(x.title)}</span>`).join("").repeat(2)}</div></div>
<section id="features"><div class="wrap"><div class="rv"><span class="eyebrow">${e(S.featuresTitle?"Why us":"Features")}</span><h2>${e(S.featuresTitle||"Everything you need")}</h2></div>
<div class="grid">${feats.map((x,i)=>`<div class="card rv" style="transition-delay:${i*.08}s"><div class="ic">${e(x.emoji)}</div><h3>${e(x.title)}</h3><p>${e(x.text)}</p></div>`).join("")}</div></div></section>
<section id="about"><div class="wrap split"><div class="rv"><span class="eyebrow">About</span><h2>${e(ab.title||"Our story")}</h2><p class="lead">${e(ab.text||"")}</p>
<div class="stats">${stats.map(s=>`<div class="stat"><b data-n="${e(s.number)}">${e(s.number)}</b><span>${e(s.label)}</span></div>`).join("")}</div></div><div class="art rv">${e(ab.emoji||S.emoji||"✨")}</div></div></section>
${gal.length?`<section id="gallery" style="padding-top:0"><div class="wrap"><div class="rv"><span class="eyebrow">Gallery</span><h2>${e(S.galleryTitle||"Take a look")}</h2></div><div class="gal">${gal.map((g,i)=>`<div class="rv" style="background:linear-gradient(${135+i*40}deg,var(--${"abc"[i%3]}),var(--${"bca"[i%3]}))">${e(g.emoji)}<small>${e(g.label)}</small></div>`).join("")}</div></div></section>`:""}
${items.length?`<section id="pricing"><div class="wrap"><div class="rv" style="text-align:center"><span class="eyebrow">${e(pr.eyebrow||"Pricing")}</span><h2>${e(pr.title||"Simple pricing")}</h2></div>
<div class="grid">${items.map((x,i)=>`<div class="card price rv${i===1||items.length===1?" hot":""}"><h3>${e(x.name)}</h3><div class="amt">${e(x.price)}</div><p>${e(x.text)}</p><ul>${A(x.perks).slice(0,4).map(k=>`<li>${e(k)}</li>`).join("")}</ul><a class="btn" href="#contact">Choose</a></div>`).join("")}</div></div></section>`:""}
${revs.length?`<section id="reviews" style="padding-top:0"><div class="wrap"><div class="rv" style="text-align:center"><span class="eyebrow">Reviews</span><h2>People love it</h2></div>
<div class="grid">${revs.map(r=>`<div class="card rev rv"><div class="stars">★★★★★</div><p>"${e(r.quote)}"</p><div class="who"><span class="av">${e((r.name||"?")[0])}</span>${e(r.name)}</div></div>`).join("")}</div></div></section>`:""}
${faq.length?`<section id="faq" style="padding-top:0"><div class="wrap" style="max-width:820px"><div class="rv" style="text-align:center"><span class="eyebrow">FAQ</span><h2>Questions? Answers.</h2></div>${faq.map(q=>`<details class="rv"><summary>${e(q.q)}</summary><p>${e(q.a)}</p></details>`).join("")}</div></section>`:""}
<section id="contact"><div class="wrap"><div class="cta rv"><div class="blob b1" style="opacity:.25"></div><div style="position:relative"><h2>${e(ct.title||"Ready to start?")}</h2><p style="font-size:18px;opacity:.9;max-width:560px;margin:0 auto 26px">${e(ct.text||"")}</p>
${S.kid?`<a class="btn" href="#home" style="background:#fff;color:var(--a)">Back to top ↑</a>`:`<form id="form" style="max-width:520px;margin:0 auto"><input required placeholder="Your name"><input required type="email" placeholder="Your email"><textarea rows="3" placeholder="Message"></textarea><button class="btn" style="background:#fff;color:var(--a);justify-content:center">Send →</button></form>`}
<p style="margin-top:20px;opacity:.85">${S.kid?"":[ct.email,ct.phone,ct.address].filter(Boolean).map(e).join(" · ")}</p></div></div></div></section>
<footer>${e(S.emoji||"")} ${e(S.name)} · ${e(S.tagline||"")}<br>© ${new Date().getFullYear()} ${e(S.name)}. Made with Yathin AI.</footer>
<button id="top">↑</button><div class="toast" id="toast"></div>
<script>
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12});document.querySelectorAll(".rv").forEach(el=>io.observe(el));
const st=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;const b=x.target,raw=b.dataset.n,m=raw.match(/[\\d.]+/);if(!m)return;const end=parseFloat(m[0]),pre=raw.slice(0,m.index),suf=raw.slice(m.index+m[0].length);let t0=null;const step=t=>{t0=t0||t;const k=Math.min(1,(t-t0)/1400);b.textContent=pre+(end%1?(end*k).toFixed(1):Math.round(end*k))+suf;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);st.unobserve(b)}));document.querySelectorAll(".stat b").forEach(b=>st.observe(b));
addEventListener("scroll",()=>{const h=document.documentElement;document.getElementById("bar").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+"%";document.getElementById("top").style.opacity=h.scrollTop>600?1:0});
document.getElementById("top").onclick=()=>scrollTo({top:0,behavior:"smooth"});
document.getElementById("mode").onclick=()=>document.body.classList.toggle("dk");
document.getElementById("menu").onclick=()=>document.getElementById("nav").classList.toggle("open");
const toast=t=>{const el=document.getElementById("toast");el.textContent=t;el.classList.add("on");setTimeout(()=>el.classList.remove("on"),2600)};
const fm=document.getElementById("form");if(fm)fm.onsubmit=ev=>{ev.preventDefault();ev.target.reset();toast("Thanks! We'll get back to you soon. 🎉")};
<\/script></body></html>`}
const SYS="You plan websites. Reply ONLY with JSON (no words, no code fences) using this exact shape and filling EVERY field with real, specific, creative text for the request (never lorem ipsum, never placeholders):\n"+JSON.stringify({name:"Short brand name",tagline:"Catchy one-line tagline",emoji:"one emoji for the brand",palette:"one of sunset|ocean|forest|candy|midnight|gold|mono|berry (pick what fits)",style:"one of bold|elegant|playful|tech",sections:["Features","About","Pricing","Reviews","FAQ","Contact"],hero:{badge:"short badge like New in town",title:"Big bold headline",subtitle:"1-2 sentence pitch",cta1:"Main button",cta2:"Second button"},featuresTitle:"Section headline",features:[{emoji:"🎯",title:"Feature",text:"One sentence"}],about:{title:"About headline",text:"3-4 sentences story",emoji:"emoji",stats:[{number:"500+",label:"Happy customers"}]},galleryTitle:"Gallery headline",gallery:[{emoji:"🍰",label:"Item name"}],pricing:{eyebrow:"Menu or Pricing",title:"Headline",items:[{name:"Plan or item",price:"$9",text:"One sentence",perks:["perk","perk","perk"]}]},testimonials:[{quote:"Specific praise",name:"Full Name"}],faq:[{q:"Question?",a:"Answer."}],contact:{title:"CTA headline",text:"One sentence",email:"hello@example.com",phone:"(555) 123-4567",address:"City"}})+"\nUse 6 features, 3-4 stats, 6 gallery items, 3 pricing items, 3 testimonials, 4 FAQs.";
window.YSite={render,SYS};
})();
