"""Record narrated demo videos for Yathin Apps (runs in GitHub Actions)."""
import asyncio, functools, glob, http.server, json, os, shutil, subprocess, threading, time
import edge_tts
from playwright.sync_api import sync_playwright

VOICE = "en-US-AvaNeural"
ROOT = os.path.abspath(".")
os.makedirs("out", exist_ok=True)

h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8811), h)
threading.Thread(target=srv.serve_forever, daemon=True).start()


def dur(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).strip())


async def tts(text, path):
    await edge_tts.Communicate(text, VOICE, rate="+4%").save(path)


def say(t, path, voice=VOICE, rate="+10%"):
    for k in range(8):
        r = subprocess.run(["edge-tts", "--voice", voice, f"--rate={rate}", "--text", t, "--write-media", path])
        if r.returncode == 0 and os.path.exists(path) and os.path.getsize(path) > 1000: return
        time.sleep(3 + 2 * k)
    raise SystemExit("TTS failed: " + t)


def lines_for(sc):
    out = []
    for s in sc["scenes"]:
        if s.get("hook"): out.append(s["hook"])
        elif s.get("end"): out.append(f'{sc["title"]}. Free on Yathin Apps.')
        else: out.append(s.get("cap", ""))
    return out


def run(app):
    work = f"work_{app}"; os.makedirs(work, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        ctx = b.new_context(viewport={"width": 1920, "height": 1080}, record_video_dir=f"vid_{app}",
                            record_video_size={"width": 1920, "height": 1080})
        pg = ctx.new_page(); t_page = time.time()
        pg.goto(f"http://127.0.0.1:8811/videos/src/director.html?app={app}", wait_until="networkidle")
        sc = pg.evaluate("S")
        lines = sc["lines"]
        clips = []
        for i, t in enumerate(lines):
            path = f"{work}/n{i}.mp3"; say(t, path, sc.get("voice", VOICE), sc.get("rate", "+10%")); clips.append(path)
        durs = [dur(c) for c in clips]
        pg.wait_for_timeout(500)
        t_go = time.time()
        pg.evaluate(f"start({json.dumps(durs)})")
        pg.wait_for_function("window.__done === true", timeout=180000, polling=200)
        marks = pg.evaluate("window.__marks"); total = pg.evaluate("window.__total")
        ctx.close(); b.close()
    raw = glob.glob(f"vid_{app}/*.webm")[0]
    off = t_go - t_page
    # narration track: each clip delayed to its scene start (+250 ms)
    inputs, filt = [], []
    for i, (c, m) in enumerate(zip(clips, marks)):
        inputs += ["-i", c]; d = int(m) + 250
        filt.append(f"[{i}:a]aresample=44100,adelay={d}|{d},volume=1.6[a{i}]")
    n = len(clips); T = total / 1000.0
    music = (f"aevalsrc='0.5*sin(2*PI*130.81*t)+0.35*sin(2*PI*196*t)+0.3*sin(2*PI*246.94*t)+0.25*sin(2*PI*329.63*t)':s=44100:d={T:.2f},"
             f"tremolo=f=0.25:d=0.5,lowpass=f=900,volume=0.05,afade=t=in:d=1.5,afade=t=out:st={max(0,T-2):.2f}:d=2[m]")
    filt.append(music)
    mix = "".join(f"[a{i}]" for i in range(n)) + f"[m]amix=inputs={n+1}:normalize=0:duration=longest,loudnorm=I=-16:TP=-1.5:LRA=11[aout]"
    filt.append(mix)
    subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[aout]", "-t", f"{T:.2f}", f"{work}/audio.m4a"], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{off:.3f}", "-i", raw, "-i", f"{work}/audio.m4a",
                    "-t", f"{T:.2f}", "-map", "0:v", "-map", "1:a", "-vf", "fps=30,format=yuv420p",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-c:a", "aac", "-b:a", "160k",
                    "-movflags", "+faststart", f"out/{app}-demo.mp4"], check=True)
    print(app, "done", round(T, 1), "s; offset", round(off, 2))


for a in os.environ.get("VIDEO_APPS", "plantdoc fridgechef classview yathin").split():
    run(a)
