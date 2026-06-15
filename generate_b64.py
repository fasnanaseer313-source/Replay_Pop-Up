import base64

with open(r'assets\tripo_rc_car.glb', 'rb') as f:
    data = f.read()

b64 = base64.b64encode(data).decode('utf-8')

js_content = f'''const carGlbBase64 = "data:model/gltf-binary;base64,{b64}";
document.addEventListener("DOMContentLoaded", () => {{
    document.getElementById("crawler-car").src = carGlbBase64;
}});
'''

with open(r'assets\model_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Base64 JS file generated successfully!")
