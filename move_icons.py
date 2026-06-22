import sys

content = open('index.html', 'r', encoding='utf-8').read()

block_to_move = '''              <style>
                .contact-social-icons {
                  display: flex;
                  gap: 20px;
                  align-items: center;
                  position: relative;
                  z-index: 20;
                }
                .social-icon-link {
                  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  z-index: 20;
                  pointer-events: auto;
                }
                .social-icon-link:hover {
                  transform: scale(1.15);
                }
                .social-icon-link.linkedin {
                  color: #0077b5;
                }
                .social-icon-link.facebook {
                  color: #1877f2;
                }
                .social-icon-link.linkedin:hover {
                  filter: drop-shadow(0 0 10px rgba(0, 119, 181, 0.6));
                }
                .social-icon-link.facebook:hover {
                  filter: drop-shadow(0 0 10px rgba(24, 119, 242, 0.6));
                }
                .social-icon-link.instagram:hover {
                  filter: drop-shadow(0 0 10px rgba(214, 36, 159, 0.6));
                }
              </style>
              <div class="contact-social-icons gs-reveal">
                <a href="https://www.instagram.com/replaypopup?utm_source=qr&igsh=a3BwemVoa20xMWg5" target="_blank" rel="noopener noreferrer" class="social-icon-link instagram" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
                    <defs>
                      <linearGradient id="instaGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#fd5949" />
                        <stop offset="50%" stop-color="#d6249f" />
                        <stop offset="100%" stop-color="#285AEB" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#instaGradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/replay-popup/" target="_blank" rel="noopener noreferrer" class="social-icon-link linkedin" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/18pEtFEfyi/" target="_blank" rel="noopener noreferrer" class="social-icon-link facebook" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
              </div>'''

if block_to_move in content:
    content = content.replace(block_to_move, '')
else:
    print('Block not found!')
    sys.exit(1)

target = '''            <div class="footer-contact-details">
              <a href="mailto:hello@replaypopup.in" class="footer-contact-link">hello@replaypopup.in</a>
              <a href="tel:+919987412025" class="footer-contact-link">+91 9987412025</a>

            </div>'''

if target in content:
    replacement = f'''            <div class="footer-contact-details">
              <a href="mailto:hello@replaypopup.in" class="footer-contact-link">hello@replaypopup.in</a>
              <a href="tel:+919987412025" class="footer-contact-link">+91 9987412025</a>
              
              <div style="margin-top: 15px;">
{block_to_move}
              </div>

            </div>'''
    content = content.replace(target, replacement)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Successfully moved social icons')
else:
    print('Target not found!')
    sys.exit(1)
