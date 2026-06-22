import sys

content = open('index.html', 'r', encoding='utf-8').read()

css_code = """
    <style>
      /* Mobile Carousel Styles */
      @media (max-width: 768px) {
        .looks-like-grid {
          display: flex !important;
          flex-wrap: nowrap !important;
          gap: 15px !important;
          overflow: visible !important;
          width: max-content !important;
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }
        .looks-like-section {
          overflow-x: hidden !important;
          width: 100vw !important;
          max-width: 100vw !important;
          margin-left: calc(-50vw + 50%) !important; /* breakout of container */
          padding-left: 20px; /* initial offset */
          padding-right: 20px;
          box-sizing: border-box;
          position: relative;
        }
        .ll-card {
          flex: 0 0 280px !important; /* fixed width for mobile cards */
          width: 280px !important;
        }
      }
    </style>
"""

js_code = """
    <script>
      // Mobile Continuous Carousel Animation
      document.addEventListener('DOMContentLoaded', () => {
        if (window.innerWidth > 768) return; // Only execute on mobile
        
        const grid = document.querySelector('.looks-like-grid');
        if (!grid) return;
        
        const cards = Array.from(grid.querySelectorAll('.ll-card'));
        if (cards.length === 0) return;
        
        // 1. Clone cards for infinite loop
        cards.forEach(card => {
          const clone = card.cloneNode(true);
          clone.classList.add('carousel-clone');
          grid.appendChild(clone);
        });
        
        // 2. Setup Variables
        let currentX = 0;
        let isDragging = false;
        let startX = 0;
        let dragCurrentX = 0;
        let velocity = 0;
        let lastTime = 0;
        let lastDragX = 0;
        let animationFrameId;
        let resumeTimeoutId;
        const speed = -0.5; // pixels per frame (right to left)
        
        // Card width + gap
        const cardWidth = cards[0].offsetWidth;
        const gap = 15; // match CSS gap
        const totalOriginalWidth = (cardWidth + gap) * cards.length;
        
        // 3. Animation Loop
        function animate() {
          if (!isDragging) {
            // Apply momentum if velocity exists, else constant auto-scroll
            if (Math.abs(velocity) > 0.1) {
              currentX += velocity;
              velocity *= 0.95; // friction
            } else {
              currentX += speed;
            }
          }
          
          // Infinite loop bounds
          if (currentX <= -totalOriginalWidth) {
            currentX += totalOriginalWidth;
          } else if (currentX > 0) {
            currentX -= totalOriginalWidth;
          }
          
          grid.style.transform = `translate3d(${currentX}px, 0, 0)`;
          animationFrameId = requestAnimationFrame(animate);
        }
        
        // Start animation
        animationFrameId = requestAnimationFrame(animate);
        
        // 4. Touch Interactions
        grid.addEventListener('touchstart', (e) => {
          isDragging = true;
          startX = e.touches[0].clientX;
          lastDragX = startX;
          dragCurrentX = currentX;
          velocity = 0;
          lastTime = performance.now();
          clearTimeout(resumeTimeoutId);
        }, { passive: true });
        
        grid.addEventListener('touchmove', (e) => {
          if (!isDragging) return;
          const currentTouchX = e.touches[0].clientX;
          const deltaX = currentTouchX - startX;
          currentX = dragCurrentX + deltaX;
          
          const currentTime = performance.now();
          const dt = currentTime - lastTime;
          if (dt > 0) {
            velocity = (currentTouchX - lastDragX) / (dt / 16); // normalize to approx 60fps frame
          }
          
          lastDragX = currentTouchX;
          lastTime = currentTime;
          
          // Loop seamlessly while dragging
          if (currentX <= -totalOriginalWidth) {
            currentX += totalOriginalWidth;
            dragCurrentX += totalOriginalWidth;
          } else if (currentX > 0) {
            currentX -= totalOriginalWidth;
            dragCurrentX -= totalOriginalWidth;
          }
          
          grid.style.transform = `translate3d(${currentX}px, 0, 0)`;
        }, { passive: true });
        
        grid.addEventListener('touchend', () => {
          isDragging = false;
          
          // Limit max momentum
          velocity = Math.min(Math.max(velocity, -20), 20);
          
          resumeTimeoutId = setTimeout(() => {
             // Velocity decays naturally via friction in the animate loop
             // until it reaches < 0.1, then constant speed takes over again
          }, 500);
        });
      });
    </script>
"""

# Inject CSS before </head>
if '</head>' in content and '/* Mobile Carousel Styles */' not in content:
    content = content.replace('</head>', css_code + '\n</head>')

# Inject JS before </body>
if '</body>' in content and '// Mobile Continuous Carousel Animation' not in content:
    content = content.replace('</body>', js_code + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected carousel CSS and JS successfully.")
