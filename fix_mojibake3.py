import os

filepath = 'index.html'
try:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    content = content.replace('Â·', '•')
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully fixed corrupted characters in {filepath}")
    else:
        print(f"No corrupted characters found in {filepath}")
except Exception as e:
    print(f"Failed to fix {filepath}: {e}")
