# Packs dist/<exe>.exe into an MSIX using identities from store/identities.json.
import os, sys, json, glob, shutil, subprocess
from xml.sax.saxutils import escape as e
from PIL import Image
app, exe, icon, title, desc, cam, arch, run = sys.argv[1:9]
ids = json.load(open("store/identities.json"))[app]
root = "msix"; os.makedirs(root + "/Assets", exist_ok=True)
shutil.copy(f"dist/{exe}.exe", f"{root}/{exe}.exe")
big = Image.open(icon).convert("RGBA")
for n, s in [("StoreLogo.png", 50), ("Square44x44Logo.png", 44), ("Square44x44Logo.targetsize-256_altform-unplated.png", 256), ("Square150x150Logo.png", 150)]:
    big.resize((s, s), Image.LANCZOS).save(f"{root}/Assets/{n}")
w = Image.new("RGBA", (310, 150), (0, 0, 0, 0)); w.paste(big.resize((120, 120), Image.LANCZOS), (95, 15)); w.save(f"{root}/Assets/Wide310x150Logo.png")
camcap = '<DeviceCapability Name="webcam"/>' if cam == "yes" else ""
m = f"""<?xml version="1.0" encoding="utf-8"?>
<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10" xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10" xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities" IgnorableNamespaces="uap rescap">
  <Identity Name="{e(ids['name'])}" Publisher="{e(ids['publisher'])}" Version="1.{run}.0.0" ProcessorArchitecture="{arch}"/>
  <Properties><DisplayName>{e(ids['display'])}</DisplayName><PublisherDisplayName>{e(ids['publisher_display'])}</PublisherDisplayName><Logo>Assets\\StoreLogo.png</Logo></Properties>
  <Dependencies><TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.26100.0"/></Dependencies>
  <Resources><Resource Language="en-us"/></Resources>
  <Applications><Application Id="{exe}" Executable="{exe}.exe" EntryPoint="Windows.FullTrustApplication">
    <uap:VisualElements DisplayName="{e(ids['display'])}" Description="{e(desc)}" BackgroundColor="transparent" Square150x150Logo="Assets\\Square150x150Logo.png" Square44x44Logo="Assets\\Square44x44Logo.png"><uap:DefaultTile Wide310x150Logo="Assets\\Wide310x150Logo.png"/></uap:VisualElements>
  </Application></Applications>
  <Capabilities><Capability Name="internetClient"/><rescap:Capability Name="runFullTrust"/>{camcap}</Capabilities>
</Package>"""
open(f"{root}/AppxManifest.xml", "w", encoding="utf-8").write(m)
tool = sorted(glob.glob(r"C:\Program Files (x86)\Windows Kits\10\bin\10.*\*\makeappx.exe"))[-1]
subprocess.run([tool, "pack", "/d", root, "/p", f"dist/{exe}-{run}-{arch}.msix", "/o"], check=True)
