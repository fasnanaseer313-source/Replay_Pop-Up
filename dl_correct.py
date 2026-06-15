import json, re, urllib.request

html = open(r'C:\Users\ASUS\.gemini\antigravity-ide\brain\0f036755-8afe-44dc-abec-05b3615df0cd\.system_generated\steps\188\content.md', encoding='utf-8').read()
html = html.replace('\\u002F', '/')

uuid = "0e51fb9e-316c-4586-94ba-163d2c6907e5"

urls = re.findall(r'(https?://[^\s\"\'\\]+' + uuid + r'[^\s\"\'\\]+\.glb)', html)

for u in urls:
    if 'meshopt' in u and 'tripo_texture' in u:
        print("Found best texture URL:", u)
        urllib.request.urlretrieve(u, r'assets\user_tripo_car.glb')
        exit(0)

for u in urls:
    if 'meshopt' in u and ('tripo_pbr_model' in u or 'tripo_base_model' in u):
        print("Found fallback model URL:", u)
        urllib.request.urlretrieve(u, r'assets\user_tripo_car.glb')
        exit(0)

for u in urls:
    if 'meshopt' in u:
        print("Found any meshopt URL:", u)
        urllib.request.urlretrieve(u, r'assets\user_tripo_car.glb')
        exit(0)

print("Could not find GLB for UUID:", uuid)
