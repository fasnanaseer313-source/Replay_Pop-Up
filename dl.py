import json, re, urllib.request

html = open(r'C:\Users\ASUS\.gemini\antigravity-ide\brain\0f036755-8afe-44dc-abec-05b3615df0cd\.system_generated\steps\188\content.md', encoding='utf-8').read()
m = re.search(r'"(https:\\u002F\\u002Ftripo-data[^\"]+meshopt\.glb[^\"]+)"', html)
if m:
    url = m.group(1).replace('\\u002F', '/')
    print("Found URL, downloading...")
    urllib.request.urlretrieve(url, r'assets\tripo_rc_car.glb')
    print("Done")
else:
    print("URL not found")
