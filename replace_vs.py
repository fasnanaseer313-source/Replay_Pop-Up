import sys

content = open('index.html', 'r', encoding='utf-8').read()

target = '''        <div class="comparison-table gs-reveal">
          <div class="comp-col usual-exp">
            <div class="eyebrow" style="margin-bottom: 30px; color: #888; justify-content: flex-start;">THE USUAL EXPERIENCE</div>
            <ul class="comp-list">
              <li><span class="comp-icon">&minus;</span> Fight traffic to get there</li>
              <li><span class="comp-icon">&minus;</span> Watch the clock the whole time</li>
              <li><span class="comp-icon">&minus;</span> Pay extra for parking, snacks</li>
              <li><span class="comp-icon">&minus;</span> Drive everyone home, tired</li>
            </ul>
          </div>
          <div class="comp-col replay-exp">
            <div class="comp-overlay"></div>
            <div style="position: relative; z-index: 1;">
              <div class="eyebrow" style="margin-bottom: 30px; color: var(--orange); justify-content: flex-start;">REPLAY</div>
              <ul class="comp-list">
                <li><span class="comp-icon orange">&plus;</span> We come to you</li>
                <li><span class="comp-icon orange">&plus;</span> Enjoy at your own pace</li>
                <li><span class="comp-icon orange">&plus;</span> Nothing extra, ever</li>
                <li><span class="comp-icon orange">&plus;</span> You never left</li>
              </ul>
            </div>
          </div>
        </div>'''

replacement = '''        <div class="comparison-pills gs-reveal">
          <style>
            .comparison-pills {
              width: 100%;
              max-width: 900px;
              margin: 0 auto;
              display: flex;
              flex-direction: column;
              gap: 15px;
            }
            .comp-header-row {
              display: flex;
              justify-content: space-between;
              padding: 0 40px;
              margin-bottom: 10px;
              font-family: var(--f-body, sans-serif);
              font-size: 0.85rem;
              letter-spacing: 1px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .ch-left {
              color: #888;
            }
            .ch-right {
              color: var(--orange, #ff6a00);
            }
            .vs-row {
              display: flex;
              border-radius: 16px;
              position: relative;
              background: rgba(255,255,255,0.02);
              border: 1px solid rgba(255,255,255,0.05);
            }
            .vs-left, .vs-right {
              flex: 1;
              padding: 20px 40px;
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .vs-left {
              background: rgba(255,255,255,0.03);
              border-right: 1px solid rgba(255,255,255,0.05);
              border-top-left-radius: 16px;
              border-bottom-left-radius: 16px;
            }
            .vs-right {
              background: rgba(232, 98, 26, 0.05);
              border-top-right-radius: 16px;
              border-bottom-right-radius: 16px;
            }
            .vs-badge {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 28px;
              height: 28px;
              background: #2a2a2a;
              border: 1px solid rgba(255,255,255,0.15);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.65rem;
              font-weight: 700;
              color: #ccc;
              z-index: 10;
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
              letter-spacing: 0.5px;
            }
            .vs-icon {
              width: 36px;
              height: 36px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }
            .vs-icon.left-icon {
              background: rgba(255,255,255,0.08);
              color: #bbb;
            }
            .vs-icon.right-icon {
              background: rgba(232, 98, 26, 0.15);
              color: var(--orange, #ff6a00);
            }
            .vs-icon svg {
              width: 18px;
              height: 18px;
              fill: none;
              stroke: currentColor;
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .vs-text {
              font-family: var(--f-body, sans-serif);
              font-size: 1rem;
              color: #eee;
              font-weight: 500;
              line-height: 1.4;
            }
            .red-text { color: #ff6b6b; font-weight: 600; }
            .green-text { color: #4ade80; font-weight: 600; }
            
            @media (max-width: 768px) {
              .vs-row {
                flex-direction: column;
                border-radius: 12px;
              }
              .vs-left {
                border-right: none;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                border-bottom-left-radius: 0;
                border-top-right-radius: 12px;
                border-top-left-radius: 12px;
              }
              .vs-right {
                border-top-right-radius: 0;
                border-bottom-left-radius: 12px;
                border-bottom-right-radius: 12px;
              }
              .vs-left, .vs-right {
                padding: 15px 20px;
              }
              .vs-text {
                font-size: 0.95rem;
              }
              .comp-header-row {
                padding: 0 10px;
              }
            }
          </style>

          <div class="comp-header-row">
            <div class="ch-left">&bull; USUAL</div>
            <div class="ch-right">&bull; REPLAY</div>
          </div>

          <!-- Row 1 -->
          <div class="vs-row">
            <div class="vs-left">
              <div class="vs-icon left-icon">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div class="vs-text">Book a slot, hope it's <span class="red-text">not full</span></div>
            </div>
            <div class="vs-badge">VS</div>
            <div class="vs-right">
              <div class="vs-icon right-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div class="vs-text"><span class="green-text">Message</span> your space and date</div>
            </div>
          </div>

          <!-- Row 2 -->
          <div class="vs-row">
            <div class="vs-left">
              <div class="vs-icon left-icon">
                <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div class="vs-text"><span class="red-text">Fight</span> Bangalore traffic</div>
            </div>
            <div class="vs-badge">VS</div>
            <div class="vs-right">
              <div class="vs-icon right-icon">
                <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div class="vs-text">We come to you &mdash; <span class="green-text">zero travel</span></div>
            </div>
          </div>

          <!-- Row 3 -->
          <div class="vs-row">
            <div class="vs-left">
              <div class="vs-icon left-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="vs-text">Watch the clock the <span class="red-text">whole time</span></div>
            </div>
            <div class="vs-badge">VS</div>
            <div class="vs-right">
              <div class="vs-icon right-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="vs-text">Enjoy at your own pace, <span class="green-text">no clock</span></div>
            </div>
          </div>

          <!-- Row 4 -->
          <div class="vs-row">
            <div class="vs-left">
              <div class="vs-icon left-icon">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div class="vs-text">Pay for parking, the <span class="red-text">extra hour</span></div>
            </div>
            <div class="vs-badge">VS</div>
            <div class="vs-right">
              <div class="vs-icon right-icon">
                <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              </div>
              <div class="vs-text">We bring it, run it, <span class="green-text">pack it up</span></div>
            </div>
          </div>

          <!-- Row 5 -->
          <div class="vs-row">
            <div class="vs-left">
              <div class="vs-icon left-icon">
                <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div class="vs-text">Drive everyone home, <span class="red-text">tired</span></div>
            </div>
            <div class="vs-badge">VS</div>
            <div class="vs-right">
              <div class="vs-icon right-icon">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <div class="vs-text">You <span class="green-text">never left</span></div>
            </div>
          </div>

        </div>'''

if target not in content:
    print('Target not found in index.html!')
else:
    content = content.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Success')
