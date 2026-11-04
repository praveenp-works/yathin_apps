# Finko YouTube Shorts thumbnail 1080x1920 (run from videos/)
import numpy as np
src=open('thumbnails/make_yathin_thumbnail.py').read().split('# ---- wide')[0]
exec(src)
def bgsky(W,H,cx,cy):
    import colorsys
    y,x=np.mgrid[0:H,0:W]; dx=(x-cx)/W; dy=(y-cy)/W; r=np.sqrt(dx*dx+dy*dy); ang=np.arctan2(dy,dx)
    hue=((ang/(2*np.pi))+1-0.17)%1
    hue=(hue-0.10*np.sin(2*np.pi*(hue-0.6)))%1   # widen the blue band
    hsv=np.stack([hue,np.full_like(hue,.78),np.full_like(hue,.98)],-1)
    rgb=np.vectorize(lambda h:0)(hue[:1,:1])  # placeholder
    h6=hue*6; i=np.floor(h6).astype(int)%6; f=h6-np.floor(h6); v=.98; s_=.72
    p_=v*(1-s_); q_=v*(1-s_*f); t_=v*(1-s_*(1-f))
    R=np.choose(i,[v,q_,p_,p_,t_,v]); G=np.choose(i,[t_,v,v,q_,p_,p_]); B=np.choose(i,[p_,p_,t_,v,v,q_])
    out=np.stack([R,G,B],-1)*255
    c=np.clip(1-r*2.6,0,1)[...,None]; out=out*(1-c)+np.array([255,246,170])*c   # warm glow centre
    e=np.clip((r-.6)*1.2,0,.2)[...,None]; out=out*(1-e)                          # gentle darker edges
    rays=(np.sin(ang*16)>0.55)*np.clip(1-r*1.1,0,1)*35
    return Image.fromarray(np.clip(out+rays[...,None],0,255).astype('uint8')).convert('RGBA')
bg=bgsky(1080,1920,540,1200); d=ImageDraw.Draw(bg)
fa=ImageFont.truetype(F,120); fb=ImageFont.truetype(F,188)
for y,t,f,c,sw in [(200,'A ROBOT PET',fa,'white',12),(345,'THAT GOES TO',fa,'white',12),(510,'SCHOOL?!',fb,(255,230,40),16)]:
    tw=d.textlength(t,font=f); text(d,((1080-tw)/2,y),t,f,c,sw)
brand(bg,(540,95),58)
# crisp Finko tile: white-to-black gradient + Twemoji robot
g=np.linspace(255,0,1024).astype('uint8'); tile=Image.fromarray(np.repeat(np.repeat(g[:,None],1024,1)[...,None],3,2))
rb=Image.open(E%'1f916').convert('RGBA').resize((720,720),Image.LANCZOS); tile=tile.convert('RGBA'); tile.alpha_composite(rb,(152,170)); tile.convert('RGB').save('/tmp/finko_tile.png')
icon(bg,'/tmp/finko_tile.png',520,(520,1210),-6,(255,255,255))
ring(bg,(520,1210),360,16)
emoji(bg,'270b',260,(870,980),14)
emoji(bg,'1fa90',220,(170,920),-12)
emoji(bg,'1f355',200,(150,1560),-10)
emoji(bg,'1f4b0',190,(920,1540),10)
emoji(bg,'2728',110,(860,1300),0)
sticker(bg,'100% FREE',(540,1790),78,-4)
sticker(bg,'He talks back!',(540,860),54,3,fill=(255,255,255),fg=INK)
bg.convert('RGB').save('thumbnails/finko-thumbnail-vertical.jpg',quality=93)
