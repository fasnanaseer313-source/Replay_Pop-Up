import sys

content = open('index.html', 'r', encoding='utf-8').read()

target = '''                .social-icon-link {
                  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  z-index: 20;
                  pointer-events: auto;
                  color: #ccc;
                  background: rgba(255,255,255,0.05);
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  border: 1px solid rgba(255,255,255,0.1);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                }
                .social-icon-link svg {
                  width: 24px;
                  height: 24px;
                  fill: currentColor;
                }
                .social-icon-link:hover {
                  transform: scale(1.15) translateY(-5px);
                  color: var(--orange, #ff6a00);
                  border-color: rgba(255, 106, 0, 0.5);
                  background: rgba(255, 106, 0, 0.1);
                  box-shadow: 0 10px 20px rgba(0,0,0,0.4), 0 0 15px rgba(255, 106, 0, 0.3);
                  filter: drop-shadow(0 0 8px rgba(255, 106, 0, 0.6));
                }'''

replacement = '''                .social-icon-link {
                  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  z-index: 20;
                  pointer-events: auto;
                  color: #ccc;
                  background: rgba(255,255,255,0.05);
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  border: 1px solid rgba(255,255,255,0.1);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                }
                .social-icon-link.email { color: #ff6a00; }
                .social-icon-link.phone { color: #ff6a00; }
                .social-icon-link.linkedin { color: #0077b5; }
                .social-icon-link.facebook { color: #1877f2; }
                .social-icon-link.instagram svg path { fill: url(#instaGradient); }
                
                .social-icon-link svg {
                  width: 24px;
                  height: 24px;
                  fill: currentColor;
                }
                .social-icon-link:hover {
                  transform: scale(1.15) translateY(-5px);
                  color: var(--orange, #ff6a00);
                  border-color: rgba(255, 106, 0, 0.5);
                  background: rgba(255, 106, 0, 0.1);
                  box-shadow: 0 10px 20px rgba(0,0,0,0.4), 0 0 15px rgba(255, 106, 0, 0.3);
                  filter: drop-shadow(0 0 8px rgba(255, 106, 0, 0.6));
                }
                .social-icon-link.instagram:hover svg path {
                  fill: currentColor;
                }'''

if target not in content:
    print('Target 1 not found')
    sys.exit(1)

content = content.replace(target, replacement)

content = content.replace('class="social-icon-link" aria-label="Email Us"', 'class="social-icon-link email" aria-label="Email Us"')
content = content.replace('class="social-icon-link" aria-label="Call Us"', 'class="social-icon-link phone" aria-label="Call Us"')
content = content.replace('class="social-icon-link" aria-label="Follow on Instagram"', 'class="social-icon-link instagram" aria-label="Follow on Instagram"')
content = content.replace('class="social-icon-link" aria-label="Connect on LinkedIn"', 'class="social-icon-link linkedin" aria-label="Connect on LinkedIn"')
content = content.replace('class="social-icon-link" aria-label="Follow on Facebook"', 'class="social-icon-link facebook" aria-label="Follow on Facebook"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
