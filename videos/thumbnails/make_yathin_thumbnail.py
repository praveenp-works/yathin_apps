from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np, math
F='/tmp/Poppins-ExtraBold.ttf'; S='/tmp/Poppins-SemiBold.ttf'
ICONS=['../magiccursor/logo.png','../classview/classview_icon.png','../plantdoc/plantdoc_icon.png','../fridgechef/fridgechef_icon.png']
GLOW=[(167,139,250),(45,212,191),(74,222,128),(251,146,60)]
def rr(im,r):
    m=Image.new('L',im.size,0); ImageDraw.Draw(m).rounded_rectangle([0,0,im.size[0]-1,im.size[1]-1],r,fill=255); im=im.convert('RGBA'); im.putalpha(m); return im
def bgimg(W,H,cx,cy):
    y,x=np.mgrid[0:H,0:W]; dx=(x-cx)/W; dy=(y-cy)/W; r=np.sqrt(dx*dx+dy*dy)
    base=np.array([12,10,30])+np.array([30,90,110])*np.clip(1-r*1.6,0,1)[...,None]
    ang=np.arctan2(dy,dx); rays=(np.sin(ang*14)>0.6)*np.clip(1-r*1.3,0,1)*28
    out=base+rays[...,None]
    return Image.fromarray(np.clip(out,0,255).astype('uint8')).convert('RGBA')
def icon(bg,p,size,pos,rot,glow):
    ic=rr(Image.open(p).convert('RGB').resize((size,size),Image.LANCZOS),int(size*.23))
    pad=size//2; L=Image.new('RGBA',(size+2*pad,size+2*pad),(0,0,0,0))
    g=Image.new('RGBA',L.size,glow+(0,)); m=Image.new('L',L.size,0); ImageDraw.Draw(m).rounded_rectangle([pad-10,pad-10,pad+size+10,pad+size+10],int(size*.3),fill=200)
    g.putalpha(m.filter(ImageFilter.GaussianBlur(size*.18))); L.alpha_composite(g)
    sh=Image.new('RGBA',L.size,(0,0,0,0)); sm=Image.new('L',L.size,0); ImageDraw.Draw(sm).rounded_rectangle([pad,pad+size*.08,pad+size,pad+size*1.08],int(size*.23),fill=150); sh.putalpha(sm.filter(ImageFilter.GaussianBlur(14)))
    L.alpha_composite(sh); L.alpha_composite(ic,(pad,pad)); L=L.rotate(rot,resample=Image.BICUBIC,expand=True)
    bg.alpha_composite(L,(int(pos[0]-L.width/2),int(pos[1]-L.height/2)))
def stroke_text(d,xy,t,f,fill,sw=8):
    d.text((xy[0]+5,xy[1]+9),t,font=f,fill=(0,0,0,140))
    d.text(xy,t,font=f,fill=fill,stroke_width=sw,stroke_fill=(10,8,24))
def sticker(bg,txt,center,size,rot):
    f=ImageFont.truetype(F,size); tmp=ImageDraw.Draw(bg); tw=tmp.textlength(txt,font=f)
    L=Image.new('RGBA',(int(tw+size*1.4),int(size*2.2)),(0,0,0,0)); d=ImageDraw.Draw(L)
    d.rounded_rectangle([6,10,L.width-6,L.height-4],size//2,fill=(0,0,0,120))
    d.rounded_rectangle([0,0,L.width-10,L.height-14],size//2,fill=(255,214,10),outline=(10,8,24),width=6)
    d.text(((L.width-10-tw)/2,(L.height-14)/2-size*.62),txt,font=f,fill=(10,8,24))
    L=L.rotate(rot,resample=Image.BICUBIC,expand=True); bg.alpha_composite(L,(int(center[0]-L.width/2),int(center[1]-L.height/2)))
def arrow(bg,pts,w=14,col=(255,59,48)):
    d=ImageDraw.Draw(bg)
    d.line(pts,fill=(10,8,24),width=w+10,joint='curve'); d.line(pts,fill=col,width=w,joint='curve')
    (x1,y1),(x2,y2)=pts[-2],pts[-1]; a=math.atan2(y2-y1,x2-x1); L=46
    head=[(x2+12*math.cos(a),y2+12*math.sin(a)),(x2-L*math.cos(a-0.5),y2-L*math.sin(a-0.5)),(x2-L*math.cos(a+0.5),y2-L*math.sin(a+0.5))]
    d.polygon(head,fill=col,outline=(10,8,24),width=5)
def curve(p0,p1,p2,n=30): return [((1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0],(1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]) for t in [i/n for i in range(n+1)]]
# wide
bg=bgimg(1280,720,960,360); d=ImageDraw.Draw(bg)
for p,s,pos,r,g in zip(ICONS,[190,200,190,200],[(850,190),(1110,250),(860,500),(1120,530)],[-10,8,6,-8],GLOW): icon(bg,p,s,pos,r,g)
f=ImageFont.truetype(F,98); stroke_text(d,(50,130),'FREE APPS',f,'white'); stroke_text(d,(50,240),'FOR YOUR',f,'white'); stroke_text(d,(50,350),'WHOLE DAY',f,(255,214,10))
sticker(bg,'100% FREE',(250,560),54,6)
arrow(bg,curve((560,610),(650,700),(730,560)))
bg.convert('RGB').save('thumbnails/yathin-thumbnail.jpg',quality=93); bg.convert('RGB').resize((640,360)).save('/tmp/w.png')
# square
bg=bgimg(1080,1080,540,760); d=ImageDraw.Draw(bg)
for p,s,pos,r,g in zip(ICONS,[200,210,200,210],[(300,640),(780,620),(320,900),(790,890)],[-10,8,6,-8],GLOW): icon(bg,p,s,pos,r,g)
f=ImageFont.truetype(F,112)
for y,t,c in [(60,'FREE APPS FOR',  'white'),(200,'YOUR WHOLE DAY',(255,214,10))]:
    tw=d.textlength(t,font=f); stroke_text(d,((1080-tw)/2,y),t,f,c)
sticker(bg,'100% FREE',(540,770),50,-6)
bg.convert('RGB').save('thumbnails/yathin-thumbnail-square.jpg',quality=93); bg.convert('RGB').resize((540,540)).save('/tmp/s.png')
