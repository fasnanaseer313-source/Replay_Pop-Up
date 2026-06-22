import sys

content = open('index.html', 'r', encoding='utf-8').read()

# 1. Remove the old icons block from the Let's Talk section
lets_talk_start = '''              <a href="https://instagram.com/replaypopup" class="booking-social-link" style="color: var(--orange); font-weight: 800; font-size: 1.1rem; letter-spacing: 1px; display: inline-block; margin-bottom: 15px;">@replaypopup &middot; Instagram</a>'''
lets_talk_end = '''            <div class="booking-location">'''

if lets_talk_start in content and lets_talk_end in content:
    start_idx = content.find(lets_talk_start) + len(lets_talk_start)
    end_idx = content.find(lets_talk_end)
    # Ensure we only replace if they are in the expected order
    if start_idx < end_idx:
        # replace the stuff between them with just the closing div
        new_between = '''\n            </div>\n\n'''
        content = content[:start_idx] + new_between + content[end_idx:]

# 2. Replace the footer Contact section
footer_target = '''            <h3 class="footer-col-title">Contact</h3>
            <div class="footer-contact-details">
              <a href="mailto:hello@replaypopup.in" class="footer-contact-link">hello@replaypopup.in</a>
              <a href="tel:+919987412025" class="footer-contact-link">+91 9987412025</a>
              <div class="footer-social-small">
                <a href="https://instagram.com/replaypopup" class="f-social">@replaypopup</a>
                <a href="#" class="f-social">LinkedIn</a> <span class="dot">•</span> <a href="#" class="f-social">Facebook</a>
              </div>
            </div>'''

new_footer = '''            <h3 class="footer-col-title contact-centered">Contact</h3>
            <div class="footer-contact-details">
              <style>
                .contact-social-icons {
                  display: flex;
                  gap: 15px;
                  align-items: center;
                  position: relative;
                  z-index: 20;
                  justify-content: flex-start;
                  flex-wrap: wrap;
                }
                .footer-col-title.contact-centered {
                  text-align: left;
                }
                @media (max-width: 768px) {
                  .contact-social-icons {
                    justify-content: center;
                  }
                  .footer-col-title.contact-centered {
                    text-align: center;
                  }
                }
                .social-icon-link {
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
                }
              </style>
              <div class="contact-social-icons gs-reveal">
                <!-- Email -->
                <a href="mailto:hello@replaypopup.in" class="social-icon-link" aria-label="Email Us" title="Email Us">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
                <!-- Phone -->
                <a href="tel:+919987412025" class="social-icon-link" aria-label="Call Us" title="Call Us">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </a>
                <!-- Instagram -->
                <a href="https://www.instagram.com/replaypopup?utm_source=qr&igsh=a3BwemVoa20xMWg5" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="Follow on Instagram" title="Follow on Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <!-- LinkedIn -->
                <a href="https://www.linkedin.com/company/replay-popup/" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="Connect on LinkedIn" title="Connect on LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <!-- Facebook -->
                <a href="https://www.facebook.com/share/18pEtFEfyi/" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="Follow on Facebook" title="Follow on Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
              </div>
            </div>'''

if footer_target not in content:
    print('Footer target not found!')
else:
    content = content.replace(footer_target, new_footer)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
