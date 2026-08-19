import os
import re

filepath = "c:\\Users\\ASUS\\OneDrive\\Documents\\REPLAY RC car web\\index.html"
with open(filepath, "r", encoding="utf-8") as f:
    html = f.read()

reviews = [
    {
        "author": "Angel's",
        "text": "\"We recently had a ladies' get-together... We decided to go with Replay, and I have to say it was one of the best decisions!\""
    },
    {
        "author": "Muhammad Aqeel",
        "text": "\"The games were absolutely amazing! We had so much fun as a team... A must-try for anyone looking for a memorable and fun-filled time.\""
    },
    {
        "author": "Swetha S",
        "text": "\"Forget the usual standard hangouts—Team Replay just set a whole new bar for group entertainment! It's the perfect blend of interactive fun and unique entertainment.\""
    },
    {
        "author": "G K Jamuna",
        "text": "\"Such a good experience. The team is very supportive and guided how to play. Organising was superb. Mind refreshing.\""
    },
    {
        "author": "siva subramanian",
        "text": "\"Had a fantastic experience! The racing arena was well designed and the tracks were exciting. Everything was well organized and I truly enjoyed every moment.\""
    }
]

svg_icon = """<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>"""

def build_review_html(review):
    return f'''            <div class="mini-review">
              <div class="mr-header">
                <div class="mr-stars">★★★★★</div>
                <div class="mr-google-icon">
                  {svg_icon}
                </div>
              </div>
              <div class="mr-text">{review["text"]}</div>
              <div class="mr-author">{review["author"]}</div>
            </div>'''

set1_html = "<!-- Set 1 -->\n" + "\n".join([build_review_html(r) for r in reviews])
set2_html = "<!-- Set 2 (Duplicate for infinite scroll) -->\n" + "\n".join([build_review_html(r) for r in reviews])

new_content = set1_html + '\n\n            ' + set2_html

start_marker = "<!-- Set 1 -->"
end_marker = "</div>\n        </div>\n      </div>\n    </section>"

start_idx = html.find(start_marker)
end_idx = html.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    new_html = html[:start_idx] + new_content + "\n          " + html[end_idx:]
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_html)
    print("Successfully replaced reviews.")
else:
    print("Markers not found.")
