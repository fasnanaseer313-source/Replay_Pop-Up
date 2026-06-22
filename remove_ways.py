import sys

content = open('index.html', 'r', encoding='utf-8').read()

start_marker = '<!-- 6. WAYS TO REPLAY -->'
end_marker = '<!-- 7. EDITORIAL TESTIMONIALS -->'

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    if start_idx < end_idx:
        # We remove from start_marker up to right before end_marker
        new_content = content[:start_idx] + content[end_idx:]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('Successfully removed the WAYS TO REPLAY section.')
    else:
        print('Error: end_marker found before start_marker.')
else:
    print('Error: markers not found in index.html.')
