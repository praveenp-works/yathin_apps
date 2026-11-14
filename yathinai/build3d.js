/* Yathin AI 3D builder: expands AI+ "components" (tower, wall, building, gate, spire, rock, bridge, stairs) into many simple parts. */
(function(){
const N=(v,d)=>{v=Number(v);return isFinite(v)?v:d};
const DARK="#2b2f3a";
function rot(dx,dz,a){const c=Math.cos(a),s=Math.sin(a);return[dx*c+dz*s,-dx*s+dz*c]}
function tower(c,out){const[x,y,z]=(c.pos||[0,0,0]).map(Number);const r=N(c.r||c.radius,8),h=N(c.h||c.height,40),col=c.color||"#9ca3af",rc=c.roofColor||col;
 const sides=c.square?4:24;
 if(c.square)out.push({shape:"box",size:[r*2,h,r*2],pos:[x,y+h/2,z],color:col});else out.push({shape:"cylinder",size:[r,h,r],pos:[x,y+h/2,z],color:col});
 // string courses
 const bands=Math.max(1,Math.round(h/(r*2.2)));for(let i=1;i<=bands;i++){const yy=y+h*i/(bands+1);if(c.square)out.push({shape:"box",size:[r*2.12,r*.12,r*2.12],pos:[x,yy,z],color:col});else out.push({shape:"cylinder",size:[r*1.06,r*.12,r*1.06],pos:[x,yy,z],color:col})}
 // windows: rows x 4 around
 const rows=Math.max(1,Math.min(8,N(c.windows,Math.round(h/(r*1.6)))));for(let i=0;i<rows;i++){const yy=y+h*(i+.7)/(rows+.6);for(let k=0;k<4;k++){const a=k*Math.PI/2+(i%2?Math.PI/4*(c.square?0:1):0);const ww=r*.28,wh=r*.6,rr=c.square?r:r*.98;
   out.push({shape:"box",size:[ww,wh,r*.12],pos:[x+Math.sin(a)*rr,yy,z+Math.cos(a)*rr],rot:[0,a*57.2958,0],color:DARK});
   out.push({shape:"pyramid",size:[ww*1.1,ww*.8,r*.14],pos:[x+Math.sin(a)*rr,yy+wh/2+ww*.4,z+Math.cos(a)*rr],rot:[0,a*57.2958,0],color:col})}}
 const top=y+h,roof=c.roof||"cone";
 if(roof==="flat"||c.crenel){const rr=r*1.18,ch=r*.35;if(c.square)out.push({shape:"box",size:[rr*2,ch,rr*2],pos:[x,top+ch/2,z],color:col});else out.push({shape:"cylinder",size:[rr,ch,rr],pos:[x,top+ch/2,z],color:col});
  const n=c.square?12:Math.max(8,Math.round(rr*1.1));for(let k=0;k<n;k++){const a=k/n*Math.PI*2;out.push({shape:"box",size:[rr*.32,r*.35,rr*.2],pos:[x+Math.sin(a)*rr*.92,top+ch+r*.17,z+Math.cos(a)*rr*.92],rot:[0,a*57.2958,0],color:col})}
  if(roof==="flat")return}
 const base=roof==="flat"?top:top+(c.crenel?r*.35:0);
 if(roof==="dome"){out.push({shape:"dome",size:[r*1.05,r*1.05,r*1.05],pos:[x,base,z],color:rc});out.push({shape:"cone",size:[r*.12,r*.9,r*.12],pos:[x,base+r*1.05+r*.4,z],color:rc});return}
 const rh=N(c.roofH,r*(c.tall?4:2.6));
 if(c.square)out.push({shape:"pyramid",size:[r*2.4,rh,r*2.4],pos:[x,base+rh/2,z],color:rc});else out.push({shape:"cone",size:[r*1.2,rh,r*1.2],pos:[x,base+rh/2,z],color:rc});
 out.push({shape:"cylinder",size:[r*1.22,r*.1,r*1.22],pos:[x,base+r*.05,z],color:rc});
 out.push({shape:"sphere",size:[r*.14,r*.14,r*.14],pos:[x,base+rh+r*.05,z],color:rc});out.push({shape:"cone",size:[r*.05,r*.7,r*.05],pos:[x,base+rh+r*.4,z],color:rc});
 // little dormers
 if(r>5&&!c.square)for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;const d=r*.75;out.push({shape:"prism",size:[r*.4,r*.5,r*.5],pos:[x+Math.sin(a)*d,base+rh*.25,z+Math.cos(a)*d],rot:[0,a*57.2958+90,0],color:rc})}}
function spire(c,out){const[x,y,z]=(c.pos||[0,0,0]).map(Number);const r=N(c.r,2),h=N(c.h,30),col=c.color||"#9ca3af";
 out.push({shape:"cylinder",size:[r,h*.35,r],pos:[x,y+h*.175,z],color:col});out.push({shape:"cone",size:[r*1.1,h*.65,r*1.1],pos:[x,y+h*.35+h*.325,z],color:c.roofColor||col});out.push({shape:"sphere",size:[r*.3,r*.3,r*.3],pos:[x,y+h,z],color:col})}
function wall(c,out){const f=c.from||[0,0],t=c.to||[40,0];const y=N(c.y,0),h=N(c.h,20),th=N(c.t,3),col=c.color||"#9ca3af";const dx=t[0]-f[0],dz=t[1]-f[1],L=Math.hypot(dx,dz)||1,a=Math.atan2(dx,dz),deg=a*57.2958+90;
 const mx=(f[0]+t[0])/2,mz=(f[1]+t[1])/2;out.push({shape:"box",size:[L,h,th],pos:[mx,y+h/2,mz],rot:[0,deg,0],color:col});
 out.push({shape:"box",size:[L,th*.4,th*1.6],pos:[mx,y+h-th*.2,mz],rot:[0,deg,0],color:col});
 if(c.crenel!==false){const n=Math.max(2,Math.floor(L/(th*1.6)));for(let i=0;i<n;i++){const k=(i+.5)/n;out.push({shape:"box",size:[L/n*.55,th*.9,th*1.4],pos:[f[0]+dx*k,y+h+th*.45,f[1]+dz*k],rot:[0,deg,0],color:col})}}
 const w=N(c.windows,0);for(let i=0;i<w;i++){const k=(i+.5)/w;const nx=Math.cos(a),nz=-Math.sin(a);for(const sgn of[1,-1]){out.push({shape:"box",size:[th*.6,h*.28,.6],pos:[f[0]+dx*k+nx*th*.5*sgn,y+h*.55,f[1]+dz*k+nz*th*.5*sgn],rot:[0,deg,0],color:DARK})}}
 if(c.buttress)for(let i=0;i<=Math.floor(L/(h*.8));i++){const k=i/Math.max(1,Math.floor(L/(h*.8)));const nx=Math.cos(a),nz=-Math.sin(a);out.push({shape:"box",size:[th,h*.7,th*1.2],pos:[f[0]+dx*k+nx*th,y+h*.35,f[1]+dz*k+nz*th],rot:[0,deg,0],color:col})}}
function building(c,out){const[x,y,z]=(c.pos||[0,0,0]).map(Number);const w=N(c.w,30),d=N(c.d,20),h=N(c.h,25),fl=Math.max(1,Math.min(10,N(c.floors,Math.round(h/10)))),col=c.color||"#9ca3af",rc=c.roofColor||"#6b7280",ay=N(c.rotY,0)*Math.PI/180;
 const P=(dx,dy,dz,p)=>{const[rx,rz]=rot(dx,dz,ay);p.pos=[x+rx,y+dy,z+rz];p.rot=[(p.rot||[0,0,0])[0],(p.rot?p.rot[1]:0)+N(c.rotY,0),(p.rot||[0,0,0])[2]];out.push(p)};
 P(0,h/2,0,{shape:"box",size:[w,h,d],color:col});
 P(0,h+.6,0,{shape:"box",size:[w+1.2,1.2,d+1.2],color:col});
 const nw=Math.max(1,Math.floor(w/7));for(let f=0;f<fl;f++){const yy=h*(f+.55)/fl;for(let i=0;i<nw;i++){const xx=-w/2+w*(i+.5)/nw;if(f===0&&nw>2&&i===Math.floor(nw/2))continue;
   for(const s of[1,-1]){P(xx,yy,s*d/2,{shape:"box",size:[2.2,h/fl*.45,.7],color:DARK});P(xx,yy+h/fl*.225+.9,s*d/2,{shape:"pyramid",size:[2.6,1.8,.9],color:col})}}
  const nd=Math.max(1,Math.floor(d/8));for(let i=0;i<nd;i++){const zz=-d/2+d*(i+.5)/nd;for(const s of[1,-1])P(s*w/2,yy,zz,{shape:"box",size:[2.2,h/fl*.45,.7],rot:[0,90,0],color:DARK})}}
 P(0,Math.min(h*.45,9)/2,d/2+.4,{shape:"arch",size:[Math.min(w*.3,8),Math.min(h*.45,9),1.5],color:col});P(0,Math.min(h*.45,9)/2-.5,d/2+.1,{shape:"box",size:[Math.min(w*.3,8)*.6,Math.min(h*.45,9)*.8,.5],color:DARK});
 const roof=c.roof||"gable",rh=N(c.roofH,Math.min(w,d)*.7);
 if(roof==="gable")P(0,h+1.2+rh/2,0,{shape:"prism",size:[d+1.5,rh,w+1.5],rot:[0,90,0],color:rc});
 else if(roof==="hip")P(0,h+1.2+rh/2,0,{shape:"pyramid",size:[Math.max(w,d)+1.5,rh,Math.min(w,d)+1.5],color:rc});
 else if(roof==="dome")P(0,h+1.2,0,{shape:"dome",size:[Math.min(w,d)*.45,0,0],color:rc});
 else if(roof==="flat"){const n=Math.max(4,Math.floor((w+d)*2/4));for(let i=0;i<n;i++){const k=i/n*2*(w+d);let px,pz;if(k<w){px=-w/2+k;pz=d/2}else if(k<w+d){px=w/2;pz=d/2-(k-w)}else if(k<2*w+d){px=w/2-(k-w-d);pz=-d/2}else{px=-w/2;pz=-d/2+(k-2*w-d)}P(px,h+2.2,pz,{shape:"box",size:[1.6,2,1.6],color:col})}}
 if(roof==="gable"&&c.dormers!==false&&w>16){const n=Math.floor(w/12);for(let i=0;i<n;i++){const xx=-w/2+w*(i+.5)/n;P(xx,h+1.2+rh*.3,d/4,{shape:"box",size:[3,3,3],color:col});P(xx,h+1.2+rh*.3+2.5,d/4,{shape:"prism",size:[3.4,2,3.4],rot:[0,0,0],color:rc})}}
 if(c.chimney)P(w*.3,h+rh*.8,0,{shape:"box",size:[2.5,rh*.9,2.5],color:col})}
function gate(c,out){const[x,y,z]=(c.pos||[0,0,0]).map(Number);const w=N(c.w,16),h=N(c.h,20),t=N(c.t,6),col=c.color||"#9ca3af",a=N(c.rotY,0);const ar=a*Math.PI/180;
 out.push({shape:"arch",size:[w,h,t],pos:[x,y+h/2,z],rot:[0,a,0],color:col});
 const[ox,oz]=rot(w/2+3,0,ar);for(const s of[1,-1])tower({pos:[x+ox*s,y,z+oz*s],r:4.5,h:h*1.35,roof:c.roof||"cone",color:col,roofColor:c.roofColor,windows:2},out)}
function bridge(c,out){const f=c.from||[0,0],t=c.to||[60,0];const y=N(c.y,0),h=N(c.h,14),w=N(c.w,8),col=c.color||"#9ca3af";const dx=t[0]-f[0],dz=t[1]-f[1],L=Math.hypot(dx,dz)||1,deg=Math.atan2(dx,dz)*57.2958+90;const n=Math.max(1,Math.round(L/(h*1.2)));
 for(let i=0;i<n;i++){const k=(i+.5)/n;out.push({shape:"arch",size:[L/n,h,w],pos:[f[0]+dx*k,y+h/2,f[1]+dz*k],rot:[0,deg,0],color:col})}
 out.push({shape:"box",size:[L,1.5,w+1],pos:[(f[0]+t[0])/2,y+h+.75,(f[1]+t[1])/2],rot:[0,deg,0],color:col});
 for(const s of[1,-1]){const a=deg*Math.PI/180;const nx=Math.sin(a+Math.PI/2)*0,_=0;}}
function rockBase(c,out){const[x,y,z]=(c.pos||[0,0,0]).map(Number);const r=N(c.r,50),h=N(c.h,20),col=c.color||"#8b8f98";let seed=N(c.seed,7);const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
 out.push({shape:"rock",size:[r,h,r*N(c.depth,1)],pos:[x,y+h/2,z],color:col,seed:seed});
 const n=Math.round(10+r/5);for(let i=0;i<n;i++){const a=rnd()*Math.PI*2,d=r*(.6+rnd()*.45),s=r*(.12+rnd()*.18);out.push({shape:"rock",size:[s,h*(.4+rnd()*.7),s],pos:[x+Math.sin(a)*d,y+h*.3,z+Math.cos(a)*d*N(c.depth,1)],color:col,seed:Math.floor(rnd()*999)})}
 if(c.path){const steps=Math.round(h/2.5);for(let i=0;i<steps;i++){const a=-Math.PI/2+i*.35;const d=r*.95;out.push({shape:"box",size:[6,1.2,3],pos:[x+Math.sin(a)*d,y+i*(h/steps),z+Math.cos(a)*d],rot:[0,a*57.2958,0],color:col})}}}
function expand(parts){const out=[];for(const p of parts||[]){if(out.length>2500)break;const t=(p.type||"").toLowerCase();
  try{if(t==="tower")tower(p,out);else if(t==="spire")spire(p,out);else if(t==="wall")wall(p,out);else if(t==="building"||t==="keep"||t==="hall"||t==="house")building(p,out);else if(t==="gate")gate(p,out);else if(t==="bridge")bridge(p,out);else if(t==="rock"||t==="cliff"||t==="hill")rockBase(p,out);else out.push(p)}catch(e){}}
 return out}
window.YB={expand};
})();
