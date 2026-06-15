import os

replacements = {
    'â€”': '—',
    'â—†': '◆',
    'â‚¹': '₹',
    'â€œ': '“',
    'â€': '”',
    'â†’': '→',
    'â€¢': '•',
    'â• ': '═',
    'âš¡': '⚡',
}

files_to_fix = ['index.html', 'script.js', 'style.css']

for filepath in files_to_fix:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original = content
        for k, v in replacements.items():
            content = content.replace(k, v)
            
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Successfully fixed corrupted characters in {filepath}")
        else:
            print(f"No corrupted characters found in {filepath}")
    except Exception as e:
        print(f"Failed to fix {filepath}: {e}")
