# What to Wear + Screen Read thumbnails, Plant Doc style (run from videos/; frames in /tmp/fr)
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
FB='/workspace/work/fonts/Poppins-ExtraBold.ttf'; FS='/workspace/work/fonts/Poppins-SemiBold.ttf'
APPS={
 'whattowear':dict(name='What to Wear',icon='../whattowear/whattowear_icon_sq.png',c=[(72,177,251),(102,103,181),(240,44,56)],hook=['WRONG','JACKET?'],tint=(255,236,170),pill='Check the sky. Get your outfit.'),
 'screenread':dict(name='Screen Read',icon='../screenread/screenread_icon_sq.png',c=[(242,197,0),(111,168,160),(2,120,254)],hook=['STILL','TYPING?'],tint=(255,240,150),pill='Screenshot it. Copy the text.'),
}
def grad(W,H,cols,ang):
    y,x=np.mgrid[0:H,0:W]; a=np.deg2rad(ang); t=(x*np.cos(a)+y*np.sin(a)); t=(t-t.min())/(t.max()-t.min())
    out=np.zeros((H,W,3))
    for k in range(3): out[...,k]=np.interp(t,[0,.5,1],[c[k] for c in cols])
    return Image.fromarray(out.astype('uint8')).convert('RGBA')
def rr(im,r):
    m=Image.new('L',im.size,0); ImageDraw.Draw(m).rounded_rectangle([0,0,im.size[0]-1,im.size[1]-1],r,fill=255); im=im.convert('RGBA'); im.putalpha(m); return im
def win(bg,src,box,w,pos,rot):
    im=Image.open(src).convert('RGB').crop(box); im=im.resize((w,int(im.height*w/im.width)),Image.LANCZOS); im=rr(im,int(w*.025))
    pad=60; L=Image.new('RGBA',(im.width+2*pad,im.height+2*pad),(0,0,0,0))
    sm=Image.new('L',L.size,0); ImageDraw.Draw(sm).rounded_rectangle([pad,pad+20,pad+im.width,pad+im.height+20],30,fill=150)
    sh=Image.new('RGBA',L.size,(0,0,0,0)); sh.putalpha(sm.filter(ImageFilter.GaussianBlur(26))); L.alpha_composite(sh); L.alpha_composite(im,(pad,pad))
    L=L.rotate(rot,resample=Image.BICUBIC,expand=True); bg.alpha_composite(L,(int(pos[0]),int(pos[1])))
def head(bg,a,x,y,s):
    ic=rr(Image.open(a['icon']).convert('RGB').resize((s,s),Image.LANCZOS),int(s*.24))
    d=ImageDraw.Draw(bg); d.rounded_rectangle([x-5,y-5,x+s+5,y+s+5],int(s*.27),fill=(20,20,28)); bg.alpha_composite(ic,(x,y))
    d.text((x+s+int(s*.28),y+s*.5),a['name'],font=ImageFont.truetype(FS,int(s*.5)),fill='white',anchor='lm')
def txt(d,xy,t,f,fill,anchor='la'):
    d.text((xy[0]+6,xy[1]+8),t,font=f,fill=(0,0,0,170),stroke_width=8,stroke_fill=(0,0,0,170),anchor=anchor)
    d.text(xy,t,font=f,fill=fill,stroke_width=8,stroke_fill=(18,10,30),anchor=anchor)
def pill(d,xy,t,size,anchor='l'):
    f=ImageFont.truetype(FS,size); tw=d.textlength(t,font=f); h=int(size*1.75); x,y=xy
    if anchor=='c': x=x-(tw+size*1.4)/2
    d.rounded_rectangle([x,y,x+tw+size*1.4,y+h],h//2,fill=(14,14,20)); d.text((x+size*.7,y+h/2),t,font=f,fill='white',anchor='lm')
for k,a in APPS.items():
    full=f'/tmp/fr/{k}_full.png'; vfull=f'/tmp/fr/{k}-vertical_full.png'
    # wide
    bg=grad(1280,720,a['c'],25); d=ImageDraw.Draw(bg)
    win(bg,full,(340,180,1580,900),740,(660,200),4)
    head(bg,a,60,52,96); f=ImageFont.truetype(FB,116)
    txt(d,(60,185),a['hook'][0],f,'white'); txt(d,(60,305),a['hook'][1],f,a['tint'])
    pill(d,(60,490),a['pill'],36)
    bg.convert('RGB').save(f'thumbnails/{k}-thumbnail.jpg',quality=93)
    # square
    bg=grad(1080,1080,a['c'],35); d=ImageDraw.Draw(bg)
    win(bg,full,(340,180,1580,900),900,(130,560),-3)
    s=90; f=ImageFont.truetype(FS,45); tw=d.textlength(a['name'],font=f); head(bg,a,int(540-(s+25+tw)/2),50,s)
    f=ImageFont.truetype(FB,150); txt(d,(540,175),a['hook'][0]+' '+a['hook'][1] if len(a['hook'][0]+a['hook'][1])<9 else a['hook'][0],f,'white','ma')
    txt(d,(540,330),a['hook'][1],f,a['tint'],'ma') if len(a['hook'][0]+a['hook'][1])>=9 else None
    pill(d,(540,0),'',1,'c') if False else None
    bg.convert('RGB').save(f'thumbnails/{k}-thumbnail-square.jpg',quality=93)
    # vertical
    bg=grad(1080,1920,a['c'],80); d=ImageDraw.Draw(bg)
    s=120; f=ImageFont.truetype(FS,60); tw=d.textlength(a['name'],font=f); head(bg,a,int(540-(s+34+tw)/2),110,s)
    f=ImageFont.truetype(FB,200); txt(d,(540,340),a['hook'][0],f,'white','ma'); txt(d,(540,560),a['hook'][1],f,a['tint'],'ma')
    pill(d,(540,830),a['pill'],48,'c')
    win(bg,vfull,(60,335,1020,1200),900,(40,1010),-3)
    bg.convert('RGB').save(f'thumbnails/{k}-thumbnail-vertical.jpg',quality=93)
