import json, re

html = open(r'C:\Users\ASUS\.gemini\antigravity-ide\brain\0f036755-8afe-44dc-abec-05b3615df0cd\.system_generated\steps\188\content.md', encoding='utf-8').read()
urls = re.findall(r'https?://[^\s\"\'\\]+\.glb', html.replace('\\u002F', '/'))
print("\n".join(urls))
