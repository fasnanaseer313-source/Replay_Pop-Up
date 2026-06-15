import os

def fix_mojibake(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        fixed_content = content.encode('windows-1252').decode('utf-8')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Successfully fixed {filepath}")
    except Exception as e:
        print(f"Failed to fix {filepath} via encode/decode: {e}")

fix_mojibake('index.html')
