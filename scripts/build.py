from pathlib import Path
import shutil
root=Path(__file__).resolve().parent.parent
out=root/'dist'
if out.exists(): shutil.rmtree(out)
out.mkdir()
for name in ['index.html','style.css','app.js','config.js','brush.js']:
 shutil.copy2(root/name,out/name)
shutil.copytree(root/'public',out/'public',ignore=shutil.ignore_patterns('*.jpg','*.png','gaze-original.mp4','frame-*.webp','blink-*.webp','atelier.webp','tools.webp','portrait.webp','eye.webp'))
print('Éclat Purple — static production build ready in dist/')
