from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np, math
F='/workspace/work/fonts/Poppins-ExtraBold.ttf'
E='/workspace/work/fonts/e_%s.png'
ICONS=['../magiccursor/logo.png','../classview/classview_icon.png','../plantdoc/plantdoc_icon.png','../fridgechef/fridgechef_icon.png']
GLOW=[(200,170,255),(80,240,220),(120,255,150),(255,180,80)]
INK=(14,6,30)
def rr(im,r):
    m=Image.new('L',im.size,0); ImageDraw.Draw(m).rounded_rectangle([0,0,im.size[0]-1,im.size[1]-1],r,fill=255); im=im.convert('RGBA'); im.putalpha(m); return im
def bgimg(W,H,cx,cy):
    y,x=np.mgrid[0:H,0:W]; dx=(x-cx)/W; dy=(y-cy)/W; r=np.sqrt(dx*dx+dy*dy)
    stops=[(0,(255,210,60)),(.25,(255,110,60)),(.55,(200,30,120)),(1,(60,10,90))]
    out=np.zeros((H,W,3))
    for c in range(3): out[...,c]=np.interp(r,[s[0] for s in stops],[s[1][c] for s in stops])
    ang=np.arctan2(dy,dx); rays=(np.sin(ang*16)>0.55)*np.clip(1-r*1.1,0,1)*40
    out=out+rays[...,None]
    return Image.fromarray(np.clip(out,0,255).astype('uint8')).convert('RGBA')
def paste_rot(bg,L,center,rot):
    L=L.rotate(rot,resample=Image.BICUBIC,expand=True); bg.alpha_composite(L,(int(center[0]-L.width/2),int(center[1]-L.height/2)))
def icon(bg,p,size,pos,rot,glow):
    ic=rr(Image.open(p).convert('RGB').resize((size,size),Image.LANCZOS),int(size*.23))
    pad=size//2; L=Image.new('RGBA',(size+2*pad,size+2*pad),(0,0,0,0))
    o=Image.new('RGBA',L.size,(255,255,255,0)); m=Image.new('L',L.size,0); ImageDraw.Draw(m).rounded_rectangle([pad-9,pad-9,pad+size+9,pad+size+9],int(size*.27),fill=255); o.putalpha(m)
    g=Image.new('RGBA',L.size,glow+(0,)); g.putalpha(m.filter(ImageFilter.GaussianBlur(size*.16)))
    sh=Image.new('RGBA',L.size,(0,0,0,0)); sm=Image.new('L',L.size,0); ImageDraw.Draw(sm).rounded_rectangle([pad,pad+size*.1,pad+size,pad+size*1.1],int(size*.23),fill=170); sh.putalpha(sm.filter(ImageFilter.GaussianBlur(16)))
    L.alpha_composite(g); L.alpha_composite(sh); L.alpha_composite(o); L.alpha_composite(ic,(pad,pad)); paste_rot(bg,L,pos,rot)
def emoji(bg,code,size,pos,rot):
    e=Image.open(E%code).convert('RGBA').resize((size,size),Image.LANCZOS)
    pad=30; L=Image.new('RGBA',(size+2*pad,size+2*pad),(0,0,0,0))
    sh=Image.new('RGBA',L.size,(0,0,0,0)); sh.putalpha(Image.new('L',L.size,0)); a=Image.new('L',L.size,0); a.paste(e.split()[3],(pad+8,pad+14)); sh.putalpha(a.filter(ImageFilter.GaussianBlur(10)).point(lambda p:int(p*.5)))
    L.alpha_composite(sh); L.alpha_composite(e,(pad,pad)); paste_rot(bg,L,pos,rot)
def text(d,xy,t,f,fill,sw=10):
    d.text((xy[0]+6,xy[1]+10),t,font=f,fill=(0,0,0,150),stroke_width=sw,stroke_fill=(0,0,0,150))
    d.text(xy,t,font=f,fill=fill,stroke_width=sw,stroke_fill=INK)
def sticker(bg,txt,center,size,rot,fill=(255,40,60),fg='white'):
    f=ImageFont.truetype(F,size); tw=ImageDraw.Draw(bg).textlength(txt,font=f)
    L=Image.new('RGBA',(int(tw+size*1.2),int(size*1.9)),(0,0,0,0)); d=ImageDraw.Draw(L)
    d.rounded_rectangle([8,12,L.width-2,L.height-2],size//3,fill=(0,0,0,130))
    d.rounded_rectangle([0,0,L.width-10,L.height-14],size//3,fill=fill,outline=INK,width=7)
    d.text(((L.width-10-tw)/2,(L.height-14)/2-size*.66),txt,font=f,fill=fg)
    paste_rot(bg,L,center,rot)
def ring(bg,center,r,w=12,col=(255,40,60)):
    d=ImageDraw.Draw(bg); x,y=center
    pts=[(x+r*1.08*math.cos(t)+6*math.sin(5*t),y+r*.95*math.sin(t)) for t in np.linspace(-0.4,2*math.pi+0.25,80)]
    d.line(pts,fill=INK,width=w+8,joint='curve'); d.line(pts,fill=col,width=w,joint='curve')
def arrow(bg,pts,w=16,col=(255,40,60)):
    d=ImageDraw.Draw(bg); d.line(pts,fill=INK,width=w+10,joint='curve'); d.line(pts,fill=col,width=w,joint='curve')
    (x1,y1),(x2,y2)=pts[-2],pts[-1]; a=math.atan2(y2-y1,x2-x1); L=52
    d.polygon([(x2+14*math.cos(a),y2+14*math.sin(a)),(x2-L*math.cos(a-0.5),y2-L*math.sin(a-0.5)),(x2-L*math.cos(a+0.5),y2-L*math.sin(a+0.5))],fill=col,outline=INK,width=6)
def curve(p0,p1,p2,n=30): return [((1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0],(1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]) for t in [i/n for i in range(n+1)]]

LABELS=['Cool cursors','Class screens','Plant checkup','Fridge recipes']
def labels(bg,pts,size):
    for t,(x,y) in zip(LABELS,pts): sticker(bg,t,(x,y),size,0,fill=(255,255,255),fg=INK)
# ---- wide 1280x720
bg=bgimg(1280,720,930,360); d=ImageDraw.Draw(bg)
for p,s,pos,r,g in zip(ICONS,[175,185,185,175],[(820,175),(1100,215),(850,500),(1130,520)],[-12,9,7,-10],GLOW): icon(bg,p,s,pos,r,g)
ring(bg,(820,175),140)
emoji(bg,'2728',80,(975,420),0); emoji(bg,'1f525',90,(1235,415),12)
f1=ImageFont.truetype(F,96); f2=ImageFont.truetype(F,150)
text(d,(46,40),'THESE APPS',f1,'white'); text(d,(40,140),'ARE',f2,'white'); text(d,(40,300),'FREE?!',f2,(255,230,40),12)
emoji(bg,'1f631',200,(560,600),-8)
sticker(bg,'100% FREE',(240,585),62,-6)
arrow(bg,curve((540,330),(620,250),(700,215)))
labels(bg,[(820,300),(1100,345),(850,628),(1120,645)],32)
bg.convert('RGB').save('thumbnails/yathin-thumbnail.jpg',quality=93)
# ---- square 1080x1080
bg=bgimg(1080,1080,540,700); d=ImageDraw.Draw(bg)
for p,s,pos,r,g in zip(ICONS,[200,210,210,200],[(300,575),(790,560),(320,880),(800,870)],[-12,9,7,-10],GLOW): icon(bg,p,s,pos,r,g)
ring(bg,(300,575),158)
emoji(bg,'1f631',200,(555,770),-6); emoji(bg,'2728',80,(545,520),0); emoji(bg,'1f525',90,(1000,560),12)
f1=ImageFont.truetype(F,104); f2=ImageFont.truetype(F,170)
for y,t,f,c in [(40,'THESE APPS ARE',f1,'white'),(165,'FREE?!',f2,(255,230,40))]:
    tw=d.textlength(t,font=f); text(d,((1080-tw)/2,y),t,f,c,12)
sticker(bg,'100% FREE',(560,395),56,-5)
labels(bg,[(300,722),(790,707),(320,1030),(800,1020)],38)
bg.convert('RGB').save('thumbnails/yathin-thumbnail-square.jpg',quality=93)
# ---- vertical 1080x1920
bg=bgimg(1080,1920,540,1150); d=ImageDraw.Draw(bg)
fa=ImageFont.truetype(F,130); fb=ImageFont.truetype(F,230)
for y,t,f,c,sw in [(150,'THESE APPS',fa,'white',12),(300,'ARE',fb,'white',14),(530,'FREE?!',fb,(255,230,40),16)]:
    tw=d.textlength(t,font=f); text(d,((1080-tw)/2,y),t,f,c,sw)
sticker(bg,'100% FREE',(540,860),70,-5)
for p,s,pos,r,g in zip(ICONS,[270,280,280,270],[(290,1130),(800,1110),(300,1480),(810,1470)],[-12,9,7,-10],GLOW): icon(bg,p,s,pos,r,g)
ring(bg,(290,1130),205,14)
emoji(bg,'2728',120,(560,960),0); emoji(bg,'1f525',120,(1010,1385),12); emoji(bg,'2728',80,(60,1410),0)
emoji(bg,'1f631',230,(540,1795),-6)
labels(bg,[(290,1320),(800,1300),(300,1668),(810,1655)],52)
bg.convert('RGB').save('thumbnails/yathin-thumbnail-vertical.jpg',quality=93)
